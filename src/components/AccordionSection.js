import React, { useState, useEffect } from "react";
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
} from "react-headless-accordion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import Mainvideo from "./Mainvideo";
import Videoclips from "./Videoclips";
import { AiFillDelete } from "react-icons/ai";
import { HiDownload } from "react-icons/hi";
import { useFileSelected } from "../context/SelectionContext.js";
import axios from "axios";
import qs from "qs";
import { TokenManager } from '../components/getToken.js';
import ToastNotification from "../components/ToastNotification";
import JSZip from 'jszip';
import { Toaster } from 'react-hot-toast';

export default function AccordionSection({ videoClips, videoURl, clips }) {
    const { fileselected, fileselecteddata, setFileDelete } = useFileSelected();
    console.log(fileselecteddata, "fileselecteddata");
    const [openStates, setOpenStates] = useState([true, true]);
    const [videoCount, setVideoCount] = useState(videoClips.length);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [currentDownloadingVideo, setCurrentDownloadingVideo] = useState(null);
    const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
    const userToken = TokenManager.getToken()[1]
    const toggleAccordion = (index) => {
        setOpenStates((prev) =>
            prev.map((state, i) => (i === index ? !state : state))
        );
    };

    const handleDeleteClick = (event) => {
        event.stopPropagation();
        for (let i = 0; i < fileselecteddata.length; i++) {
            const element = fileselecteddata[i];
            console.log(element.src);

            let data = qs.stringify({
                'id': element.id,
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/clip/delete',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Bearer ${userToken}`
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    console.log(JSON.stringify(response.data));
                    setVideoCount(videoCount - 1);
                    setFileDelete(true);
                    ToastNotification({ type: 'success', message: 'Video deleted successfully' });
                })
                .catch((error) => {
                    console.log(error);
                        ToastNotification({ type: 'error', message: error.response.data.message });
                    setFileDelete(false);
                });

        }
    };

    useEffect(() => {
        // Reset progress when fileselecteddata changes
        setDownloadProgress(0);
    }, [fileselecteddata]);

    const handleDownloadClick = async (event) => {
        event.stopPropagation();
        try {
            setDownloadModalOpen(true); // Open the modal
            
            if (fileselecteddata.length === 1) {
                // Download a single video
                const element = fileselecteddata[0];
                setCurrentDownloadingVideo(element.title);
                const videoUrl = element.src;
                const secureVideoUrl = videoUrl.replace(/^http:\/\//i, 'https://');
                const response = await axios({
                    method: 'get',
                    url:secureVideoUrl,
                    responseType: 'blob',
                    onDownloadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setDownloadProgress(progress);
                    },
                });

                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${element.title}.${element.type}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                ToastNotification({ type: 'success', message: `Downloaded: ${element.title}` });
            }else {
                // Download a zip file containing all videos
                const zip = new JSZip();
    
                const totalFiles = fileselecteddata.length;
    
                const handleFileDownload = async (element, index) => {
                    setCurrentDownloadingVideo(element.title);
                    const videoUrl = element.src;
                    const secureVideoUrl = videoUrl.replace(/^http:\/\//i, 'https://');
                    const response = await axios({
                        method: 'get',
                        url: secureVideoUrl,
                        responseType: 'blob',
                    });
    
                    zip.file(`${element.title}.${element.type}`, response.data);
    
                    // Calculate progress based on the number of completed files
                    const progress = Math.round(((index + 1) / totalFiles) * 100);
                    setDownloadProgress(progress);
    
                    if (index + 1 === totalFiles) {
                        // All files have been downloaded, generate and initiate zip file download
                        const content = await zip.generateAsync({ type: "blob" });
                        const zipFileName = "videos.zip";
                        const zipFileUrl = window.URL.createObjectURL(content);
    
                        const zipLink = document.createElement('a');
                        zipLink.href = zipFileUrl;
                        zipLink.setAttribute('download', zipFileName);
                        document.body.appendChild(zipLink);
                        zipLink.click();
                        zipLink.parentNode.removeChild(zipLink);
                        ToastNotification({ type: 'success', message: `Downloaded: ${zipFileName}` });
                        // Reset progress and close the modal
                        setDownloadProgress(0);
                        setCurrentDownloadingVideo(null);
                        setDownloadModalOpen(false);
                    }
                };
    
                // Initiate downloads for each file
                for (let i = 0; i < fileselecteddata.length; i++) {
                    await handleFileDownload(fileselecteddata[i], i);
                }
            }
        } catch (error) {
            console.error("Download Error:", error);
            ToastNotification({ type: 'error', message: 'Download failed' });
        } finally {
            setDownloadProgress(0);
            setCurrentDownloadingVideo(null);
            setDownloadModalOpen(false); // Close the modal
        }
    };

   

    return (
        <div className="flex-grow-0 flex-shrink-0 w-[100%] h-[90%] overflow-y-auto overflow-x-scroll">
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
                            <div className="flex items-center justify-between">
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
                            </div>
                        )}
                        {downloadProgress > 0 && isDownloadModalOpen && (
                            <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center  z-50 inset-0 backdrop-blur-3xl bg-black bg-opacity-60">
                                <div className="bg-white p-4 rounded">
                                    <h2 className="text-xl font-bold mb-2">{`Downloading ${currentDownloadingVideo}`}</h2>
                                    <div className="bg-green-300 h-4 rounded-full mt-2">
                                        <div
                                            className="bg-green-600 h-full rounded-full"
                                            style={{ width: `${downloadProgress}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <AccordionBody>
                        <div className="relative w-full h-fit overflow-y-auto ">
                            <Videoclips setVideoCount={setVideoCount} videoClips={videoClips} />
                        </div>
                    </AccordionBody>
                </AccordionItem>
            </Accordion>
        </div>
    );
}
