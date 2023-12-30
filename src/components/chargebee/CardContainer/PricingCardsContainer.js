/* eslint-disable no-unused-vars */
// PricingCardsContainer.js
import React, { useEffect, useState } from 'react';
import PricingCard from '../FreePlanCard/PricingCard.js';
import PaidPlanCard from '../PaidPlanCard/PaidPlanCard.js';
import { Switch } from '@mantine/core';
import useBaseUrl from '../../Config/Hooks/useBaseUrl.js';
// import Logo from '../assets/images/logo.svg';
import axios from 'axios';
import { RxCross2 } from "react-icons/rx";
import { Link, useNavigate } from 'react-router-dom';
import { TokenManager } from '../../Config/Token/getToken.js';
import { useSubscription } from '../Hooks/Context/SubscriptionContext.js';
export default function PricingCardsContainer({ isOpen, onClose,pricingData, freePricingData, paidPricingData, paidPricingDatamonth, paidPricingDatayear }) {
    const baseUrl = useBaseUrl();
    const navigate = useNavigate();
    const { PlanSubscribed, setSubscription, setPlanSubscribed } = useSubscription();
    if (process.env.NODE_ENV === 'development') {
        console.log(PlanSubscribed, "planSubscribed");
    }
   
    const [isLoading, setIsLoading] = useState(true);
    const user = TokenManager.getToken()
    const [userToken, setUserToken] = useState(null);

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
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${baseUrl}/v1/sub/get`,
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



    const [selectedInterval, setSelectedInterval] = useState('year');
    const [data , setData] = useState(paidPricingDatayear);
    const handleSwitchChange = (event) => {
        const newInterval = event.target.checked ? 'year' : 'month';
        setSelectedInterval(newInterval);
        setData(newInterval === 'month' ? paidPricingDatamonth : paidPricingDatayear);
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
                                <div className='flex justify-center items-center mb-3 w-full bg-gradient-to-r from-purple-800 to-indigo-900 text-white font-bold py-3 rounded-lg'>
                                    <span className="text-gray-300 dark:text-gray-100 text-sm font-extrabold font-mono mr-2">Monthly</span>
                                    <Switch
                                        checked={selectedInterval === 'year'}
                                        onChange={handleSwitchChange}
                                        color="#7052f5"
                                        styles={{
                                            root: {
                                                width: 'fit-content',
                                            },
                                            track: {
                                                border: '1px solid #fff',
                                            },
                                            thumb: {
                                                backgroundColor: '#7052f5',
                                            },
                                        }}
                                    />
                                    <span className="text-gray-300 dark:text-gray-100 text-sm font-extrabold font-mono ml-2">Annual</span>
                                    <span className="text-yellow-300 dark:text-yellow-400 text-lg font-extrabold ml-2">
                                        SAVE UP TO 20%
                                    </span>
                                </div>


                                <div className="flex items-center justify-center">

                                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 text-center lg:grid-cols-2 gap-4">

                                        <PricingCard
                                            freePricingData={freePricingData}
                                            highlightBorder={freePlan}
                                            onClose={onClose}
                                            fetchSubscriptions={fetchSubscriptions}
                                        />
                                        {data ? (
                                            <PaidPlanCard
                                                {...data}
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




