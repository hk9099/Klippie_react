// PricingCardsContainer.js
import React, { useEffect, useState } from 'react';
import PricingCard from '../components/PricingCard';
// import Logo from '../assets/images/logo.svg';
import axios from 'axios';

function PricingCardsContainer() {
    const [pricingData, setPricingData] = useState([]);

    useEffect(() => {
        axios
            .post('https://dev-api.getklippie.com/v1/plans/get-all')
            .then((response) => {
                const pricing = [
                    {
                        title: 'Free',
                        id:response?.data?.data[0]?.chargebee_prices[0]?.id ?? null,
                        description: 'For Your Hobby Projects',
                        price: '$0',
                        time: 'Per Month',
                        planDetails: [
                            { Type: 'FOREVER FREE' },
                            { User: '1' },
                            { Min: '120/month' },
                            { Modal: 'Base' }
                        ],
                        benefitTitle: 'Discover the Following Benefits',
                        benefits: [
                            'Up to 1 hour of video upload time per project',
                            'Create an unlimited number of projects',
                            'Clips are not editable or exportable after 7 days'
                        ]
                    },
                    {
                        title: 'Creator',
                        price: '$50',
                        id: response?.data?.data[1]?.chargebee_prices[0]?.id ?? null,
                        time: 'Per Month',
                        description: 'For Individual Content Creators',
                        planDetails: [
                            { Type: 'SPECIAL PLAN' },
                            { User: '1' },
                            { Min: '1667/month' },
                            { Modal: 'Advanced' }
                        ],
                        benefitTitle: 'Enjoy These Exclusive Perks',
                        benefits: [
                            'Enjoy up to 2 hours of video upload time per project',
                            'Unlimited project creations with advanced features',
                            'Lifetime access to all created clips'
                        ]
                    }
                ];
                setPricingData(pricing);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

  


    return (
        <div className=' min-h-screen flex items-center justify-center flex-col'>
            {/* <div className="flex flex-row items-center justify-center">
                <img src={Logo} alt="Klippie Logo" className="w-20 h-20 bg-white rounded-full mr-3 mb-5" />
                <h1 className="text-4xl font-bold text-white">Klippie</h1>
            </div> */}
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
