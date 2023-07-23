import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
import { Link, useLocation } from 'react-router-dom'; 
import { MdOutlineLiveHelp } from 'react-icons/md';
import Logout from './logout';

// function classNames(...classes) {
//     return classes.filter(Boolean).join(' ');
// }

const DropdownMenu = ({ isOpen, position, showLogout }) => {
    const location = useLocation()

    return isOpen ? (
        <div
            className={`absolute ${position === 'up' ? 'bottom-14' : 'top-14'
                } right-0 bg-white border rounded  p-2 w-full dark:bg-custom-color-dark border-gray-200 dark:border-gray-700`}
        >
            <div className="py-1">
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
