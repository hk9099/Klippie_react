// PricingCardsContainer.js
import React, { useEffect, useState } from 'react';
import PricingCard from '../components/PricingCard';
// import Logo from '../assets/images/logo.svg';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { Link } from 'react-router-dom';
import { TokenManager } from '../components/getToken.js';
import { useSubscription } from '../context/SubscriptionContext.js';

export default function PricingCardsContainer({ isOpen, onClose }) {
    const { PlanSubscribed, setSubscription, setPlanSubscribed } = useSubscription();
    console.log(PlanSubscribed);
    const [pricingData, setPricingData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const userToken = TokenManager.getToken()[1]
    const [freePlan, setFreePlan] = useState(false);
    const [paidPlan, setPaidPlan] = useState(false);
    const fetchSubscriptions = async () => {
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
        console.log(response, 'response.data.data.is_active');
        setSubscription(response.data.data);
        if (response.data.data === null) {
            setFreePlan(true);
            setIsLoading(false);
        } else {
            setPaidPlan(true);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchSubscriptions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        axios
            .post('https://dev-api.getklippie.com/v1/plans/get-all')
            .then((response) => {
                const pricing = [
                    {
                        title: 'Free',
                        id: response?.data?.data[0]?.chargebee_prices[0]?.id ?? null,
                        description: 'For Your Hobby Projects',
                        price: '$0',
                        time: 'Per Month',
                        planDetails: [
                            { Type: 'FOREVER FREE' },
                            { User: '1' },
                            { Min: '120/month' },
                            { Modal: 'Base' }
                        ],
                        benefitTitle: 'Discover the Following Benefits',
                        benefits: [
                            'Up to 1 hour of video upload time per project',
                            'Create an unlimited number of projects',
                            'Clips are not editable or exportable after 7 days'
                        ]
                    },
                    {
                        title: 'Creator',
                        price: '$50',
                        id: response?.data?.data[1]?.chargebee_prices[0]?.id ?? null,
                        time: 'Per Month',
                        description: 'For Individual Content Creators',
                        planDetails: [
                            { Type: 'SPECIAL PLAN' },
                            { User: '1' },
                            { Min: '1667/month' },
                            { Modal: 'Advanced' }
                        ],
                        benefitTitle: 'Enjoy These Exclusive Perks',
                        benefits: [
                            'Enjoy up to 2 hours of video upload time per project',
                            'Unlimited project creations with advanced features',
                            'Lifetime access to all created clips'
                        ]
                    }
                ];
                setPricingData(pricing);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, []);




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
                                        {pricingData.map((data, index) => (
                                            <PricingCard key={index} {...data} highlightBorder={
                                                (freePlan && index === 0) || (paidPlan && index === 1)
                                            } onClose={onClose}
                                                fetchSubscriptions={fetchSubscriptions}
                                            />
                                        ))}
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




