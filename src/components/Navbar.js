import React, { useState } from 'react';
import { BsStopwatch } from 'react-icons/bs';
import PricingModal from '../Pages/PricingCardsContainer';

const Navbar = ({ creaditBalance }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const secondsToHHMMSS = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        // const remainingSeconds = seconds % 60;

        const formatTwoDigits = (value) => {
            return value < 10 ? `0${value}` : value;
        };

        const formattedTime = `${formatTwoDigits(hours)}h ${formatTwoDigits(minutes)}min`;
        const minutesClass = minutes < 10 ? 'text-red-500 border border-red-500 rounded-lg select-none'
        : 'text-content'; 

        return { hours, minutes, formattedTime, minutesClass };
    };

    const { hours, minutes, formattedTime, minutesClass } = secondsToHHMMSS(creaditBalance);
    console.log(formattedTime, 'formattedddddddddddddddddddddddddddd');

    return (
        <>
            <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent h-[90px] '>
                <div className='flex justify-end items-center mx-auto'>
                    <div className='flex justify-end items-center w-100'>
                        {(!isNaN(hours) && !isNaN(minutes)) && (
                            <div className='p-3'>
                                <div className={`text-green-600 px-3 py-2  font-bold text-lg flex justify-center items-center p-3 ${minutesClass}`}>
                                    <BsStopwatch className={`me-2  `} />
                                    <span >{formattedTime}</span>
                                </div>
                            </div>
                        )}
                         <button
                            className='text-gray-300 w-[250px] text-center inline-block px-3 py-2 font-bold text-lg dark:bg-[#ffffff3a] p-3 rounded-lg'
                            onClick={openModal} // Open the modal when this button is clicked
                        >
                            <span className={`text-content`}>Add More Credit</span>
                        </button>
                    </div>
                </div>
            </nav>
            {isModalOpen && (
                <PricingModal isOpen={isModalOpen} onClose={closeModal} />
            )}
        </>
    );
};

export default Navbar;
