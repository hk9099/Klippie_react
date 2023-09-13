import React, { useState, useEffect } from 'react';

const ShuffleLoader = () => {
    const titles = [
        "Finding the best clips",
        "This may take up to 15 minutes",
        "Do not exit out of this screen",
    ];

    const [currentTitleIndex, setCurrentTitleIndex] = useState(0);

    useEffect(() => {
        const shuffleInterval = setInterval(() => {
            setCurrentTitleIndex(prevIndex => (prevIndex + 1) % titles.length);
        }, 5000);

        return () => clearInterval(shuffleInterval);
    }, [titles.length]);

    return (
        <div className="shuffle-loader">
            <div className="loader-icon"></div>
            <h2>{titles[currentTitleIndex]}</h2>
        </div>
    );
};

export default ShuffleLoader;
