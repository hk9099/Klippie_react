import React, { useEffect, useState } from 'react'

// const getInitialTheme = () => {
//     if (typeof window !== 'undefined' && window.localStorage) {
//         const storedPref = window.localStorage.getItem('color-theme')
//         if (typeof storedPref === 'string') {
//             return storedPref
//         }

//         const userMedia = window.matchMedia('prefers-color-scheme:dark')
//         if (userMedia.matches) {
//             return 'dark'
//         }
//         return 'light' 
//     }
// }
export const ThemeContext = React.createContext()

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark'); // Set the default theme here

    const rawSetTheme = (rawTheme) => {
        const root = window.document.documentElement;
        root.classList.remove(rawTheme === 'dark' ? 'light' : 'dark');
        root.classList.add(rawTheme);
        localStorage.setItem('color-theme', rawTheme);
    };

    useEffect(() => {
        rawSetTheme(theme);
    }, [theme]);

    return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
};
