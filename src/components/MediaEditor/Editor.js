/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { TokenManager } from '../Config/Token/getToken.js';
// import { useNavigate } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import useBaseUrl from '../Config/Hooks/useBaseUrl.js';

function Editor() {
    const baseUrl = useBaseUrl();
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

            const formattedStartTime = startTime !== null ? formatTime(startTime) : 0;
            const formattedEndTime = endTime !== null ? formatTime(endTime) : null;

            return { formattedStartTime, formattedEndTime };
        } catch (error) {
            console.error("Error extracting start and end times:", error);
            return null;
        }
    }

    useEffect(() => {
        var button = document.querySelector('.iMAXtE');
        if (process.env.NODE_ENV === 'development') {
            console.log(button, 'button');
        }
        // Check if the button is found
        if (button) {
            // Add a click event listener to the button
            button.addEventListener('click', function () {
                // Perform actions when the button is clicked
                if (process.env.NODE_ENV === 'development') {
                    console.log('Button clicked!');
                }

            });
        } else {
            if (process.env.NODE_ENV === 'development') {
                console.log('Button not found');
            }
        }
    }, []);


    useEffect(() => {
        if (!hasMounted.current) {
            let data = qs.stringify({ 'clip_id': id });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${baseUrl}/v1/clip/get-by-clip-id`,
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
                                },
                            },
                            presets: {
                                export: {
                                    quality: 80,
                                    format: 'mp4',
                                    transformation: {
                                        crop: 'limit',
                                        quality: 'auto',
                                        fetchFormat: 'auto',
                                        responsiveWidth: 'auto',
                                        responsiveHeight: 'auto',
                                        width: 'auto',
                                    },
                                },
                            },

                            theme: {
                                logo: 'https://i.ibb.co/mvnxHH1/logo.png',
                            },
                            transformation: {
                                crop: 'limit',
                                quality: 'auto',
                                fetchFormat: 'auto',
                                responsiveWidth: 'auto',
                                responsiveHeight: 'auto',
                                width: 'auto',
                            },
                            maxWidth: 1920,
                            maxHeight: 1080,
                        });

                        myEditor.show();

                        myEditor.on('save', (result) => {
                            if (process.env.NODE_ENV === 'development') {
                            }
                        });

                        myEditor.on('error', (error) => {
                            if (process.env.NODE_ENV === 'development') {
                            }
                        });

                        myEditor.on('close', (result) => {
                        });

                        myEditor.on('open', (result) => {
                            if (process.env.NODE_ENV === 'development') {
                            }
                        });

                        myEditor.on('export-start', (result) => {
                        }
                        );

                        myEditor.on('export-end', (result) => {
                        })

                        myEditor.on('export-progress', (result) => {
                        });

                        myEditor.on('export', async (data) => {
                            myEditor.hide();
                            setShowLoader(true);
                            if (process.env.NODE_ENV === 'development') {
                                console.log('Exported data:', data);
                            }
                            const secureUrl = data.assets[0].url;
                            const { formattedStartTime, formattedEndTime } = extractStartEndTime(data);
                            const transformationArray = data.transformation.split(',');
                            const eoValue = transformationArray[0] || data.main_video_duratiob
                            const soValue = transformationArray[1] || 'so_0'
                            const joinedValue = [eoValue, soValue].join(',');
                            let updatedata = qs.stringify({
                                'id': id,
                                'title': '',
                                'summary': '',
                                'transformations': joinedValue,
                                'clip_url': secureUrl
                            });
                            let config = {
                                method: 'post',
                                maxBodyLength: Infinity,
                                url: `${baseUrl}/v1/clip/update`,
                                headers: {
                                    'accept': 'application/json',
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Authorization': 'Bearer ' + userToken,
                                },
                                data: updatedata
                            };
                            try {
                                const response = await axios(config);
                                if (process.env.NODE_ENV === 'development') {
                                    console.log(response, 'response');
                                }
                                myEditor.hide();
                                setShowProgressBar(false);
                                setShowLoader(false);
                                // window.close();
                            } catch (error) {
                                if (process.env.NODE_ENV === 'development') {
                                    console.log(error);
                                }
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
                        if (process.env.NODE_ENV === 'development') {
                            console.log(error);
                        }
                    });
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                }
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
