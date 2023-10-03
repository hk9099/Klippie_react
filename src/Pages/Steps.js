import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import AccordionSection from '../components/AccordionSection';
// import Shuffleloader from '../components/shuffleloader.js';
import { updateMainVideo } from "../components/data.js";
import { useSidebarContext } from '../components/SidebarContext.js';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
var getToken = () => {
    const encodedToken = localStorage.getItem('_sodfhgiuhih');

    if (encodedToken) {
        const decodedToken = atob(encodedToken);
        const userInfo = JSON.parse(decodedToken);
        return userInfo.token.access_token;
    } else {
        return null;
    }
};
var HOSTINGURL = process.env.REACT_APP_HOSTING_URL;

const Steps = ({ projectId: propProjectId, newhistoryvideoClips, errorMessage }) => {
    const [currentProjectId, setProjectId] = useState(propProjectId);
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [newvideoClips, setNewvideoClips] = useState([]);
    //eslint-disable-next-line
    const [allApiCompleted, setAllApiCompleted] = useState(false);
    const [error, setError] = useState('');
    const apiCallsMadeRef = useRef(false);
    const [uniqueMessages, setUniqueMessages] = useState([]);
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





    const makeApiCalls = async (propProjectId, token) => {
        controller.current = new AbortController();
        setIsApiCompleted(false);
        try {

            if (!propProjectId || !token) {
                return;
            }

            // API 1
            setAccordionVisible(true);
            setAllApiCompleted(false);
            setError('');
            setIsLoading(true);

            let data1 = qs.stringify({
                'project_id': propProjectId
            });

            let config1 = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/project/test',
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

            setIsLoading(false);
            setAllApiCompleted(true);
            setError('');
        } catch (error) {
            if (error.name === 'AbortError') {
                enqueueSnackbar('API call aborted',
                    { variant: 'info', autoHideDuration: 1000 });
            } else {
                // Handle error
                console.error('API call failed:', error.message);
                enqueueSnackbar('Clip creation Stoped',
                    {
                        variant: 'error', autoHideDuration: 1500, anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'right',
                        },
                    });
            }
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        const token = getToken();
        if (currentProjectId && token) {
            // Step 3: Poll the project/stats API every 10 seconds
            const intervalId = setInterval(() => {
                const fetchData = async () => {
                    try {
                        const data = JSON.stringify({
                            "id": currentProjectId,
                        });
                        const config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://dev-api.getklippie.com/v1/project/stats',
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${token}`
                            },
                            data: data
                        };

                        const response = await axios.request(config);
                        console.log(response.data, 'response.data');
                        const message = response.data.data;

                        if (message === "Transcribing video completed") {
                            setIsApiCompleted(true);
                        }

                        if (message === 'Clips Founded') {
                            let data = qs.stringify({
                                'project_id': currentProjectId
                            });

                            let data1 = JSON.stringify({
                                "id": currentProjectId,
                            });

                            let config1 = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: 'https://dev-api.getklippie.com/v1/project/get-by-id',
                                headers: {
                                    'accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': 'Bearer ' + token
                                },
                                data: data1
                            };

                            axios.request(config1)
                                .then((response1) => {
                                    console.log(JSON.stringify(response.data));
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
                                            // setIsApiCompleted(true);
                                        } catch (error) {
                                            console.error("Error updating main video:", error);
                                        }
                                    };
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `${HOSTINGURL}/v1/clip/get-by-id`,
                                headers: {
                                    'accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': `Bearer ${token}`
                                },
                                data: data
                            };

                            const response = await axios.request(config);
                            console.log(response)
                            if (response.data.data && Array.isArray(response.data.data)) {
                                const newvideoClips = await Promise.all(response.data.data.map(async (clip) => {
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
                                        time: formattedTime,
                                        type: clip.type,
                                    };
                                }));
                                setNewvideoClips(newvideoClips);
                                setAccordionVisible(true);
                                setError('');
                                setProjectId(null);
                                console.log('New video clips:', newvideoClips);
                            } else {
                                console.log('Invalid API response:', response.data);
                                setAccordionVisible(false);
                                setProjectId('');
                                // setError('We could not find the clips for this project');
                                enqueueSnackbar('We could not find the clips for this project', {
                                    variant: 'error',
                                    autoHideDuration: 1500,
                                    anchorOrigin: {
                                        vertical: 'top',
                                        horizontal: 'right',
                                    },
                                });
                            }
                        }

                        // Check if the message is not in the list of unique messages
                        if (!uniqueMessages.includes(message)) {
                            // Add the message to the list of unique messages
                            setUniqueMessages([...uniqueMessages, message]);

                            // Display the message (you can do this in your UI as needed)
                            enqueueSnackbar(message, { variant: 'info', autoHideDuration: 1000 });
                        }
                    } catch (error) {
                        console.log(error);
                    }
                };

                fetchData();
            }, 10000); // 10 seconds

            // Clean up the interval when the component unmounts or when projectId/token change
            return () => clearInterval(intervalId);
        }
    }, [currentProjectId, uniqueMessages, enqueueSnackbar, setIsApiCompleted]);

    // useEffect(() => {
    //     setProjectId(propProjectId);
    // }, [propProjectId])

    useEffect(() => {
        const token = getToken();
        if (propProjectId && token) {
            if (!apiCallsMadeRef.current || prevProjectIdRef.current !== propProjectId) {
                apiCallsMadeRef.current = true;
                prevProjectIdRef.current = propProjectId;
                makeApiCalls(propProjectId, token);
            }
        }
        //eslint-disable-next-line
    }, [propProjectId, allApiCompleted]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
            <div className="text-center">
                {/* {isLoading && (
                    <div className="flex items-center justify-centertext-blue-500">
                        <Shuffleloader />
                    </div>
                )} */}
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
