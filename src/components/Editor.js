import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import { TokenManager } from '../components/getToken.js';
import { useNavigate } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";

function Editor() {
    const navigate = useNavigate();
    const { clipId: id } = useParams();
    const userToken = TokenManager.getToken()[1];
    const hasMounted = useRef(false);
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [showLoader, setShowLoader] = useState(true);
    const [showProgressBar, setShowProgressBar] = useState(false);

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
                        const maxDurations = endTimeInSeconds - startTimeInSeconds + 20;
                        const minDurations = 30;
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
                            showAdvanced: true,
                            showConsoles: true,
                            showLeftMenu: true,
                            showRightMenu: true,
                        });

                        myEditor.show();

                        myEditor.on('save', (result) => {
                            console.log(result, 'result');
                        });

                        myEditor.on('export', (data) => {
                            myEditor.hide();
                            console.log('Exported data:', data);
                            setShowProgressBar(true);

                            const downloadUrl = data.assets[0].downloadUrl;
                            const secureUrl = data.assets[0].secureUrl;
                            let updateData = JSON.stringify({
                                "id": id,
                                "clip_url": secureUrl,
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

                            axios(config)
                                .then(function (response) {
                                    console.log(response, 'response');
                                    fetch(downloadUrl)
                                        .then((response) => response.blob())
                                        .then((videoBlob) => {
                                            const blobUrl = URL.createObjectURL(videoBlob);

                                            const downloadLink = document.createElement('a');
                                            downloadLink.href = blobUrl;
                                            downloadLink.download = `${response.data.data.title}.${response.data.data.type}`
                                            downloadLink.style.display = 'none';

                                            document.body.appendChild(downloadLink);
                                            downloadLink.click();

                                            downloadLink.addEventListener('click', () => {
                                                document.body.removeChild(downloadLink);
                                                URL.revokeObjectURL(blobUrl);
                                            });
                                            setShowProgressBar(false);
                                            window.close();
                                        });
                                })
                                .catch(function (error) {
                                    console.log(error);
                                });
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
            {showLoader && !editorLoaded ? (
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
