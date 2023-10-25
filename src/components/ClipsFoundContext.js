import React, { createContext, useContext, useState } from 'react';

const ClipsFoundContext = createContext();

export const useClipsFoundStatus = () => useContext(ClipsFoundContext);

export const ClipsFoundProvider = ({ children }) => {
    const [clipsFound, setClipsFound] = useState(false);
    const [showHome, setShowHome] = useState(true);

    const setClipsFoundStatus = (status) => {
        setClipsFound(status);
    };

    const setShowHomeStatus = (status) => {
        setShowHome(status);
    };

    return (
        <ClipsFoundContext.Provider value={{ clipsFound, setClipsFoundStatus, showHome, setShowHomeStatus }}>
            {children}
        </ClipsFoundContext.Provider>
    );
};
