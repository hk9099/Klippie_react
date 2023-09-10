import React , { useEffect } from 'react';

const Loader = ({ progress, onComplete }) => {

    useEffect(() => {
        // Check if progress is at 100% and call onComplete
        if (progress === 100) {
            onComplete();
        }
    }, [progress, onComplete]);
    return (
        <div className="loader-container">
            <div className="loader">
                <div className="loader-progress" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="loader-text">
                {progress === 100 ? 'Processing...' : `Progress: ${progress.toFixed(2)}%`}
            </div>
        </div>
    );
};

export default Loader;
