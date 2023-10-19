import React, {  useState } from 'react';
import axios from 'axios';
import { TokenManager } from '../components/getToken.js';

function PricingCard({ id, chargebee_plan_id, credits, name, description, chargebee_prices }) {
    const [subRetrieved, setSubRetrieved] = useState(false);
    const userToken = TokenManager.getToken();

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
            if (data.data) {
                setSubRetrieved(true);
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
        if (chargebee_prices && chargebee_prices.length > 0 && chargebee_prices[0].id) {

            const cbInstance = window.Chargebee.init({
                site: process.env.REACT_APP_CHARGEBEE_SITE,
            });

            cbInstance.openCheckout({
                hostedPage: async () => {
                    try {
                        const checkout_hosted_page = await createCheckoutSession({
                            plan_id: chargebee_prices[0].id,
                            fprom_tid: ''
                        });
                        console.log(checkout_hosted_page.data.data.hosted_page.url, 'checkout_hosted_page');
                        return checkout_hosted_page.data.data.hosted_page
                    } catch (err) {
                        console.error(err);
                    }
                },
                loaded: () => { },
                close: () => {
                    console.log('closed');
                },
                success: async () => {
                    console.log('sucess')
                    await handlePolling();
                    setTimeout(closePolling, 20000);
                },
            });
        } else {
            console.log('ID not found');
        }

    };

    return (
        <div className="backdrop-blur-lg bg-white bg-opacity-40 dark:bg-opacity-30 dark:backdrop-blur-lg rounded-lg shadow-lg text-center p-6">
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-4">{name}</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">{description}</p>
            {/* <ul className="space-y-2 text-gray-700 dark:text-gray-400">
            <li>Feature 1</li>
            <li>Feature 2</li>
            <li>Feature 3</li>
        </ul> */}
            <button
                className="mt-6 bg-blue-500 text-white font-semibold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                onClick={handleButtonClick}
            >
                Get Started
            </button>
        </div>

    );
}


export default PricingCard;