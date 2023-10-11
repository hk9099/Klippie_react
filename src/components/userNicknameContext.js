// userNicknameContext.js
import React, { createContext, useContext, useState } from 'react';

const UserNicknameContext = createContext();

export function useUserNickname() {
    return useContext(UserNicknameContext);
}

export function UserNicknameProvider({ children }) {
    const [userName, setUserName] = useState("");
    const [userEmail, setUserEmail] = useState("");
    
    return (
        <UserNicknameContext.Provider value={{ userName, setUserName ,userEmail, setUserEmail}}>
            {children}
        </UserNicknameContext.Provider>
    );
}
