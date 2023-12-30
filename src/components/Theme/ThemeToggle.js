import React, { useContext } from 'react';
import { ThemeContext } from './ThemeContext';

import { TiWeatherSunny } from 'react-icons/ti';
import { IoMdMoon } from 'react-icons/io';

const Toggle = () => {
    const { theme, setTheme } = useContext(ThemeContext);

    return (
        <div className='transition ease-in-out duration-500 rounded-full p-2 flex items-center justify-between'>
            {theme === 'dark' ? (
                <TiWeatherSunny
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className='text-gray-500 text-2xl dark:text-gray-400 cursor-pointer'
                />
            ) : (
                <IoMdMoon
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className='text-gray-500 text-2xl dark:text-gray-400 cursor-pointer'
                />
            )}
        </div>
    );
};

export default Toggle;
