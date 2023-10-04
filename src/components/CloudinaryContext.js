import { createContext, useContext, useState } from 'react';

const CloudinaryContext = createContext();

export function useCloudinary() {
    return useContext(CloudinaryContext);
}

export function CloudinaryProvider({ children }) {
    const [cloudinaryResponse, setCloudinaryResponse] = useState(null);
    console.log(cloudinaryResponse , "cloudinaryResponse");
    return (
        <CloudinaryContext.Provider value={{ cloudinaryResponse, setCloudinaryResponse }}>
            {children}
        </CloudinaryContext.Provider>
    );
}
