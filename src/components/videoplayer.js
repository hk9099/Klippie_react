import React from "react";
import { JolPlayer } from "jol-player";

const source = [
    {
        src: "https://cdn.filestackcontent.com/We8lijaSWi5bCpVe7Ify",
    },
    {
        src: "https://cdn.filestackcontent.com/We8lijaSWi5bCpVe7Ify",
    },
    {
        src: "https://cdn.filestackcontent.com/We8lijaSWi5bCpVe7Ify",
    },
];

const videoOptions = {
    width: 750,
    height: 420,
    autoPlay: false,
    theme: "#000",
    poster: "",
    setEndPlayContent: null,
    setBufferContent: null,
    setPauseButtonContent: null,
    pausePlacement: "center",
    hideMouseTime: 2000,
    isShowMultiple: true,
    isShowSet: true,
    isShowScreenshot: true,
    isShowPicture: true,
    isShowWebFullScreen: true,
    language: "en",
    isShowPauseButton: true,
    quality: [],
    videoType: "h264",
    isToast: true,
    toastPosition: "leftTop",
    isProgressFloat: true,
    progressFloatPosition: "bt",
    mode: "scaleToFill",
};

const App = () => (
    <div>
        {source.map((video, index) => (
            <JolPlayer
                key={index}
                option={{
                    videoSrc: [video.src], // Provide the URL directly, not inside an object
                    ...videoOptions, // Spread the videoOptions object to apply all the options
                }}
            />
        ))}
    </div>
);

export default App;
