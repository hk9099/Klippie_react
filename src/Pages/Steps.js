import React, { useState, useEffect } from 'react';
import axios from 'axios';
import qs from 'qs';
import { RingLoader, DotLoader, HashLoader } from 'react-spinners'; // Import loaders
// import { updateMainVideo } from '../components/data';

const Steps = ({ projectId }) => {
    const [loadingApi1, setLoadingApi1] = useState(false);
    const [messageApi1, setMessageApi1] = useState('');

    const [loadingApi2, setLoadingApi2] = useState(false);
    const [messageApi2, setMessageApi2] = useState('');

    const [loadingApi3, setLoadingApi3] = useState(false);
    const [messageApi3, setMessageApi3] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        const getToken = () => {
            const encodedToken = localStorage.getItem('_sodfhgiuhih');
            const userGoogle = localStorage.getItem('_auth');

            if (encodedToken) {
                const decodedToken = atob(encodedToken);
                const userInfo = JSON.parse(decodedToken);
                return userInfo.token.access_token;
            } else if (userGoogle) {
                const decodedGoogle = atob(userGoogle);
                const googleUserInfo = JSON.parse(decodedGoogle);
                return googleUserInfo.token.access_token;
            } else {
                return null;
            }
        };

        const makeApiCalls = async () => {
            try {
                const token = getToken();
                console.log('projectId:', projectId);
                console.log('Token:', token);

                if (!projectId || !token) {
                    return;
                }

                // API 1
                setMessageApi1('');
                setError('');
                setLoadingApi1(true);

                let data1 = qs.stringify({
                    'project_id': projectId
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

                const response1 = await axios.request(config1);
                console.log('API 1 success:', response1.data);
                setLoadingApi1(false);

                // API 2 (Only after API 1 success)
                if (response1.data.success) {
                    setMessageApi2('');
                    setError('');
                    setLoadingApi2(true);

                    let data2 = qs.stringify({
                        'project_id': projectId
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

                    const response2 = await axios.request(config2);
                    console.log('API 2 success:', response2.data);
                    setLoadingApi2(false);

                    // API 3 (Only after API 2 success)
                    if (response2.data.success) {
                        setMessageApi3('');
                        setError('');
                        setLoadingApi3(true);

                        let data3 = qs.stringify({
                            'project_id': projectId
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

                        const response3 = await axios.request(config3);
                        console.log('API 3 success:', response3.data.data.clips);

                        if (response3.data.data.clips && Array.isArray(response3.data.data.clips)) {
                            const videoClips = response3.data.data.clips.map(clip => ({
                                id: clip.id,
                                src: clip.clip_url,
                                title: clip.title,
                                description: clip.summary,
                                status: clip.status,
                            }));
                            console.log('videoClips', videoClips);
                        } else {
                            console.log('Invalid API 3 response:', response3.data);
                        }

                        setLoadingApi3(false);
                    }
                }
            } catch (error) {
                console.log(error);
                setError('Something went wrong. Please try again.');
                setLoadingApi1(false);
                setLoadingApi2(false);
                setLoadingApi3(false);
            }
        };

        makeApiCalls();
    }, [projectId]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                {loadingApi1 && (
                    <div className="flex items-center justify-center mb-4 text-blue-500">
                        <RingLoader
                            size={64}
                            color="#3B82F6"
                            loading={loadingApi1}
                        />
                        <span className="ml-4">Transcribing...</span>
                    </div>
                )}
                {messageApi1 && <div className="mb-4 text-green-500">{messageApi1}</div>}

                {loadingApi2 && (
                    <div className="flex items-center justify-center mb-4 text-blue-500">
                        <DotLoader
                            size={64}
                            color="#3B82F6"
                            loading={loadingApi2}
                        />
                        <span className="ml-4">Finding clips...</span>
                    </div>
                )}
                {messageApi2 && <div className="mb-4 text-green-500">{messageApi2}</div>}

                {loadingApi3 && (
                    <div className="flex items-center justify-center mb-4 text-blue-500">
                        <HashLoader
                            size={64}
                            color="#3B82F6"
                            loading={loadingApi3}
                        />
                        <span className="ml-4">Creating clips...</span>
                    </div>
                )}
                {messageApi3 && <div className="mb-4 text-green-500">{messageApi3}</div>}

                {error && <div className="mb-4 text-red-500">{error}</div>}
            </div>
        </div>
    );
};

export default Steps;
