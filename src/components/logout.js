import { useNavigate } from 'react-router-dom';
import { BiLogOut } from 'react-icons/bi';
import React, { Fragment, useRef, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
// import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

function Logout({ showLogout }) {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    // const [open] = useState(true);

    const cancelButtonRef = useRef(null);

    const handleLogout = () => {
        setIsLoading(true);
    };

    useEffect(() => {
        if (isLoading) {
            // Simulate a delay of 1.5 seconds
            const timer = setTimeout(() => {
                localStorage.removeItem('_auth');
                localStorage.removeItem('_sodfhgiuhih');
                setIsLoading(false);
                navigate('/');
            }, 1500);

            // Clean up the timer when the component unmounts
            return () => clearTimeout(timer);
        }
    }, [isLoading, navigate]);

    const handleDeactivate = () => {
        setIsOpen(false); // Close the modal
        handleLogout(); // Call the handleLogout function
    };

    return (
        <>

            {isLoading ? (
                <p
                    className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 `}
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
            )}

            <Transition.Root show={isOpen} as={Fragment}>
                <Dialog
                    as="div"
                    className="fixed inset-0 overflow-y-auto z-50"
                    initialFocus={cancelButtonRef}
                    onClose={() => setIsOpen(false)} // Close the modal
                >
                    <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                        </Transition.Child>

                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                <div className="sm:flex sm:items-start">
                                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6 text-yellow-600">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                                        </svg>

                                        {/* <ExclamationTriangleIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" /> */}
                                    </div>
                                    <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                                        <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                                            Log out account
                                        </Dialog.Title>
                                        <div className="mt-2">
                                            <p className="text-sm text-gray-500">
                                                Are you sure you want to Log Out?
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                                    <button
                                        type="button"
                                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                                        onClick={handleDeactivate} // Call the handleDeactivate function
                                    >
                                        Log Out
                                    </button>
                                    <button
                                        type="button"
                                        className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                                        onClick={() => setIsOpen(false)} // Close the modal
                                        ref={cancelButtonRef}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>
        </>
    );
}

export default Logout;
