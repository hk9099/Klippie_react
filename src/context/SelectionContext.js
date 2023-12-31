import React, { createContext, useContext, useState } from 'react';

const FileSelectedContext = createContext();

export function useFileSelected() {
    return useContext(FileSelectedContext);
}

export function FileSelectedProvider({ children }) {
    const [fileselected , setFileselected] = useState(false);
    const [fileselecteddata , setFileselecteddata] = useState([]);
    const [fileDelete , setFileDelete] = useState(false);

    return (
        <FileSelectedContext.Provider value={{ fileselected , setFileselected , fileselecteddata , setFileselecteddata , fileDelete , setFileDelete }}>
            {children}
        </FileSelectedContext.Provider>
    );
}
