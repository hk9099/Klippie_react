import React,{useState  } from "react";
import { JolPlayer } from "jol-player";
import { HiOutlineDownload } from "react-icons/hi";


const videoOptions = {
    width: 750,
    height: 420,
    autoPlay: false,
    isLive: false,
    isLoop: false,
    isMuted: false,
    isShowControl: true,
    isShowBarTime: true,
    isShowBarFullScreen: true,
    theme: "#000",
    setVolume: 50,
    poster: "",
    setEndPlayContent: null,
    setBufferContent: null,
    setPauseButtonContent: null,
    pausePlacement: "center",
    hideMouseTime: 2000,
    isShowMultiple: true,
    isShowSet: true,
    isShowScreenshot: false,
    isShowPicture: true,
    isShowWebFullScreen: true,
    language: "en",
    isShowPauseButton: true,
    quality: [],
    videoType: "h264",
    isToast: false,
    toastPosition: "",
    isProgressFloat: false,
    progressFloatPosition: "",
    mode: "scaleToFill",
};
const VideoPlayer = ({ src }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleDownload = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(src);
            const videoBlob = await response.blob();

            const blobURL = URL.createObjectURL(videoBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = blobURL;
            downloadLink.download = `${src}.mp4`
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
            <JolPlayer
                className="w-[400px!important] h-[230px!important] m-auto"
                option={{
                    videoSrc: [src],
                    ...videoOptions,
                }}
            />
            <button className="Download_button m-auto mt-2" onClick={handleDownload}>
                <HiOutlineDownload />
                {isLoading ? "Downloading..." : "Download Video"}
            </button>
        </>
    );
};

export default VideoPlayer;




