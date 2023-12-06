import React, { useState } from 'react';
import { Menu } from '@headlessui/react';
//eslint-disable-next-line
import { Link, useLocation } from 'react-router-dom';
import { RiAccountBoxFill } from 'react-icons/ri';
import { BsHeadset } from 'react-icons/bs'
import Logout from '../Pages/logout';
import AccountModal from './AccountModal';
import ContactUs from './ContectUs';

const DropdownMenu = ({ isOpen, position, showLogout, userNickname, userEmailAddress, avatar, onClose }) => {
    const location = useLocation();
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false); // Add state for Contact Us modal

    const handleOpenAccountModal = () => {
        setIsAccountModalOpen(true);
    };

    const handleOpenContactUsModal = () => {
        setIsContactUsModalOpen(true);
    };

    return isOpen ? (
        <div
            className={`absolute ${position === 'up' ? 'bottom-0' : 'top-14'
                } right-0 bg-white border rounded w-full dark:bg-custom-color-dark border-gray-200 dark:border-gray-700`}
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
                        <AccountModal showAccount={showLogout} onclose={() => setIsAccountModalOpen(false)}
                            userNickname={userNickname} userEmailAddress={userEmailAddress} avatar={avatar} />
                    )}
                </Menu.Item>
                <Menu.Item as="div" className="mx-1">
                    <p
                        onClick={handleOpenContactUsModal} // Open Contact Us modal on click
                        className="flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700">
                        <span className='text-2xl h-6 w-12 flex items-center justify-center'><BsHeadset /></span>
                        <span className='origin-left duration-300 hover:block text-sm'>Contect Us</span>
                    </p>

                    {isContactUsModalOpen && (
                        <ContactUs isOpen={isContactUsModalOpen} onClose={() => setIsContactUsModalOpen(false)} />
                    )}
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
