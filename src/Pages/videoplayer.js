import React from "react";
import { JolPlayer } from "jol-player";


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
    isProgressFloat: true,
    progressFloatPosition: "bt",
    mode: "scaleToFill",
};

const VideoPlayer = ({ src }) => (
        <JolPlayer className="w-[450px!important] h-[250px!important] m-auto"
            option={{
                videoSrc: [src], // Pass the video source from the parent component
                ...videoOptions,
            }}
        />
);

export default VideoPlayer;
