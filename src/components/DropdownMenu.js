import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom';
import { IoSettingsOutline } from 'react-icons/io5';
import { RiAccountBoxFill } from 'react-icons/ri';
import Logout from '../Pages/logout';
import AccountModal from './AccountModal';

const DropdownMenu = ({ isOpen, position, showLogout }) => {
    const location = useLocation();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    
    //eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);

    const handleOpenAccountModal = () => {
            setIsAccountModalOpen(true);
    };

    return isOpen ? (
        <div
            className={`absolute ${position === 'up' ? 'bottom-0' : 'top-14'
                } right-0 bg-white border rounded  w-full dark:bg-custom-color-dark border-gray-200 dark:border-gray-700`}
        >
            <div className="py-1">
                <Menu.Item as="div" className="mx-1">
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

                    {isAccountModalOpen && (
                        <AccountModal showAccount={showLogout} onclose={() => setIsAccountModalOpen(false)} />
                    )}
                </Menu.Item>
                <Menu.Item as="div" className="mx-1">
                    <Link to="/dashboard">
                        <p
                            className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                                ${location.pathname === "/dashboard" && ''} ${!showLogout && 'justify-center'}`}
                        >
                            <span className='text-2xl h-6 w-12 flex items-center justify-center'><IoSettingsOutline /></span>
                            <span className={`${!showLogout && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                                Settings
                            </span>
                        </p>
                    </Link>
                </Menu.Item>
                <hr className="dark:border-gray-500 my-1" />
                <Menu.Item as="div" className="mx-1">
                    <Logout showLogout={showLogout} />
                </Menu.Item>
            </div>
        </div>
    ) : null;
};

export default DropdownMenu;
