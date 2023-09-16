import React, { useState } from "react";
import { JolPlayer } from "jol-player";
import { HiOutlineDownload } from "react-icons/hi";
import { useSnackbar } from 'notistack';


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
const VideoPlayer = ({ src, title,type }) => {
    const [isLoading, setIsLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
  
    const handleDownload = async () => {
        try {
            setIsLoading(true);

            if (!src) {
               enqueueSnackbar("No video source found", { variant: "error" }, { preventDuplicate: true }, { autoHideDuration: 2000 });
            }

            if (type === "mp4") {
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


    return (
        <>
                <JolPlayer
                    className="w-[400px!important] h-[230px!important] m-[auto!important]"
                    option={{
                        videoSrc: [src],
                        ...videoOptions,
                    }}
                />
            <button className="Download_button m-auto mt-2" onClick={handleDownload}>
                <HiOutlineDownload />
                {isLoading ? "Downloading..." : `Download ${type}`}
            </button>
        </>
    );
};

export default VideoPlayer;