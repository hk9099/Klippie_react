// userNicknameContext.js
import React, { createContext, useContext, useState } from 'react';

const UserNicknameContext = createContext();

export function useUserNickname() {
    return useContext(UserNicknameContext);
}

export function UserNicknameProvider({ children }) {
    const [userName, setUserName] = useState("");
    return (
        <UserNicknameContext.Provider value={{ userName, setUserName }}>
            {children}
        </UserNicknameContext.Provider>
    );
}
