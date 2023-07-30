import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function DownloadButton() {
    const [isDropdownOpen, setDropdownOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const toggleDropdown = () => {
        setDropdownOpen(!isDropdownOpen);
    };

    const handleItemClick = (item) => {
        setSelectedItem(item);
        setDropdownOpen(false); // Close the dropdown after selecting an item
    };

    // Function to get the color for the selected item
    const getSelectedItemColor = () => {
        switch (selectedItem) {
            case 'ACCEPTED':
                return { backgroundColor: '#AEF0A3', color: 'black' };
            case 'REJECTED':
                return { backgroundColor: '#FF5757', color: 'black' };
            case 'IN PROGRESS':
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
                style={{ backgroundColor: selectedItemStyle.backgroundColor, color: selectedItemStyle.color }}
                className="text-white w-[8rem] focus:outline-none font-medium rounded-3xl text-sm p-2 text-center inline-flex  items-center justify-center dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 dark:border-gray-700"
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
                            onClick={() => handleItemClick('ACCEPTED')}
                        >
                            ACCEPTED
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
                            onClick={() => handleItemClick('IN PROGRESS')}
                        >
                            IN&nbsp;PROGRESS
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
