/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Mainvideo from "./MainVideoTable/Mainvideo.js";
import Videoclips from "./VideoClipsTable/Videoclips.js";
import { AiFillDelete } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import { useFileSelected } from "./Hooks/Context/SelectionContext.js";
import axios from "axios";
import qs from "qs";
import { TokenManager } from '../Config/Token/getToken.js';
import ToastNotification from "../Notification/ToastNotification.js";
import JSZip from 'jszip';
import { Toaster } from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Code, Dialog, Group, Button, CloseButton, Text } from '@mantine/core';
import { IconDownload, IconTrash } from '@tabler/icons-react';
import useBaseUrl from '../Config/Hooks/useBaseUrl.js';

export default function AccordionSection({ videoClips, videoURl, clips }) {
    const baseUrl = useBaseUrl();
    const { fileselected, fileselecteddata, setFileDelete, setDeselect } = useFileSelected();
    if (process.env.NODE_ENV === 'development') {
        console.log(fileselecteddata, "fileselecteddata");
    }
    const [openStates, setOpenStates] = useState([true, true]);
    const [videoCount, setVideoCount] = useState(videoClips.length);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [currentDownloadingVideo, setCurrentDownloadingVideo] = useState(null);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const navigate = useNavigate();
    const user = TokenManager.getToken()
    const [userToken, setUserToken] = useState(null);
    useEffect(() => {
        if (user === undefined || user === null) {
            navigate('/');
            window.location.reload();
            return;
        } else {
            const userToken = TokenManager.getToken()[1]
            setUserToken(userToken);
        }
    }, [navigate, user]); const toggleAccordion = (index) => {
        setOpenStates((prev) =>
            prev.map((state, i) => (i === index ? !state : state))
        );
    };

    const handleDeleteClick = (event) => {
        setDeselect(true)
        event.stopPropagation();
        for (let i = 0; i < fileselecteddata.length; i++) {
            const element = fileselecteddata[i];
            if (process.env.NODE_ENV === 'development') {
                console.log(element.src);
            }

            let data = qs.stringify({
                'id': element.id,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${baseUrl}/v1/clip/delete`,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${userToken}`
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(JSON.stringify(response.data));
                    }
                    setVideoCount(videoCount - 1);
                    setFileDelete(true);
                    ToastNotification({ type: 'success', message: 'Video deleted successfully' });
                })
                .catch((error) => {
                    if (process.env.NODE_ENV === 'development') {
                        console.log(error);
                    }
                    ToastNotification({ type: 'error', message: error.response.data.message });
                    setFileDelete(false);
                });

        }
    };

    useEffect(() => {
        // Reset progress when fileselecteddata changes
        setDownloadProgress(0);
    }, [fileselecteddata]);

    const source = axios.CancelToken.source(); // Create a new cancel token source

    const handleDownloadClick = async (event) => {
        event.stopPropagation();
        setDeselect(true)
        try {
            setDownloadModalOpen(true); // Open the modal

            if (fileselecteddata.length === 1) {
                // Download a single video
                const element = fileselecteddata[0];
                setCurrentDownloadingVideo(element.title);
                const videoUrl = element.src;
                const secureVideoUrl = videoUrl.replace(/^http:\/\//i, 'https://');

                const source = axios.CancelToken.source(); // Create a new cancel token source

                const response = await axios({
                    method: 'get',
                    url: secureVideoUrl,
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloadProgress(progress);
                    },
                    cancelToken: source.token, // Pass the cancel token
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${element.title}.${element.type}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                ToastNotification({ type: 'success', message: `Downloaded: ${element.title}` });
            } else {
                // Download a zip file containing all videos
                const zip = new JSZip();

                const totalFiles = fileselecteddata.length;

                for (let i = 0; i < fileselecteddata.length; i++) {
                    const element = fileselecteddata[i];
                    const source = axios.CancelToken.source(); // Create a new cancel token source

                    setCurrentDownloadingVideo(element.title);
                    const videoUrl = element.src;
                    const secureVideoUrl = videoUrl.replace(/^http:\/\//i, 'https://');

                    try {
                        const response = await axios({
                            method: 'get',
                            url: secureVideoUrl,
                            responseType: 'blob',
                            cancelToken: source.token, // Pass the cancel token
                        });

                        zip.file(`${element.title}.${element.type}`, response.data);

                        const progress = Math.round(((i + 1) / totalFiles) * 100);
                        setDownloadProgress(progress);

                        if (i + 1 === totalFiles) {
                            const content = await zip.generateAsync({ type: 'blob' });
                            const zipFileName = 'Klippe Videos.zip';
                            const zipFileUrl = window.URL.createObjectURL(content);

                            const zipLink = document.createElement('a');
                            zipLink.href = zipFileUrl;
                            zipLink.setAttribute('download', zipFileName);
                            document.body.appendChild(zipLink);
                            zipLink.click();
                            zipLink.parentNode.removeChild(zipLink);
                            ToastNotification({ type: 'success', message: `Downloaded: ${zipFileName}` });
                        }
                    } catch (error) {
                        if (axios.isCancel(error)) {
                            setDownloadModalOpen(false);
                            return;
                        } else {
                            console.error('Error downloading file:', error);
                            ToastNotification({ type: 'error', message: 'Download failed' });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Download Error:', error);
            ToastNotification({ type: 'error', message: 'Download failed' });
        } finally {
            setDownloadProgress(0);
            setCurrentDownloadingVideo(null);
            setDownloadModalOpen(false); // Close the modal
        }
    };

    // Function to cancel the download
    const cancelDownload = () => {
        // Cancel ongoing downloads by canceling the token
        if (source) {
            source.cancel('Download canceled by user');
        }
    };



    return (
        <div className="flex-grow-0 flex-shrink-0 w-[100%] h-[90%] overflow-y-auto overflow-x-scroll">
            <MantineProvider>
                <Toaster />
                <Accordion alwaysOpen={true} className="p-4">
                    <AccordionItem isActive={openStates[0]}>
                        <AccordionHeader
                            onClick={() => toggleAccordion(0)}
                            className="cursor-pointer flex items-center justify-between mt-2 mb-3"
                        >
                            <div className="flex items-center">
                                {openStates[0] ? (
                                    <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                                ) : (
                                    <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                                )}
                                <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi ">
                                    Main Video
                                </h3>
                            </div>
                        </AccordionHeader>
                        <AccordionBody>
                            <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 ">
                                <Mainvideo />
                            </div>
                        </AccordionBody>
                    </AccordionItem>

                    <AccordionItem isActive={openStates[1]}>
                        <div className="flex items-center justify-between">
                            <AccordionHeader
                                onClick={() => toggleAccordion(1)}
                                className="cursor-pointer mt-4 mb-4 relative"
                            >
                                <div className="flex items-center justify-between ">
                                    <div className="flex items-center">
                                        {openStates[1] ? (
                                            <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                                        ) : (
                                            <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                                        )}
                                        <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi">
                                            Video Clips{" "}
                                            <span className="text-sm font-thin text-gray-400">
                                                ({videoCount})
                                            </span>
                                        </h3>
                                    </div>
                                </div>
                            </AccordionHeader>
                            {fileselected && (
                                <>
                                    {/* <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-between bg-[#D1FAE5] rounded-[10px] border border-green-500 p-2 cursor-pointer select-none mr-2"
                                            onClick={handleDownloadClick}>
                                            <span className="text-sm font-bold text-gray-900 mr-1">
                                                Download
                                                ({fileselecteddata.length})
                                            </span>
                                            <HiDownload className="text-green-600 text-xl " />
                                        </div>
                                        <div className="flex items-center justify-between bg-[#FEE2E2] rounded-[10px] border border-red-500 p-2 cursor-pointer select-none" onClick={handleDeleteClick}>
                                            <span className="text-sm font-bold text-gray-900 mr-1">
                                                Delete
                                                ({fileselecteddata.length})
                                            </span>
                                            <AiFillDelete className="text-red-600 text-xl " />
                                        </div>
                                    </div> */}
                                    <Dialog
                                        opened={fileselected}
                                        position={{ bottom: 20, left: '40%', }}
                                        onClose={() => { setDeselect(true) }}
                                        size="lg"
                                        radius="lg"
                                        classNames={{
                                            root: 'p-[0px!important] w-[auto!important] h-[auto!important] min-h-[auto!important] select-none'
                                        }}
                                        styles={{
                                            root: {
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                            }
                                        }}
                                    >
                                        <Text classNames={{
                                            root: 'px-[30px!important] w-auto inline-block bg-gradient-to-r from-indigo-400 to-blue-900 text-white rounded-l-xl text-[white!important] font-[900!important]',
                                        }}
                                            styles={{
                                                root: {
                                                    fontSize: '2.5rem',
                                                }
                                            }}
                                        >
                                            {fileselecteddata.length}
                                        </Text>
                                        <Text
                                            classNames={{
                                                root: 'px-[30px!important] w-auto inline-block  font-[300!important]',
                                            }}
                                            styles={{
                                                root: {
                                                    fontSize: '1.5rem',
                                                    color: '#323338',
                                                }
                                            }}
                                        >
                                            Clips Selected
                                        </Text>
                                        <div className="flex flex-col items-center justify-center text-[#323338] pr-4 hover:text-green-500 w-auto cursor-pointer"
                                            onClick={handleDownloadClick}
                                        >
                                            <IconDownload className=" w-5"/>
                                            <span className="mt-1 text-sm">
                                                Download
                                            </span>
                                        </div>
                                        <div className="flex flex-col items-center justify-center text-[#323338] pr-4 hover:text-red-600 w-auto cursor-pointer"
                                            onClick={handleDeleteClick}
                                        >
                                            <IconTrash className=" w-5"/>
                                            <span className="mt-1 text-sm">
                                                Delete
                                            </span>
                                        </div>
                                        <div className="h-[100%] p-[8px!important] border-l-4">
                                            <CloseButton
                                                onClick={() => { setDeselect(true) }}
                                                size="xl" variant="transparent"
                                                classNames={{
                                                    root: '',
                                                }}
                                                styles={{
                                                    root: {
                                                        border: '1px solid #000!important',
                                                    }
                                                }}
                                            />
                                        </div>
                                    </Dialog>
                                </>
                            )}
                            {downloadProgress > 0 && isDownloadModalOpen && (
                                <div className="fixed top-auto left-auto mb-4 mr-4 bottom-0 right-0 flex items-center justify-center z-50 inset-0 animate__animated animate__fadeInRight">
                                    <div className="bg-white p-8 rounded-lg max-w-auto">
                                        <h2 className="text-md font-bold mb-4">{`Downloading`}
                                            <Code
                                                styles={{
                                                    root: {
                                                        color: 'white',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem',
                                                        backgroundColor: '#22c55e',
                                                        marginLeft: '0.5rem',
                                                        padding: '0.2rem 0.5rem',
                                                    },
                                                }}
                                            >{currentDownloadingVideo}</Code>
                                        </h2>
                                        <div className="flex flex-col items-center">
                                            <div className="w-full">
                                                <div className="relative pt-1">
                                                    <div className="flex mb-2 items-center justify-between">
                                                        <div className="text-xs font-semibold text-gray-600">{`${downloadProgress}% Complete`}</div>
                                                        <div className="text-xs font-semibold text-green-600">{`${downloadProgress}%`}</div>
                                                    </div>
                                                    <div className="w-full bg-gray-200 rounded-full">
                                                        <div
                                                            className="w-full h-2 bg-gradient-to-r from-green-400 to-blue-500 rounded-full"
                                                            style={{ width: `${downloadProgress}%` }}
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div>
                        <AccordionBody>
                            <div className="relative w-full overflow-y-auto  ">
                                <Videoclips setVideoCount={setVideoCount} videoClips={videoClips} />
                            </div>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </MantineProvider>
        </div>
    );
}
