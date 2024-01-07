import React, { useState, useEffect } from 'react';
import { BsStopwatch } from 'react-icons/bs';
import PricingCardsContainer from '../chargebee/CardContainer/PricingCardsContainer.js';
import axios from 'axios';
import { TokenManager } from '../Config/Token/getToken.js';
import { useSubscription } from '../chargebee/Hooks/Context/SubscriptionContext.js';
import { useSidebarContext } from '../Sidebar/Hooks/Context/SidebarContext.js';
import { useNavigate } from 'react-router-dom';
import useBaseUrl from '../Config/Hooks/useBaseUrl.js';

const Navbar = ({ creaditBalance }) => {
    const baseUrl = useBaseUrl();
    const { isApiCompleted } = useSidebarContext();
    const { subscribed, setSubscribed, setSubscription } = useSubscription();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = TokenManager.getToken()
    const [userToken, setUserToken] = useState(null);
    const [pricingData, setPricingData] = useState([]);
    const [freePricingData, setFreePricingData] = useState([]);
    const [paidPricingDatamonth, setPaidPricingDatamonth] = useState([]);
    const [paidPricingDatayear, setPaidPricingDatayear] = useState([]);
    const [paidPricingData, setPaidPricingData] = useState(paidPricingDatamonth);
    useEffect(() => {
        if (user === undefined || user === null) {
            navigate('/');
            window.location.reload();
            return;
        } else {
            const userToken = TokenManager.getToken()[1]
            setUserToken(userToken);
        }
    }, [navigate, user]);
    
    const openModal = () => {
        
        axios
        .post(`${baseUrl}/v1/plans/get-all`)
        .then((response) => {
            const pricing = [
                {
                    title: 'Free',
                    id: null,
                    description: 'For Your Hobby Projects',
                    price: '$0',
                    time: 'Per Month',
                    planDetails: [
                        { Type: 'FREE PLAN' },
                        { "Upload Minutes": '120 Minutes Per Month' },
                        { Users: '1' },
                        // { Modal: 'Base' }
                    ],
                    benefitTitle: 'Benefits',
                    benefits: [
                        'Upload Up to 1 Hour of Video Per Project',
                        '2 Hours of Free Upload Minutes Per Month',
                        'Access to Clips for Up to 7 Days'
                    ]
                },
                [{
                    title: 'Unlimited',
                    price: '$50',
                    id: response?.data?.data[0]?.chargebee_prices[1]?.id ?? null,
                    time: 'Per Month',
                    description: 'For Individual Content Creators',
                    planDetails: [
                        { Type: 'PRO PLAN' },
                        { 'Upload Minutes': 'Unlimited' },
                        { Users: '1' },
                        // { Modal: 'Advanced' }
                    ],
                    benefitTitle: 'Benefits',
                    benefits: [
                        'Upload Up to 2 Hours of Video Per Project',
                        'Unlimited Upload Minutes Per Month',
                        'Unlimited Clips Created Per Month'
                    ]
                },
                {
                    title: 'Unlimited',
                    price: '$499',
                    id: response?.data?.data[0]?.chargebee_prices[0]?.id ?? null,
                    time: 'Yearly ',
                    description: 'For Teams and Businesses',
                    planDetails: [
                        { Type: 'PRO PLAN' },
                        { 'Upload Minutes': 'Unlimited' },
                        { Users: '1' },
                        // { Modal: 'Advanced' }
                    ],
                    benefitTitle: 'Benefits',
                    benefits: [
                        'Upload Up to 2 Hours of Video Per Project',
                        'Unlimited Upload Minutes Per Month',
                        'Unlimited Clips Created Per Month'
                    ]
                }
                ]
            ];
            setIsModalOpen(true);
            console.log(pricing[0], 'pricing');
            setPricingData(pricing);
            setFreePricingData(pricing[0]);
            setPaidPricingDatamonth(pricing[1][0]);
            setPaidPricingDatayear(pricing[1][1]);
            setPaidPricingData(pricing[1][1]);
            
        })
        .catch((error) => {
            if (process.env.NODE_ENV === 'development') {
                console.log(error);
            }
        });
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
  
    // useEffect(() => {
       
    // }, []);

    useEffect(() => {
        if (baseUrl !== undefined) {
        const fetchSubscriptions = async () => {
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${baseUrl}/v1/sub/get`,
                headers: {
                    'accept': 'application/json',
                    'Authorization': 'Bearer ' + userToken,
                }
            };

            try {
                const response = await axios(config);
                if (process.env.NODE_ENV === 'development') {
                    console.log(response.data.data, 'response.data.data');
                }

                const subscriptionData = response.data.data;

                // Check if subscriptionData is not null
                if (subscriptionData !== null) {
                    setSubscription(subscriptionData);

                    // Check if is_active or is_lifetime is true
                    if (subscriptionData.is_active === true) {
                        setSubscribed(true);
                    }
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
            }
        };

        if (userToken === undefined || userToken === null) {
            return;
        } else {
            fetchSubscriptions();
        }
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApiCompleted, userToken,baseUrl]);



    const secondsToHHMMSS = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        // const remainingSeconds = seconds % 60;

        const formatTwoDigits = (value) => {
            return value < 10 ? `0${value}` : value;
        };

        const formattedTime = `${formatTwoDigits(hours)}h ${formatTwoDigits(minutes)}min`;
        let minutesClass = 'text-content';

        if (hours === 0 && minutes < 10) {
            // Set red border and text color when hr is 00 and min is less than 10
            minutesClass = 'text-red-500 border border-red-500 rounded-lg select-none';
        }

        return { hours, minutes, formattedTime, minutesClass };
    };

    const { hours, minutes, formattedTime, minutesClass } = secondsToHHMMSS(creaditBalance);

    useEffect(() => {
        secondsToHHMMSS(creaditBalance);
    }, [isApiCompleted, creaditBalance])

    return (
        <>
            <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent top-0 z-50 '>
                <div className='flex justify-end items-center mx-auto'>
                    <div className='flex justify-end items-center w-100'>
                        {subscribed === false && (!isNaN(hours) && !isNaN(minutes)) ? (
                            <div className={`p-3 ${subscribed ? 'hidden' : 'block'}`}>
                                <div className={`text-green-600 px-3 py-2 font-bold text-lg flex justify-center items-center select-none p-3 ${minutesClass}`}>
                                    <BsStopwatch className={`me-2`} />
                                    <span>{formattedTime}</span>
                                </div>
                            </div>
                        ) : (
                            <div className={`p-4 transform transition-transform duration-500 ease-in-out hover:scale-105`}>
                                <div className={`bg-gradient-to-r from-indigo-400 to-blue-900 text-white px-4 py-3 font-bold text-xxl flex justify-center items-center select-none rounded-lg shadow-lg`}>
                                Unlimited Plan
                                </div>
                            </div>

                        )}
                        <button
                            className={`upgradetopro text-white bg-gradient-to-r from-indigo-400 to-blue-900 hover:from-indigo-500 hover:to-blue-800 w-auto text-center px-6 py-2 font-bold text-lg p-3 rounded-lg relative overflow-hidden focus:outline-none ${subscribed ? 'hidden' : 'block'}`}
                            onClick={openModal}
                        >
                            <span className="text-content select-none">Upgrade</span>
                            <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
                        </button>

                    </div>
                </div>
            </nav>
            {isModalOpen && (
                <PricingCardsContainer 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                pricingData={pricingData}
                freePricingData={freePricingData}
                paidPricingData={paidPricingData}
                paidPricingDatamonth={paidPricingDatamonth}
                paidPricingDatayear={paidPricingDatayear}
                
                />
            )}
        </>
    );
};

export default Navbar;
