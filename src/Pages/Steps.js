import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import { RingLoader, DotLoader, ScaleLoader } from 'react-spinners';
import AccordionSection from '../components/AccordionSection';

const Steps = ({ projectId, newhistoryvideoClips }) => {
    const [loadingApi1, setLoadingApi1] = useState(false);
    const [messageApi1, setMessageApi1] = useState('');
    const [newvideoClips, setNewvideoClips] = useState([]);
    const [loadingApi2, setLoadingApi2] = useState(false);
    const [messageApi2, setMessageApi2] = useState('');
    //eslint-disable-next-line
    const [allApiCompleted, setAllApiCompleted] = useState(false);
    const [loadingApi3, setLoadingApi3] = useState(false);
    const [messageApi3, setMessageApi3] = useState('');
    const [error, setError] = useState('');
    const apiCallsMadeRef = useRef(false);
    const prevProjectIdRef = useRef();
    const [updatedVideoClips, setUpdatedVideoClips] = useState([]); 


    useEffect(() => {
        const newvideoClips = newhistoryvideoClips
        // console.log(newvideoClips,'newvideoClipssssssssssssssssssssss')
        setNewvideoClips(newvideoClips)
    }, [newhistoryvideoClips])

    useEffect(() => {
        setUpdatedVideoClips(newvideoClips); 
        console.log(updatedVideoClips,'updatedVideoClips')
    }, [newvideoClips, updatedVideoClips]);

    const getToken = () => {
        const encodedToken = localStorage.getItem('_sodfhgiuhih');

        if (encodedToken) {
            const decodedToken = atob(encodedToken);
            const userInfo = JSON.parse(decodedToken);
            return userInfo.token.access_token;
        } else {
            return null;
        }
    };

    const makeApiCalls = async (projectId, token) => {
        try {
            console.log('projectId:', projectId);
            console.log('Token:', token);
            console.log('API 1 started');

            if (!projectId || !token) {
                return;
            }

            // API 1
            setAllApiCompleted(false);
            setMessageApi1('');
            setError('');
            setLoadingApi1(true);
            setNewvideoClips([]);

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
                        const newvideoClips = await Promise.all(response3.data.data.clips.map(async (clip) => {
                            // Split the time string into parts
                            const timeParts = clip.duration.split(':');

                            // Extract hours, minutes, seconds
                            const hours = parseInt(timeParts[0]);
                            const minutes = parseInt(timeParts[1]);
                            const seconds = parseInt(timeParts[2].split('.')[0]);

                            // Format the time in HH:MM:SS
                            const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

                            return {
                                id: clip.id,
                                src: clip.clip_url,
                                title: clip.title,
                                description: clip.summary,
                                status: clip.status,
                                time: formattedTime
                            };
                        }));
                        setNewvideoClips(newvideoClips);
                        
                    } else {
                        console.log('Invalid API 3 response:', response3.data);
                    }
                    setLoadingApi3(false);
                    setAllApiCompleted(true);
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

    useEffect(() => {
        const token = getToken();
        if (projectId && token) {
            if (!apiCallsMadeRef.current || prevProjectIdRef.current !== projectId) {
                apiCallsMadeRef.current = true;
                prevProjectIdRef.current = projectId;
                makeApiCalls(projectId, token);
            }
        }
    }, [projectId, allApiCompleted]);

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
                        <span className="ml-4"
                            style={{ userSelect: 'none' }}
                        >Transcribing...</span>
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
                        <span className="ml-4" style={{ userSelect: 'none' }}>Finding clips...</span>
                    </div>
                )}
                {messageApi2 && <div className="mb-4 text-green-500">{messageApi2}</div>}

                {loadingApi3 && (
                    <div className="flex items-center justify-center mb-4 text-blue-500">
                        <ScaleLoader
                            size={64}
                            color="#3B82F6"
                            loading={loadingApi3}
                        />
                        <span className="ml-4" style={{ userSelect: 'none' }}>Creating clips...</span>
                    </div>
                )}
                {messageApi3 && <div className="mb-4 text-green-500">{messageApi3}</div>}

                {error && <div className="mb-4 text-red-500">{error}</div>}
            </div>
            {!loadingApi1 && !loadingApi2 && !loadingApi3 && newvideoClips.length > 0 && (
                <AccordionSection videoClips={newvideoClips} />
            )}
        </div>
    );
};

export default Steps;
