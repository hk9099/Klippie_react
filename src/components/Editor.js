/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { TokenManager } from '../components/getToken.js';
// import { useNavigate } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";

function Editor() {
    // const navigate = useNavigate();
    const { clipId: id } = useParams();
    const userToken = TokenManager.getToken()[1];
    const hasMounted = useRef(false);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);

    function formatTime(seconds) {
        const date = new Date(null);
        date.setSeconds(seconds);
        return date.toISOString().substr(11, 12);
    }

    function extractStartEndTime(response) {
        try {
            const asset = response.assets[0];
            const transformation = response.transformation;

            const startTimeMatch = transformation.match(/so_(\d+)/);
            const endTimeMatch = transformation.match(/eo_(\d+)/);

            const startTime = startTimeMatch ? parseInt(startTimeMatch[1], 10) : null;
            const endTime = endTimeMatch ? parseInt(endTimeMatch[1], 10) : null;

            const formattedStartTime = startTime !== null ? formatTime(startTime) : null;
            const formattedEndTime = endTime !== null ? formatTime(endTime) : null;

            return { formattedStartTime, formattedEndTime };
        } catch (error) {
            console.error("Error extracting start and end times:", error);
            return null;
        }
    }


    useEffect(() => {
        if (!hasMounted.current) {
            let data = qs.stringify({ 'clip_id': id });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/clip/get-by-clip-id',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${userToken}`,
                },
                data: data,
            };

            try {
                axios(config)
                    .then(function (response) {
                        console.log(response, 'response');
                        const startTimeInSeconds = parseInt(parseTimeToSeconds(response.data.data.start_time));
                        const endTimeInSeconds = parseInt(parseTimeToSeconds(response.data.data.end_time));
                        const maxDurations = endTimeInSeconds - startTimeInSeconds + 2000000000000000000000000000000000000000;
                        const minDurations = 5;
                        const parts = response.data.data.clip_url.split('/');
                        const publicId = parts[parts.length - 1].split('.')[0];
                        const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
                        const myEditor = window.cloudinary.mediaEditor();

                        myEditor.update({
                            cloudName: cloudName,
                            publicIds: [
                                {
                                    publicId: publicId,
                                    resourceType: 'video',
                                },
                            ],
                            video: {
                                steps: ['trim'],
                                trim: {
                                    startOffset: startTimeInSeconds,
                                    endOffset: endTimeInSeconds,
                                    maxDuration: maxDurations,
                                    minDuration: minDurations,
                                    units: 'seconds',
                                },
                            },    
                            language: {
                                locale: 'en_US',
                                messages: {
                                    en_US: {
                                        "header": "Edit Your Clip",
                                        "footer": {
                                            "export": "Save",
                                        },
                                    },
                                }
                            },
                            theme: {logo: 'https://i.ibb.co/mvnxHH1/logo.png'},
                            transformation: {
                                crop: 'limit',
                                quality: 'auto',
                                fetchFormat: 'auto',
                            },
                            
                        });

                        myEditor.show();

                        myEditor.on('save', (result) => {
                            console.log(result, 'result');
                        });


                        myEditor.on('export', async (data) => {
                            myEditor.hide();
                            setShowLoader(true);
                            console.log('Exported data:', data.transformation);

                            // const downloadUrl = data.assets[0].downloadUrl;
                            const secureUrl = data.assets[0].url;


                            const { formattedStartTime, formattedEndTime } = extractStartEndTime(data);

                            console.log("Start Time:", formattedStartTime);
                            console.log("End Time:", formattedEndTime);
                            // const downloadAttempts = 3; // Number of download attempts

                            //   async function downloadVideo(attempt) {
                            //         const xhr = new XMLHttpRequest();
                            //         xhr.open('GET', downloadUrl, true);
                            //         xhr.responseType = 'blob';

                            //         xhr.onload = () => {
                            //             if (xhr.status === 200) {
                            //                 const videoBlob = xhr.response;
                            //                 const blobUrl = URL.createObjectURL(videoBlob);

                            //                 const downloadLink = document.createElement('a');
                            //                 downloadLink.style.display = 'none';

                            //                 downloadLink.href = blobUrl;
                            //                 downloadLink.download = `${response.data.data.title}.${response.data.data.type}`;

                            //                 document.body.appendChild(downloadLink);
                            //                 downloadLink.click();

                            //                 document.body.removeChild(downloadLink);
                            //                 URL.revokeObjectURL(blobUrl);
                            //                 myEditor.hide();
                            //             setShowProgressBar(false);
                            //             window.close();
                            //             } else {
                            //                 if (attempt < downloadAttempts) {
                            //                     // Retry the download
                            //                     console.log(`Download attempt ${attempt + 1}`);
                            //                     downloadVideo(attempt + 1);
                            //                 } else {
                            //                     console.error('Failed to fetch the video content after multiple attempts');
                            //                 }
                            //             }
                            //         };
                            //         xhr.send();

                            //     }


                            let updateData = JSON.stringify({
                                "id": id,
                                "clip_url": secureUrl,
                                "transformations": data.transformation
                            });

                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: 'https://dev-api.getklippie.com/v1/clip/update',
                                headers: {
                                    'accept': 'application/json',
                                    'Content-Type': 'application/json',
                                    'Authorization': `Bearer ${userToken}`,
                                },
                                data: updateData
                            };

                            try {
                                const response = await axios(config);
                                console.log(response, 'responseeeeeeeeeee');
                                myEditor.hide();
                                setShowProgressBar(false);
                                setShowLoader(false);
                                window.close();
                            } catch (error) {
                                console.log(error);
                                setShowProgressBar(false);
                                setShowLoader(false);
                            }
                            // Start the initial download attempt
                            // downloadVideo(1);
                        });



                        myEditor.on('close', () => {
                            window.close();
                        });

                        setEditorLoaded(true);
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            } catch (error) {
                console.log(error);
            }

            hasMounted.current = true;
        }
    }, [hasMounted, id, userToken]);

    function parseTimeToSeconds(time) {
        const [hours, minutes, seconds] = time.split(':').map(parseFloat);
        return hours * 3600 + minutes * 60 + seconds;
    }

    return (
        <div className="flex justify-center items-center h-screen">
            {showLoader && editorLoaded ? (
                <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="25"
                    visible={true}
                />
            ) : null}

            {showProgressBar ? (
                <div className="w-1/2 bg-blue-200 h-4 rounded-full">
                    <div className="h-4 bg-blue-500 rounded-full"></div>
                </div>
            ) : null}
        </div>
    );
}

export default Editor;
