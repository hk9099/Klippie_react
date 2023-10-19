// PricingCardsContainer.js
import React, { useEffect, useState } from 'react';
import PricingCard from '../components/PricingCard';
import Logo from '../assets/images/logo.svg';
import axios from 'axios';

function PricingCardsContainer() {
    const [pricingData, setPricingData] = useState([]);

    useEffect(() => {
        axios
            .post('https://dev-api.getklippie.com/v1/plans/get-all')
            .then((response) => {
                setPricingData(response.data.data);
                console.log(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    return (
        <div className=' min-h-screen flex items-center justify-center flex-col'>
                <div className="flex flex-row items-center justify-center">
                    <img src={Logo} alt="Klippie Logo" className="w-20 h-20 bg-white rounded-full mr-3 mb-5" /> 
                    <h1 className="text-4xl font-bold text-white">Klippie</h1>
                </div>
        <div className="bg-[#0D0E20] flex items-center justify-center">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 text-center lg:grid-cols-2 gap-4">
                {pricingData.map((data, index) => (
                    <PricingCard key={index} {...data} />
                ))} 
            </div>
        </div>
        </div>
    );
}

export default PricingCardsContainer;
