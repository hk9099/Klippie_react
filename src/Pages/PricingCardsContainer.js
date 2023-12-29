// PricingCardsContainer.js
import React, { useEffect, useState } from 'react';
import PricingCard from '../components/PricingCard';
import PaidPlanCard from '../components/PaidPlanCard';
import { Switch } from '@mantine/core';
// import Logo from '../assets/images/logo.svg';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { TokenManager } from '../components/getToken.js';
import { useSubscription } from '../context/SubscriptionContext.js';
export default function PricingCardsContainer({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { PlanSubscribed, setSubscription, setPlanSubscribed } = useSubscription();
    if (process.env.NODE_ENV === 'development') {
        console.log(PlanSubscribed, "planSubscribed");
    }
    const [pricingData, setPricingData] = useState([]);
    const [freePricingData, setFreePricingData] = useState([]);
    const [paidPricingDatamonth, setPaidPricingDatamonth] = useState([]);
    const [paidPricingDatayear, setPaidPricingDatayear] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const user = TokenManager.getToken()
    const [userToken, setUserToken] = useState(null);
    console.log(userToken, 'userToken');

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
    const [freePlan, setFreePlan] = useState(false);
    const [paidPlan, setPaidPlan] = useState(false);
    const fetchSubscriptions = async () => {
        console.log('Fetching subscriptions');
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev-api.getklippie.com/v1/sub/get',
            headers: {
                'accept': 'application/json',
                'Authorization': 'Bearer ' + userToken,
            }
        };

        const response = await axios(config);
        if (process.env.NODE_ENV === 'development') {
            console.log(response, 'response.data.data.is_active');
        }
        setSubscription(response.data.data);
        if (response.data.data === null) {
            setFreePlan(true);
            setPaidPlan(false);
            setIsLoading(false);
        } else {
            setPaidPlan(true);
            setFreePlan(false);
            setPlanSubscribed(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (userToken === undefined || userToken === null) {
            console.log('userToken is null');
        } else {
            fetchSubscriptions();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userToken]);

    useEffect(() => {
        axios
            .post('https://dev-api.getklippie.com/v1/plans/get-all')
            .then((response) => {
                console.log(response, 'respoooooooooooooooooonse');
                const pricing = [
                    {
                        title: 'Free',
                        id: null,
                        description: 'For Your Hobby Projects',
                        price: '$0',
                        time: 'Per Month',
                        planDetails: [
                            { Type: 'Free Plan' },
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
                        title: 'Unlimited Plan',
                        price: '$50',
                        id: response?.data?.data[0]?.chargebee_prices[1]?.id ?? null,
                        time: 'Per Month',
                        description: 'For Individual Content Creators',
                        planDetails: [
                            { Type: 'PREMIUM PLAN' },
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
                        title: 'Enterprise Plan',
                        price: '$499',
                        id: response?.data?.data[0]?.chargebee_prices[0]?.id ?? null,
                        time: 'Yearly ',
                        description: 'For Teams and Businesses',
                        planDetails: [
                            { Type: 'ENTERPRISE PLAN' },
                            { 'Upload Minutes': 'Unlimited' },
                            { Users: 'Unlimited' },
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
                console.log(pricing[0], 'pricing');
                setPricingData(pricing);
                setFreePricingData(pricing[0]);
                setPaidPricingDatamonth(pricing[1][0]);
                setPaidPricingDatayear(pricing[1][1]);
                setPaidPricingData(pricing[1][1]);
                setIsLoading(false);
            })
            .catch((error) => {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
                setIsLoading(false);
            });
    }, []);

    const [selectedInterval, setSelectedInterval] = useState('month');
    const [paidPricingData, setPaidPricingData] = useState(paidPricingDatamonth);
    const handleSwitchChange = (event) => {
        const newInterval = event.target.checked ? 'year' : 'month';
        setSelectedInterval(newInterval);
        setPaidPricingData(newInterval === 'month' ? paidPricingDatamonth : paidPricingDatayear);
    };


    return (
        <>
            {isLoading ? (
                <></>
            ) : (
                <div className={`fixed inset-0 flex justify-center items-center z-50 ${isOpen ? 'block' : 'hidden'} h-screen overflow-y-auto select-none`}>
                    <div className="fixed inset-0 backdrop-blur-md bg-black bg-opacity-60 z-40"></div>
                    <div className="relative w-auto max-h-full z-50">
                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-800">
                            <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
                                <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Upgrade your plan
                                </h3>
                                <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-hide="defaultModal">
                                    <RxCross2 className="text-2xl text-white cursor-pointer" onClick={onClose} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto">
                                <div className="flex items-center justify-center">

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 text-center lg:grid-cols-2 gap-4">
                                        <div >
                                            <p className="p-4"></p>
                                            <PricingCard
                                                freePricingData={freePricingData}
                                                highlightBorder={freePlan}
                                                onClose={onClose}
                                                fetchSubscriptions={fetchSubscriptions}
                                            />
                                        </div>
                                        <div>
                                            <div className='flex justify-center items-center mb-3'>
                                                <span className="text-gray-700 dark:text-gray-100 text-sm font-bold font-nunito mr-2">Month</span>
                                                <Switch
                                                    checked={selectedInterval === 'year'}
                                                    onChange={handleSwitchChange}
                                                    styles={{
                                                        root: {
                                                            width: 'fit-content',
                                                        }
                                                    }}
                                                />
                                                <span className="text-gray-700 dark:text-gray-100 text-sm font-bold font-nunito ml-2">Year</span>
                                            </div>
                                            {paidPricingData ? (
                                                <PaidPlanCard
                                                    {...paidPricingData}
                                                    highlightBorder={paidPlan}
                                                    onClose={onClose}
                                                    fetchSubscriptions={fetchSubscriptions}
                                                />
                                            ) : (
                                                null
                                            )}
                                        </div>

                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-center p-4 border-t border-solid border-gray-300 rounded-b">
                                <p className="text-gray-700 dark:text-gray-300 text-center">
                                    For more information, please contact us at
                                    <Link
                                        href="mailto:support@getklippie.com"
                                        className="text-blue-500 hover:underline ml-1"
                                        onClick={() => window.open('mailto:support@getklippie.com', '_blank')}
                                    >
                                        support@getklippie.com
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );

}




