import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import qs from 'qs';
import AccordionSection from '../components/AccordionSection';
// import Shuffleloader from '../components/shuffleloader.js';
import { updateMainVideo } from '../components/data';
import { useSidebarContext } from '../components/SidebarContext.js';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import HomeScreen from './HomeScreen';
import Suggetionpopup from '../components/Suggetionpopup';
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

const Steps = ({ newhistoryvideoClips, errorMessage, cloudinaryResponse }) => {
    //eslint-disable-next-line
    const [currentProjectId, setProjectId] = useState();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [newvideoClips, setNewvideoClips] = useState([]);
    //eslint-disable-next-line
    const [allApiCompleted, setAllApiCompleted] = useState(false);
    const [error, setError] = useState('');
    const apiCallsMadeRef = useRef(false);
    //eslint-disable-next-line
    const [uniqueMessages, setUniqueMessages] = useState([]);
    const prevProjectIdRef = useRef();
    //eslint-disable-next-line
    const [accordionVisible, setAccordionVisible] = useState(true);
    const { setIsApiCompleted } = useSidebarContext();
    const [isSuggetionpopupOpen, setIsSuggetionpopupOpen] = useState(false);
    useEffect(() => {
        setNewvideoClips(newhistoryvideoClips);
        console.log(newhistoryvideoClips, 'updatedVideoClips');
    }, [newhistoryvideoClips]);



    const handleCloseClick = () => {
        // When close button is clicked, cancel the ongoing API calls
    
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

    const makeApiCalls = async (cloudinaryResponse, token) => {

        setIsApiCompleted(false);
        try {

            if (!cloudinaryResponse || !token) {
                return;
            }

            // API 1
            setAccordionVisible(true);
            setAllApiCompleted(false);
            setError('');
            setIsLoading(true);
            try {
                let data = JSON.stringify({
                    "public_id": cloudinaryResponse.public_id,
                    "width": cloudinaryResponse.width,
                    "height": cloudinaryResponse.height,
                    "format": cloudinaryResponse.format,
                    "resource_type": cloudinaryResponse.resource_type,
                    "duration": cloudinaryResponse.duration,
                    "secure_url": cloudinaryResponse.secure_url,
                    "audio": cloudinaryResponse.audio,
                    "video": cloudinaryResponse.video,
                });

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://dev-api.getklippie.com/v1/project/create',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    data: data
                };

                const response = await axios.request(config);
     
                let data1 = qs.stringify({
                    'project_id': response.data.data.id
                });

                let config1 = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://dev-api.getklippie.com/v1/project/c',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Authorization': 'Bearer ' + token
                    },
                    data: data1
                };

                const response1 = await axios.request(config1);
                setProjectId(response1.data.data.id);
            } catch (error) {
                console.log(error);
            }
            setIsLoading(false);
            setAllApiCompleted(true);
            setIsSuggetionpopupOpen(true);
            setAccordionVisible(true);
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
                                            updateMainVideo(newMainVideo);
                                            setProjectId(null);
                                            setIsSuggetionpopupOpen(false);
                                        } catch (error) {
                                            console.error("Error updating main video:", error);
                                        }
                                    };
                                })
                                .catch((error) => {
                                    console.log(error);
                                });
                            setAccordionVisible(true);
                            setError('');
                        }

                        // Check if the message is not in the list of unique messages
                        // if (!uniqueMessages.includes(message)) {
                        //     // Add the message to the list of unique messages
                        //     setUniqueMessages([...uniqueMessages, message]);

                        //     // Display the message (you can do this in your UI as needed)
                        //     enqueueSnackbar(message, { variant: 'info', autoHideDuration: 2000 });
                        // }
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

    useEffect(() => {
        setProjectId(currentProjectId);
    }, [currentProjectId])

    useEffect(() => {
        const token = getToken();
        if (cloudinaryResponse && token) {
            if (!apiCallsMadeRef.current || prevProjectIdRef.current !== cloudinaryResponse) {
                apiCallsMadeRef.current = true;
                prevProjectIdRef.current = cloudinaryResponse;
                makeApiCalls(cloudinaryResponse, token);
            }
        }
        //eslint-disable-next-line
    }, [cloudinaryResponse, allApiCompleted]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            {errorMessage && <div className="mb-4 text-red-500">{errorMessage}</div>}
            <div className="text-center">
                {isSuggetionpopupOpen && (
                    <Suggetionpopup isOpen={isSuggetionpopupOpen} onClose={() => setIsSuggetionpopupOpen(false)} />
                )}
                {accordionVisible && (
                    <HomeScreen />
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
