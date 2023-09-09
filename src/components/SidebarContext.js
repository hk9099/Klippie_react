import { createContext, useContext, useState } from 'react';

const SidebarContext = createContext();

export const SidebarProvider = ({ children }) => {
    const [isApiCompleted, setIsApiCompleted] = useState(false);
    const [refreshProfile, setRefreshProfile] = useState(false);
    return (
        <SidebarContext.Provider value={{ isApiCompleted, setIsApiCompleted , refreshProfile, setRefreshProfile}}>
            {children}
        </SidebarContext.Provider>
    );
};

export const useSidebarContext = () => useContext(SidebarContext);
