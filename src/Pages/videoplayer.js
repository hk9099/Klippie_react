import React, { useState, useEffect } from "react";
import { JolPlayer } from "jol-player";
import { HiOutlineDownload } from "react-icons/hi";
import { PulseLoader } from 'react-spinners';


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
    theme: "#000",
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
const VideoPlayer = ({ src, title }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [videoReady, setVideoReady] = useState(false);
    
    console.log(title, 'title')
    useEffect(() => {
        // Simulate a delay before the video is ready
        const timeout = setTimeout(() => {
            setVideoReady(true);
        }, 1000); // Adjust the timeout duration as needed

        return () => clearTimeout(timeout);
    }, []);

    const handleDownload = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(src);
            const videoBlob = await response.blob();

            const blobURL = URL.createObjectURL(videoBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = blobURL;
            downloadLink.download = `Klippie ( ${title} ).mp4`
            document.body.appendChild(downloadLink);

            // Programmatically click the link to trigger the download
            downloadLink.click();

            // Clean up: Remove the download link and revoke the Blob object URL
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(blobURL);

            setIsLoading(false);
        } catch (error) {
            setIsLoading(false);
            console.error("Error while downloading the video:", error);
        }
    };

    return (
        <>
            {videoReady ? (
                <JolPlayer
                    className="w-[400px!important] h-[230px!important] m-auto"
                    option={{
                        videoSrc: [src],
                        ...videoOptions,
                    }}
                />
            ) : (
                    <div className="w-[400px!important] m-auto flex justify-center">
                    <PulseLoader size={20} color="#3B82F6" />
                    </div>
            )}
            <button className="Download_button m-auto mt-2" onClick={handleDownload}>
                <HiOutlineDownload />
                {isLoading ? "Downloading..." : "Download Video"}
            </button>
        </>
    );
};

export default VideoPlayer;