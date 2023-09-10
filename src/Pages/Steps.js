import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import AccordionSection from '../components/AccordionSection';
import Shuffleloader from '../components/shuffleloader.js';
import { updateMainVideo } from "../components/data.js";
import { useSidebarContext } from '../components/SidebarContext.js';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';



const Steps = ({ projectId, newhistoryvideoClips, errorMessage }) => {
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [newvideoClips, setNewvideoClips] = useState([]);
    //eslint-disable-next-line
    const [allApiCompleted, setAllApiCompleted] = useState(false);
    const [error, setError] = useState('');
    const apiCallsMadeRef = useRef(false);
    
    const prevProjectIdRef = useRef();
    //eslint-disable-next-line
    const [accordionVisible, setAccordionVisible] = useState(true);
    const { setIsApiCompleted } = useSidebarContext();
    useEffect(() => {
        setNewvideoClips(newhistoryvideoClips);
        console.log(newhistoryvideoClips, 'updatedVideoClips');
    }, [newhistoryvideoClips]);
    
    const controller = useRef(new AbortController());


    const handleCloseClick = () => {
        // When close button is clicked, cancel the ongoing API calls
        controller.current.abort();
        setIsLoading(false);
    };
    const closeButton = isLoading ? (
        <button
            className="absolute top-10 right-10 text-white font-bold  px-2 py-1 text-3xl rounded-full"
            onClick={handleCloseClick}
        >
            <AiOutlineClose />
        </button>
    ) : null;

  

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
        controller.current = new AbortController();
        setIsApiCompleted(false);
        try {
            console.log('projectId:', projectId);
            console.log('Token:', token);
            console.log('API 1 started');

            if (!projectId || !token) {
                return;
            }

            // API 1
            setAccordionVisible(true);
            setAllApiCompleted(false);
            setError('');
            setIsLoading(true);

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
                data: data1,
                signal: controller.current.signal,
            };

            const response1 = await axios.request(config1);
            console.log('API 1 success:', response1.data);
            const title = response1.data.data.title;
            const description = response1.data.data.description;
            const src = response1.data.data.video_url;
            const id = response1.data.data.id;

            // Calculate the duration of the video (assuming src is the video URL)
            const videoElement = document.createElement('video');
            videoElement.src = src;
            videoElement.onloadedmetadata = async () => {
                const durationInSeconds = Math.floor(videoElement.duration);

                // Convert duration to HH:MM:SS format
                const hours = Math.floor(durationInSeconds / 3600);
                const minutes = Math.floor((durationInSeconds % 3600) / 60);
                const seconds = durationInSeconds % 60;
                const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                const newMainVideo = [
                    { title, description, src, id, time: formattedDuration }
                ];

                try {
                    await updateMainVideo(newMainVideo); // Assuming updateMainVideo returns a promise
                    setIsApiCompleted(true);
                } catch (error) {
                    console.error("Error updating main video:", error);
                }
            };


            // API 2 (Only after API 1 success)
            if (response1.data.success) {
                setError('');

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
                    data: data2,
                    signal: controller.current.signal,
                };

                const response2 = await axios.request(config2);
                console.log('API 2 success:', response2.data);

                // API 3 (Only after API 2 success)
                if (response2.data.success) {
                    setError('');

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
                        data: data3,
                        signal: controller.current.signal,
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
                        setIsApiCompleted(false);
                    } else {
                        console.log('Invalid API 3 response:', response3.data);
                    }
                    setIsLoading(false);
                    setAllApiCompleted(true);
                }
            }
        } catch (error) {
            if (error.name === 'AbortError') {
                enqueueSnackbar('API call aborted',
                    { variant: 'info', autoHideDuration: 1000 });
            } else {
                // Handle error
                console.error('API call failed:', error.message);
                enqueueSnackbar('Clip creation Stoped',
                    { variant: 'error', autoHideDuration: 1500 ,anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'right',
                    },});
            }   
        } finally {
            setIsLoading(false);
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
        //eslint-disable-next-line
    }, [projectId, allApiCompleted]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
            <div className="text-center">
                {isLoading && (
                    <div className="flex items-center justify-centertext-blue-500">
                        <Shuffleloader />
                    </div>
                )}
                {error && <div className="mb-4 text-red-500">{error}</div>}
            </div>
            {closeButton}
            {!isLoading && newvideoClips.length > 0 && accordionVisible && (
                <AccordionSection videoClips={newvideoClips} />
            )}
        </div>
    );
};

export default Steps;
