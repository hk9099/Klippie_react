import React, { createContext, useContext, useState } from 'react';

const ClipsFoundContext = createContext();

export const useClipsFoundStatus = () => useContext(ClipsFoundContext);

export const ClipsFoundProvider = ({ children }) => {
    const [clipsFound, setClipsFound] = useState(false);

    const setClipsFoundStatus = (status) => {
        setClipsFound(status);
    };

    return (
        <ClipsFoundContext.Provider value={{ clipsFound, setClipsFoundStatus }}>
            {children}
        </ClipsFoundContext.Provider>
    );
};
