import React, { useState } from 'react';
import axios from 'axios';
import { TokenManager } from '../components/getToken.js';
import { BiCheck } from 'react-icons/bi';
import { useSubscription } from '../context/SubscriptionContext.js';

function PricingCard({ title, price, time, description, planDetails, benefits, id, benefitTitle, highlightBorder ,onClose ,fetchSubscriptions}) {
    const { setPlanSubscribed ,setSubscribed} = useSubscription();
    const [subRetrieved, setSubRetrieved] = useState(false);
    const userToken = TokenManager.getToken()[1]

    const createCheckoutSession = async (data) => {
        try {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/sub/create-checkout-session',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                data: data
            };

            const response = await axios(config);
            return response;
        } catch (err) {
            console.error(err);
        }
    };

    const getSubscription = async () => {
        try {
            const response = await axios.post('https://dev-api.getklippie.com/v1/sub/get', null, {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
            });
            return response;
        } catch (err) {
            console.error(err);
        }
    };

    const handlePolling = async () => {
        if (!subRetrieved) {
            const data = await getSubscription();
            if (data.data !== null) {
                setSubRetrieved(true);
                console.log('subscribed');
                setPlanSubscribed(true);
                setSubscribed(true);
                fetchSubscriptions();
                onClose();
                return;
            } else {
                setTimeout(handlePolling, 1000);
            }
        } else {
            setTimeout(handlePolling, 1000);
        }
    };

    const closePolling = () => {
        if (!subRetrieved) {
            setSubRetrieved(true);
        }
    };

    const handleButtonClick = () => {
        console.log(id, 'id');
        if (id !== null) {

            const cbInstance = window.Chargebee.init({
                site: process.env.REACT_APP_CHARGEBEE_SITE,
            });

            cbInstance.openCheckout({
                hostedPage: async () => {
                    try {
                        const checkout_hosted_page = await createCheckoutSession({
                            plan_id: id,
                            fprom_tid: ''
                        });
                        console.log(checkout_hosted_page.data.data.hosted_page.url, 'checkout_hosted_page');
                        return checkout_hosted_page.data.data.hosted_page
                    } catch (err) {
                        console.error(err);
                    }
                },
                loaded: () => {
                    console.log('loaded')
                 },
                close: () => {
                    setPlanSubscribed(true);
                    fetchSubscriptions();
                },
                success: async () => {
                    console.log('sucess')
                    await handlePolling();
                    setTimeout(closePolling, 20000);
                    setPlanSubscribed(true);
                    fetchSubscriptions();
                },
                step: () => {
                    console.log('step')
                },
                error: () => {
                    console.log('error')
                },
            });
        } else {
            console.log('ID not found');
        }

    };

    return (
        // <div className="backdrop-blur-lg bg-white bg-opacity-40 dark:bg-opacity-30 dark:backdrop-blur-lg rounded-lg shadow-lg text-center p-6">
        //     <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{name}</h2>
        //     <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
        //     {/* <ul className="space-y-2 text-gray-700 dark:text-gray-400">
        //     <li>Feature 1</li>
        //     <li>Feature 2</li>
        //     <li>Feature 3</li>
        // </ul> */}
        //     <button
        //         className="mt-6 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
        //         onClick={handleButtonClick}
        //     >
        //         Get Started
        //     </button>
        // </div>
        <div className={`bg-gray-700 bg-opacity-10 dark:bg-opacity-30 rounded-3xl shadow-lg text-center p-6 border border-gray-500 dark:border-gray-400 ${highlightBorder ? 'dark:border-indigo-700 border-4 border-dashed border-opacity-50 bg-indigo-900 bg-opacity-10' : ''}`}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100  font-nunito">
                {title}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-5 font-nunito">
                {description}
            </p>
            <h1 className="text-5xl font-[300] text-gray-900 dark:text-gray-100 mb-1 font-nunito">
                {price}
            </h1>
            <h3 className="text-lg font-light text-gray-900 dark:text-gray-100 mb-4 font-nunito">
                {time}
            </h3>
            <ul className={`space-y-3 text-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:bg-opacity-30 p-4 rounded-lg font-nunito ${highlightBorder ? 'border-2 border-indigo-700 bg-indigo-700 bg-opacity-10' : ''}`}>
                {planDetails.map((detail, index) => (
                    <li key={index} className={index === 0 || index === planDetails.length - 1 ? '' : 'border-b border-gray-400 dark:border-gray-700 pb-2 font-nunito'}>
                        {Object.entries(detail).map(([key, value], i) => (
                            <div key={key} className={`flex justify-between font-nunito ${i === 0 && index === 0 ? 'text-center' : ''}`}>
                                <span className={`font-bold dark:text-gray-100 ${i === 0 && index === 0 ? 'mx-auto text-xl' : ''}`}>
                                    {i === 0 && index === 0 ? value : key}
                                </span>
                                <span>{i === 0 && index === 0 ? '' : value}</span>
                            </div>
                        ))}
                    </li>
                ))}
                <button
                    className={` bg-gray-900 text-white font-extrabold text-xl py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 block w-full font-nunito border-[0.2px] border-gray-900 dark:border-gray-400 ${highlightBorder ? 'bg-indigo-900 cursor-not-allowed hover:bg-indigo-700' : ''}`}
                    onClick={handleButtonClick}
                    name={`button_${id}`}
                    disabled={highlightBorder}
                >
                    {highlightBorder ? 'Subscribed' : id === null ? 'Start Creating' : 'Get Started'}
                </button>
            </ul>
            <div className="relative mt-4">
                <hr className="absolute top-1/2 left-0 w-1/3 border border-gray-400 dark:border-gray-700" />
                <span className="text-gray-700 z-10 dark:text-gray-400 text-sm py-1 font-nunito relative dark:bg-[#0D0E20] dark:bg-opacity-100 px-3 rounded-xl ">
                    {benefitTitle}
                </span>
                <hr className="absolute top-1/2 right-0 w-1/3 border border-gray-400 dark:border-gray-700" />
            </div>


            <ul className=" text-gray-700 dark:text-gray-400 mt-4">
                {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center my-3">
                        <BiCheck className="text-green-500 mr-2" />
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default PricingCard;