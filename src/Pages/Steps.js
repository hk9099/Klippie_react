import React, { useState } from 'react';
import axios from 'axios';
import qs from 'qs';

const ApiCaller = () => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const encodedToken = localStorage.getItem('_sodfhgiuhih');
    const userGoogle = localStorage.getItem('_auth');

    let userInfo;
    let googleUserInfo;

    if (encodedToken) {
        const decodedToken = atob(encodedToken);
        userInfo = JSON.parse(decodedToken);
        var token = userInfo.token.access_token;
        console.log(token);
    } else if (userGoogle) {
        const decodedGoogle = atob(userGoogle);
        googleUserInfo = JSON.parse(decodedGoogle);
        console.log(googleUserInfo);
    }

    const makeApiCalls = () => {
        // Set loading to true to display the loader
        setLoading(true);
        setError('');

        // API 1
        let data1 = qs.stringify({
            'project_id': 'a30e3194-1e55-48f4-8872-ffac27c0effb'
        });

        let config1 = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.getklippie.com/v1/project/transcribe',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Bearer ${token}`
            },
            data: data1
        };

        axios.request(config1)
            .then((response) => {
                // Handle API 1 success
                console.log(JSON.stringify(response.data));
                setMessage('API 1 completed successfully.');

                // API 2
                let data2 = qs.stringify({
                    'project_id': 'a30e3194-1e55-48f4-8872-ffac27c0effb'
                });

                let config2 = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.getklippie.com/v1/project/clipfinder',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': `Bearer ${token}`
                    },
                    data: data2
                };

                axios.request(config2)
                    .then((response) => {
                        // Handle API 2 success
                        console.log(JSON.stringify(response.data));
                        setMessage('API 2 completed successfully.');

                        // API 3
                        let data3 = qs.stringify({
                            'project_id': 'a30e3194-1e55-48f4-8872-ffac27c0effb'
                        });

                        let config3 = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://api.getklippie.com/v1/clip/create',
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Authorization': `Bearer ${token}`
                            },
                            data: data3
                        };

                        axios.request(config3)
                            .then((response) => {
                                // Handle API 3 success
                                console.log(JSON.stringify(response.data));
                                setMessage('API 3 completed successfully.');
                                // All API calls completed successfully, hide loader
                                setLoading(false);
                            })
                            .catch((error) => {
                                // Handle API 3 error
                                console.log(error);
                                setError('Error occurred in API 3.');
                                setLoading(false); // Hide loader on error
                            });
                    })
                    .catch((error) => {
                        // Handle API 2 error
                        console.log(error);
                        setError('Error occurred in API 2.');
                        setLoading(false); // Hide loader on error
                    });
            })
            .catch((error) => {
                // Handle API 1 error
                console.log(error);
                setError('Error occurred in API 1.');
                setLoading(false); // Hide loader on error
            });
    };

    return (
        <div>
            {loading && <div className="loader">Loading...</div>}
            {message && <div className="message">{message}</div>}
            {error && <div className="error">{error}</div>}
            <button onClick={makeApiCalls}>Make API Calls</button>
        </div>
    );
};

export default ApiCaller;
