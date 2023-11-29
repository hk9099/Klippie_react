import React, { useState } from "react";
import { JolPlayer } from "jol-player";
import { HiOutlineDownload } from "react-icons/hi";
// import CloudinaryMediaEditor from "../components/mediaEditor.js";
import { Link } from "react-router-dom";
import { BiSolidEdit } from 'react-icons/bi';
// import { Tooltip } from 'react-tooltip';
import ToastNotification from "../components/ToastNotification";
import { Toaster } from 'react-hot-toast';

const videoOptions = {
    width: 750,
    height: 420,
    autoPlay: false,
    isLive: false,
    isLoop: false,
    isMuted: false,
    isShowControl: true,
    isShowBarTime: true,
    isShowBarFullScreen: false,
    theme: "#595282",
    setVolume: [50],
    poster: "",
    // setEndPlayContent: "Replay",
    setBufferContent: "Buffering...",
    setWaitingContent: "Waiting...",
    pausePlacement: "center",
    playPlacement: "center",
    fullScreenPlacement: "center",
    exitFullScreenPlacement: "center",
    mutePlacement: "center",
    unMutePlacement: "center",
    playbackRatePlacement: "center",
    pictureInPicturePlacement: "center",
    downloadPlacement: "center",
    hideMouseTime: 2000,
    isShowMultiple: false,
    isShowSet: false,
    isShowScreenshot: false,
    isShowPicture: false,
    isShowWebFullScreen: false,
    language: "en",
    isShowPauseButton: true,
    videoType: "h264",
    isToast: false,
    toastPosition: "",
    isProgressFloat: false,
    progressFloatPosition: "",
    mode: "scaleToFill",

};
const VideoPlayer = ({ src, title, type, sidebar, publicId, startTime, endTime, clipId, setMainVideo }) => {
    // console.log(setMainVideo, 'setMainVideo');
    const [isLoading, setIsLoading] = useState(false);
    // const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const handleDownload = async () => {
        try {
            setIsLoading(true);

            if (!src) {
                ToastNotification({ message: 'No video source found', type: 'error' });
            }

            if (type === "mp4" || type === "video") {
                const response = await fetch(src);
                console.log(response);
                const videoBlob = await response.blob();

                const blobURL = URL.createObjectURL(videoBlob);

                const downloadLink = document.createElement("a");
                downloadLink.href = blobURL;
                downloadLink.download = `${title}.mp4`
                document.body.appendChild(downloadLink);

                // Programmatically click the link to trigger the download
                downloadLink.click();

                // Clean up: Remove the download link and revoke the Blob object URL
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(blobURL);
            } else {
                const response = await fetch(src);
                console.log(response);
                const videoBlob = await response.blob();

                const blobURL = URL.createObjectURL(videoBlob);

                const downloadLink = document.createElement("a");
                downloadLink.href = blobURL;
                downloadLink.download = `${title}.mp3`
                document.body.appendChild(downloadLink);

                // Programmatically click the link to trigger the download
                downloadLink.click();

                // Clean up: Remove the download link and revoke the Blob object URL
                document.body.removeChild(downloadLink);
                URL.revokeObjectURL(blobURL);
            }

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error while downloading the video:", error);
        }
    };

    const handleMediaEditorClick = () => {
        const mediaEditorTab = window.open(`/editor/${clipId}`, '_blank');
        const tabClosedListener = () => {
            console.log('Media editor tab closed');
            window.location.reload();
            mediaEditorTab.removeEventListener('beforeunload', tabClosedListener);
        };
        mediaEditorTab.addEventListener('beforeunload', tabClosedListener);
    };


    return (
        <>
            <Toaster position="top-center" />
            <JolPlayer
                className="w-[400px!important] h-[230px!important]  z-[auto!important]"
                option={{
                    videoSrc: [src],
                    ...videoOptions,
                }}
            />
            <div className="flex justify-between items-center ">
                <button
                    className={`w-1/2 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full  text-center p-2 gap-3 m-auto mt-2 ${sidebar ? 'hidden' : ''} flex-row justify-center items-center`}
                    onClick={handleDownload}
                >
                    <HiOutlineDownload />
                    {isLoading ? "Downloading..." : `Download ${type === 'mp4' || type === 'video' ? 'Video' : 'Audio'}`}
                </button>

                <Link
                    // to={`/editor/${clipId}`}
                    // target="_blank"
                    data-tooltip-id="MediaEditor"
                    className={` w-1/2 ml-1 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full text-center p-2 gap-3 m-auto mt-2 mb-0 ${sidebar ? 'hidden' : ''} flex-row justify-center items-center ${setMainVideo ? 'hidden' : 'block'}`}
                    onClick={handleMediaEditorClick}
                >
                    <BiSolidEdit />
                    {`Edit ${type === 'mp4' || type === 'video' ? 'Video' : 'Audio'}`}
                </Link>

                {/* <Tooltip
                    id="MediaEditor"
                    content="Edit your video"
                    place="bottom"
                    opacity={1}
                    style={{ backgroundColor: '#B3B5E2', color: '#020913', zIndex: '999', position: 'relative' }}
                /> */}
            </div>

        </>
    );
};

export default VideoPlayer;