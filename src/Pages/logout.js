import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import React, { useState, useEffect } from 'react';
import { TokenManager } from '../components/Config/Token/getToken.js';
import { RxCross2 } from "react-icons/rx";
import { HiOutlineLogout } from "react-icons/hi";
import ToastNotification from "../components/Notification/ToastNotification";
import { Toaster } from 'react-hot-toast';

function Logout({ isOpen, onClose }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    // const [isOpen, setIsOpen] = useState(false);

    const handleLogout = () => {
        ToastNotification({message: 'Logging out...', type: 'loading'});
        setIsLoading(true);
    };

    useEffect(() => {
        if (isLoading) {
            // Simulate a delay of 1.5 seconds
            const timer = setTimeout(() => {
                localStorage.removeItem('_auth');
                localStorage.removeItem('_sodfhgiuhih');
                TokenManager.removeToken();
                setIsLoading(false);
                navigate('/');
                window.location.reload();
            }, 1500);

            // Clean up the timer when the component unmounts
            return () => clearTimeout(timer);
        }
    }, [isLoading, navigate]);

    const handleDeactivate = () => {
        setIsLoading(true);
        handleLogout(); 
    };

    return (
        <>
            <Toaster position="top-center" />
            {/* {isLoading ? (
                <p
                    className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover-bg-gray-700`}
                    onClick={() => setIsOpen(true)}
                >
                    <span className="text-2xl">
                        <BiLogOut />
                    </span>
                    <span className={`origin-left duration-300 hover:block text-sm flex items-center gap-x-2${showLogout ? '' : 'hidden'}`}>
                        Log Out
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
                        </div>
                    </span>
                </p>
            ) : (
                <p
                    className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 ${showLogout ? '' : 'justify-center'}`}
                    onClick={() => setIsOpen(true)}
                >
                    <span className="text-2xl h-6 w-12 flex items-center justify-center">
                        <BiLogOut />
                    </span>
                    <span className={`${showLogout ? '' : 'hidden'} origin-left duration-300 hover:block text-sm`}>
                        Log Out
                    </span>
                </p>
            )} */}

            
                <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center inset-0 backdrop-blur-md bg-black bg-opacity-60 z-50">
                    <div className="bg-gray-800 w-full max-w-md p-6 rounded-lg border shadow-lg z-50 border-gray-700 text-white">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Log Out</h2>
                            <RxCross2 className="text-2xl cursor-pointer" onClick={onClose} />
                        </div>
                        <p className="text-gray-300 mb-4">
                            Are you sure you want to log out?
                        </p>
                        <div className="flex justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 mr-2"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeactivate}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
                            >
                                <HiOutlineLogout className="mr-2" />
                                {isLoading ? 'Logging out...' : 'Log Out'}
                            </button>
                        </div>
                    </div>
                </div>
           
        </>
    );
}

export default Logout;
