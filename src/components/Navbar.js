import React, { useState, useEffect } from 'react';
import { BsStopwatch } from 'react-icons/bs';
import PricingCardsContainer from '../Pages/PricingCardsContainer';
import axios from 'axios';
import { TokenManager } from '../components/getToken.js';
import { useSubscription } from '../context/SubscriptionContext.js';
import { useSidebarContext } from '../context/SidebarContext';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ creaditBalance }) => {
    const { isApiCompleted } = useSidebarContext();
    const { subscribed, setSubscribed, setSubscription } = useSubscription();
    if (process.env.NODE_ENV === 'development') {
        console.log(subscribed, 'subscribed');
    }
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
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
    }, [navigate, user]); const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    useEffect(() => {
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isApiCompleted, userToken]);



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
                                <div className={`bg-gradient-to-r from-purple-600 to-pink-400 text-white px-4 py-3 font-bold text-xxl flex justify-center items-center select-none rounded-lg shadow-lg`}>
                                    Lifetime Unlimited
                                </div>
                            </div>

                        )}
                        <button
                            className={`upgradetopro text-white bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 w-auto text-center px-6 py-2 font-bold text-lg p-3 rounded-lg relative overflow-hidden focus:outline-none ${subscribed ? 'hidden' : 'block'}`}
                            onClick={openModal}
                        >
                            <span className="text-content select-none">Upgrade</span>
                            <div className="absolute inset-0 border-2 border-dashed border-white rounded-lg transform scale-0 group-hover:scale-100 transition-transform"></div>
                        </button>

                    </div>
                </div>
            </nav>
            {isModalOpen && (
                <PricingCardsContainer isOpen={isModalOpen} onClose={closeModal} />
            )}
        </>
    );
};

export default Navbar;
