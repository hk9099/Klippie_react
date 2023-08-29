import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isApiCompleted, setIsApiCompleted] = useState(false);

    return (
        <SidebarContext.Provider value={{ isApiCompleted, setIsApiCompleted }}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => useContext(SidebarContext);
