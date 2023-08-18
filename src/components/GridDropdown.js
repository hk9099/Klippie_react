import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';


export default function DownloadButton({ status, clipId }) {
    console.log("status", status)
    console.log("clipId", clipId)
    const [isDropdownOpen, setDropdownOpen] = useState(false);

    // Define the default selected item and its associated colors
    const defaultSelectedItem = status;
    const defaultSelectedItemStyle = { backgroundColor: '#FFC34E', color: 'black' };

    // Use the default selected item as the initial state
    const [selectedItem, setSelectedItem] = useState(defaultSelectedItem);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const getToken = () => {
        const encodedToken = localStorage.getItem('_sodfhgiuhih');
        const userGoogle = localStorage.getItem('_auth');

        if (encodedToken) {
            const decodedToken = atob(encodedToken);
            const userInfo = JSON.parse(decodedToken);
            return userInfo.token.access_token;
        } else if (userGoogle) {
            const decodedGoogle = atob(userGoogle);
            const googleUserInfo = JSON.parse(decodedGoogle);
            return googleUserInfo.token.access_token;
        } else {
            return null;
        }
    };

    const handleItemClick = async (item) => {
        setSelectedItem(item);
        setDropdownOpen(false);
        const token = getToken();
        console.log("token",token)
        try {
            const response = await axios.post('https://api.getklippie.com/v1/clip/status-update', qs.stringify({
                'status': item,
                'clip_id': clipId
            }), {
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log(JSON.stringify(response.data));
        } catch (error) {
            console.log(error);
        }
    };

    // Function to get the color for the selected item
    const getSelectedItemColor = () => {
        switch (selectedItem) {
            case 'APPROVED':
                return { backgroundColor: '#AEF0A3', color: 'black' };
            case 'REJECTED':
                return { backgroundColor: '#FF5757', color: 'black' };
            case 'IN REVIEW':
                return { backgroundColor: '#FFC34E', color: 'black' };
            default:
                return { backgroundColor: null, color: 'white' };
        }
    };

    const selectedItemStyle = getSelectedItemColor();

    return (
        <>
            <button
                id="dropdownDefaultButton"
                onClick={toggleDropdown}
                style={{
                    backgroundColor: selectedItemStyle.backgroundColor || defaultSelectedItemStyle.backgroundColor,
                    color: selectedItemStyle.color || defaultSelectedItemStyle.color
                }}
                className="text-white w-[8rem] focus:outline-none font-medium rounded-3xl text-sm p-2 text-center inline-flex items-center justify-center dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
                type="button"
            >
                {selectedItem ? selectedItem : "Status"}
            </button>
            <div
                id="dropdown"
                className={`z-10 ${isDropdownOpen ? 'block' : 'hidden'
                    } bg-black divide-y divide-gray-100 border-t-[1px] mt-2 shadow w-[8rem] dark:bg-transparent m-auto mt-2`}
            >
                <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="dropdownDefaultButton">
                    <li>
                        <Link
                            href="#"
                            className={`block px-4 py-2 dark:bg-[#AEF0A3] rounded-3xl dark:text-black text-center `}
                            onClick={() => handleItemClick('APPROVED')}
                        >
                            APPROVED
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className={`block px-4 py-2 dark:bg-[#FF5757] rounded-3xl dark:text-black  text-center  mt-1`}
                            onClick={() => handleItemClick('REJECTED')}
                        >
                            REJECTED
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className={`block px-4 py-2 dark:bg-[#FFC34E] rounded-3xl dark:text-black  text-center  mt-1`}
                            onClick={() => handleItemClick('IN REVIEW')}
                        >
                            IN&nbsp;REVIEW
                        </Link>
                    </li>
                    <li>
                        <Link
                            href="#"
                            className="block px-4 py-4 hover:bg-gray-100  rounded-3xl dark:hover:bg-gray-600 dark:bg-gray-400 dark:text-gray-200 text-center mt-1"
                            onClick={() => handleItemClick(null)}
                        >
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    );
}
