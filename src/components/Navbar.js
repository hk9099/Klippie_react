import React, { useState } from 'react';
import { BsStopwatch } from 'react-icons/bs';

const Navbar = () => {
    const [isHoveringTime, setIsHoveringTime] = useState(false);
    const [isHoveringButton, setIsHoveringButton] = useState(false);

    const handleTimeHover = () => {
        setIsHoveringTime(true);
    };

    const handleTimeLeave = () => {
        setIsHoveringTime(false);
    };

    const handleButtonHover = () => {
        setIsHoveringButton(true);
    };

    const handleButtonLeave = () => {
        setIsHoveringButton(false);
    };

    return (
        <>
            <nav className='border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent h-[90px]'>
                <div className='flex justify-end items-center mx-auto'>
                    <div className="flex justify-end items-center w-100">
                        <div
                            className={`text-green-600 px-3 py-2 font-bold text-lg flex justify-center items-center m-3 ${isHoveringTime ? 'hovered' : ''
                                }`}
                            onMouseEnter={handleTimeHover}
                            onMouseLeave={handleTimeLeave}
                        >
                            <BsStopwatch className='mr-2' />
                            {isHoveringTime ? 'Free' : '2h 00m'}
                        </div>
                        <button
                            className={`text-gray-300 text-center inline-block px-3 py-2 font-bold text-lg dark:bg-[#ffffff3a] m-3 rounded-lg ${isHoveringButton ? 'hovered' : ''
                                }`}
                            onMouseEnter={handleButtonHover}
                            onMouseLeave={handleButtonLeave}
                        >
                            {isHoveringButton ? 'Coming soon' : 'Add More Credit'}
                        </button>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default Navbar;
