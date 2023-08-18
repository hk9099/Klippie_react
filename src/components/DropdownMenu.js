import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { MdOutlineLiveHelp } from 'react-icons/md';
import { RiAccountBoxFill } from 'react-icons/ri';
import Logout from '../Pages/logout';
import AccountModal from './AccountModal';

const DropdownMenu = ({ isOpen, position, showLogout }) => {
    const location = useLocation();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenAccountModal = () => {
        setIsLoading(false);
        setTimeout(() => {
            setIsLoading(false);
            setIsAccountModalOpen(true);
        }, 1000);
    };

    return isOpen ? (
        <div
            className={`absolute ${position === 'up' ? 'bottom-14' : 'top-14'
                } right-0 bg-white border rounded  p-2 w-full dark:bg-custom-color-dark border-gray-200 dark:border-gray-700`}
        >
            <div className="py-1">
                <Menu.Item as="div">
                    <p
                        onClick={handleOpenAccountModal}
                        className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                                ${location.pathname === "/dashboard" && ''} ${!showLogout && 'justify-center'}`}
                    >
                        <span className='text-2xl h-6 w-12 flex items-center justify-center'><RiAccountBoxFill /></span>
                        <span className={`${!showLogout && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                            Account
                        </span>
                    </p>

                    {isLoading && (
                        <div className="fixed top-0 left-0 z-50 w-screen h-screen flex items-center justify-center" style={{ background: "rgba(0,0,0,.7)", margin: "0px" }}>
                            <div className="bg-white border py-2 px-5 rounded-lg flex items-center flex-col">
                                <div className="loader-dots block relative w-20 h-5 mt-2">
                                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                                    <div className="absolute top-0 mt-1 w-3 h-3 rounded-full bg-green-500"></div>
                                </div>
                                <div className="text-gray-500 text-xs font-light mt-2 text-center">
                                    Please wait...
                                </div>
                            </div>
                        </div>
                    )}

                    {isAccountModalOpen && (
                        <AccountModal showAccount={showLogout} onclose={() => setIsAccountModalOpen(false)} />
                    )}
                </Menu.Item>
                <Menu.Item as="div">
                    <Link to="/dashboard">
                        <p
                            className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                                ${location.pathname === "/dashboard" && ''} ${!showLogout && 'justify-center'}`}
                        >
                            <span className='text-2xl h-6 w-12 flex items-center justify-center'><MdOutlineLiveHelp /></span>
                            <span className={`${!showLogout && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                                Get Help
                            </span>
                        </p>
                    </Link>
                </Menu.Item>
                <Menu.Item as="div">
                    <Logout showLogout={showLogout} />
                </Menu.Item>
            </div>
        </div>
    ) : null;
};

export default DropdownMenu;
