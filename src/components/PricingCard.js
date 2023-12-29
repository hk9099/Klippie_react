import React from 'react';
import { BiCheck } from 'react-icons/bi';
import { NumberFormatter } from '@mantine/core';
function PricingCard({ freePricingData,id, highlightBorder }) {
    return (
        <div className={`bg-gray-700 bg-opacity-10 dark:bg-opacity-30 rounded-3xl shadow-lg text-center p-6 border border-gray-500 dark:border-gray-400 ${highlightBorder ? 'dark:border-indigo-700 border border-dashed border-opacity-50 bg-indigo-900 bg-opacity-10' : ''}`}>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100  font-nunito">
                {  freePricingData.title}
            </h2>
            <h1 className="text-5xl font-[300] text-gray-900 dark:text-gray-100 mb-1 font-nunito mt-2">
                <NumberFormatter prefix="$" value={freePricingData.price} thousandSeparator />
            </h1>
            <ul className={`space-y-3 mt-2 text-gray-700 dark:text-gray-400 dark:bg-gray-700 dark:bg-opacity-30 p-4 rounded-lg font-nunito ${highlightBorder ? 'border border-indigo-700 bg-indigo-700 bg-opacity-10' : ''}`}>
                {freePricingData.planDetails.map((detail, index) => (
                    <li key={index} className={index === 0 || index === freePricingData.planDetails.length - 1 ? '' : 'border-b border-gray-400 dark:border-gray-700 pb-2 font-nunito'}>
                        {Object.entries(detail).map(([key, value], i) => (
                            <div key={key} className={`flex justify-between font-nunito ${i === 0 && index === 0 ? 'text-center' : ''}`}>
                                <span className={`font-bold dark:text-gray-100 ${i === 0 && index === 0 ? 'mx-auto text-xl' : ''}`}>
                                    {i === 0 && index === 0 ? value : key}
                                </span>
                                <span>{i === 0 && index === 0 ? '' : value}</span>
                            </div>
                        ))}
                    </li>
                ))}
                <button
                    className={` bg-gray-900 text-white font-extrabold text-xl py-2 px-4 rounded-lg hover:bg-gray-800 transition duration-300 block w-full font-nunito border-[0.2px] border-gray-900 dark:border-gray-400 ${highlightBorder ? 'bg-indigo-900 cursor-not-allowed hover:bg-indigo-700' : ''}`}
                    // onClick={handleButtonClick}
                    name={`button_${id}`}
                    disabled={highlightBorder}
                >
                    {highlightBorder ? 'Your Current Plan' : id === null ? 'Start Creating' : 'Upgrade'}
                </button>
            </ul>
            <div className="relative mt-4">
                <hr className="absolute top-1/2 left-0 w-1/3 border border-gray-400 dark:border-gray-700" />
                <span className="text-gray-700 z-10 dark:text-gray-400 text-sm py-1 font-nunito relative dark:bg-[#0D0E20] dark:bg-opacity-100 px-3 rounded-xl ">
                    {freePricingData.title}
                </span>
                <hr className="absolute top-1/2 right-0 w-1/3 border border-gray-400 dark:border-gray-700" />
            </div>
            <ul className=" text-gray-700 dark:text-gray-400 mt-4">
                {freePricingData.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center my-3">
                        <BiCheck className="text-green-500 mr-2" />
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
    );
}


export default PricingCard;