import React, { useState, useEffect } from 'react';
import { BsStopwatch } from 'react-icons/bs';
import PricingCardsContainer from '../Pages/PricingCardsContainer';
import axios from 'axios';
import { TokenManager } from '../components/getToken.js';
import { useSubscription } from '../context/SubscriptionContext.js';

const Navbar = ({ creaditBalance }) => {
    const { setSubscription } = useSubscription();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const userToken = TokenManager.getToken()[1]
    const [subscribed, setSubscribed] = useState(false);
    console.log(subscribed, 'subscribed');
    const openModal = () => {
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
                console.log(response, 'response.data.data.is_active');
                setSubscription(response.data.data);    
                if (response.data.data.is_active === true) {
                    console.log('subscribed');
                    setSubscribed(true);
                } 
            } catch (error) {
                // console.log(error);
            }
        }
        fetchSubscriptions();
            // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);
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
    // console.log(formattedTime, 'formattedddddddddddddddddddddddddddd');

    return (
        <>
            <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent sticky top-0 z-50 '>
                <div className='flex justify-end items-center mx-auto'>
                    <div className='flex justify-end items-center w-100'>
                        {(!isNaN(hours) && !isNaN(minutes)) && (
                            <div className='p-3'>
                                <div className={`text-green-600 px-3 py-2  font-bold text-lg flex justify-center items-center select-none p-3 ${minutesClass}`}>
                                    <BsStopwatch className={`me-2 `} />
                                    <span >{formattedTime}</span>
                                </div>
                            </div>
                        )}
                       
                            <button
                                className={`text-gray-300 w-auto text-center px-6 py-2 font-bold text-lg dark:bg-[#ffffff3a] p-3 rounded-lg ${subscribed ? 'hidden' : 'block'}`}
                                onClick={openModal}
                            >
                                <span className={`text-content select-none`}>Upgrade</span>
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
