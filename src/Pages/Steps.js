import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import AccordionSection from '../components/AccordionSection';
// import Shuffleloader from '../components/shuffleloader.js';
// import { updateMainVideo } from '../components/data';
import { useSidebarContext } from '../components/SidebarContext.js';
import { useSnackbar } from 'notistack';
import { AiOutlineClose } from 'react-icons/ai';
import HomeScreen from './HomeScreen';
import Suggetionpopup from '../components/Suggetionpopup';
import { useClipsFoundStatus } from '../components/ClipsFoundContext.js';

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
    const { setClipsFoundStatus } = useClipsFoundStatus();
    const navigate = useNavigate();
    const { projectId: routeProjectId } = useParams();
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
            setAccordionVisible(false);
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
            setClipsFoundStatus(false);
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
                            setClipsFoundStatus(false);
                        }

                        if (message === 'Clips Founded') {
                            navigate(`/dashboard/${currentProjectId}`);
                            setProjectId('')
                            setError('');
                            setClipsFoundStatus(true);
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
            }, 10000); 
            return () => clearInterval(intervalId);
        }
    }, [currentProjectId, uniqueMessages, enqueueSnackbar, setIsApiCompleted , routeProjectId , navigate]);

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
                {!accordionVisible && (
                    <HomeScreen />
                )}
                {error && <div className="mb-4 text-red-500">{error}</div>}
            </div>
            {closeButton}
            {!isLoading  && accordionVisible && (
                <AccordionSection videoClips={newvideoClips} />
            )}
        </div>
    );
};

export default Steps;
