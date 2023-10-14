// PricingCardsContainer.js
import React from 'react';
import PricingCard from '../components/PricingCard';
import Logo from '../assets/images/logo.svg';
// import { createCheckoutSession } from '../components/chargebee/chargebee';

const pricingData = [
    {
        plan: 'Basic',
        price: '19',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    {
        plan: 'Pro',
        price: '39',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
    },
    // {
    //     plan: 'Pro',
    //     price: '39',
    //     features: ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4'],
    // },
];



function PricingCardsContainer() {
    return (
        <div className="bg-[#0D0E20] min-h-screen flex items-center justify-center">
            <div className="container mx-auto p-4">
                <div className="flex items-center justify-center mb-8">
                    <img src={Logo} alt="Logo" className="w-20 h-20 mr-5 bg-white rounded-full" />
                    <h1 className="text-5xl font-semibold text-white text-center ">Klippie Pricing</h1>
                </div>
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
