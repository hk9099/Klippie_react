import React, { useState } from 'react';
import { Menu, Button, Text, rem } from '@mantine/core';
import {
    IconSettings,
    IconHeadset,
    IconLogout,
    IconMessageCircle,
    IconTrash,
    IconArrowsLeftRight,
} from '@tabler/icons-react';
import AccountModal from './AccountModal';
import { BsThreeDots } from "react-icons/bs";
import { RotatingLines } from "react-loader-spinner";
import ContactUs from './ContectUs';
import Logout from '../Pages/logout';

export default function ToggleMenuButton({ position, showLogout, userNickname, userEmailAddress, avatar, onClose }) {
    const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isContactUsModalOpen, setIsContactUsModalOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const handleOpenAccountModal = () => {
        setIsAccountModalOpen(true);
    };

    const handleOpenContactUsModal = () => {
        setIsContactUsModalOpen(true);
    };
    return (
        <>
            <Menu shadow="md" width={240}
            transitionProps={{ transition: 'pop', duration: 150 }}
            >
                <Menu.Target>
                    {/* <Button>Toggle menu</Button> */}
                    <div
                        className="user group flex items-center gap-x-2 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 justify-between "
                        // onClick={handleUserModal}
                        // onClick={toggleDropdown}
                        title={userNickname}
                    >
                        {avatar ? (
                            <img src={avatar} className="shrink-0 h-9 w-9 rounded-sm" alt="User Avatar" />
                        ) : (
                            <div>
                                <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="25" visible={true} />
                            </div>
                        )}
                        <div className={` origin-left duration-300 hover:block text-sm overflow-hidden text-ellipsis whitespace-nowrap`}>
                            <p className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white font-bold">
                                {userNickname}
                            </p>
                        </div>
                        <BsThreeDots />
                    </div>
                </Menu.Target>

                <Menu.Dropdown
                    classNames={{
                        dropdown: 'dark:bg-custom-color-dark border-[#f8fafc42!important]'
                    }}
                >
                    <Menu.Item leftSection={<IconSettings style={{ width: rem(20), height: rem(20) }} />} onClick={handleOpenAccountModal}
                        styles={{
                            item: {
                                color: 'white',
                                padding: '0.75rem 1rem'
                            }
                        }}
                        classNames={{
                            item: 'hover:text-[#fff!important] dark:hover:bg-gray-700'
                        }}
                    >
                        Settings
                    </Menu.Item>
                    <Menu.Item leftSection={
                        <IconHeadset
                            style={{ width: rem(20), height: rem(20) }} />}
                        styles={{
                            item: {
                                color: 'white',
                                padding: '0.75rem 1rem'
                            }
                        }}
                        classNames={{
                            item: 'hover:text-[#fff!important] dark:hover:bg-gray-700'
                        }}
                        onClick={handleOpenContactUsModal}
                    >
                        Contact Us
                    </Menu.Item>
                    <Menu.Divider color='#f8fafc42'
                        styles={{
                            divider: {
                                borderTop: '1px solid #f8fafc42'
                            }
                        }}
                    />
                    <Menu.Item
                        leftSection={<IconLogout style={{ width: rem(20), height: rem(20) }} />}
                        styles={{
                            item: {
                                color: 'white',
                                padding: '0.75rem 1rem'
                            }
                        }}
                        classNames={{
                            item: 'hover:text-[#fff!important] dark:hover:bg-gray-700'
                        }}
                        onClick={() => setIsOpen(true)}
                    >
                        Logout
                        {/* <Logout
                            showLogout={showLogout}
                            // isOpen={isOpen}
                            onClose={() => setIsOpen(false)}
                        /> */}
                    </Menu.Item>
                </Menu.Dropdown>
            </Menu>
            {isAccountModalOpen && (
                <AccountModal
                    showAccount={showLogout}
                    onClose={() => setIsAccountModalOpen(false)}
                    userNickname={userNickname}
                    userEmailAddress={userEmailAddress}
                    avatar={avatar}
                />
            )}
            {isContactUsModalOpen && (
                <ContactUs isOpen={isContactUsModalOpen} onClose={() => setIsContactUsModalOpen(false)} />
            )}
            {isOpen && (
                <Logout
                    showLogout={showLogout}
                    // isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    userNickname={userNickname}
                    />
            )}
        </>
    );
}