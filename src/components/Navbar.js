import React, { useState } from 'react';
import { BsStopwatch } from 'react-icons/bs';

const Navbar = () => {
    const [isHovered, setIsHovered] = useState(false);

    const handleTextHover = () => {
        setIsHovered(true);
    };

    const handleTextLeave = () => {
        setIsHovered(false);
    };

    return (
        <>
            <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent h-[90px]'>
                <div className='flex justify-end items-center mx-auto'>
                    <div className='flex justify-end items-center w-100'>
                        <div className='p-3'>
                            <div
                                className={`text-green-600 px-3 py-2 font-bold text-lg flex justify-center items-center p-3 ${isHovered ? 'hovered-text' : ''}`}
                                onMouseEnter={handleTextHover}
                                onMouseOver={handleTextHover}
                                onMouseLeave={handleTextLeave}
                            >
                                <BsStopwatch className={`text-content ${isHovered ? 'hidden' : ''}`} />
                                <span className={`text-content ${isHovered ? 'hidden' : ''}`}>2h 00m</span>
                                <span className={`text-content ${isHovered ? '' : 'hidden'}`}>Free</span>
                            </div>
                        </div>
                        <button
                            className='text-gray-300 w-[250px] text-center inline-block px-3 py-2 font-bold text-lg dark:bg-[#ffffff3a] p-3 rounded-lg                                                      '
                            onMouseEnter={handleTextHover}
                            onMouseOver={handleTextHover}
                            onMouseLeave={handleTextLeave}
                        >
                            <span className={`text-content ${isHovered ? 'hidden' : ''}`}>Add More Credit</span>
                            <span className={`text-content ${isHovered ? '' : 'hidden'}`}>Coming soon</span>
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
};

export default Navbar;
