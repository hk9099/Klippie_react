// import React, {useState, useEffect } from 'react';
// import { HiOutlineDownload } from "react-icons/hi";
// // import CloudinaryMediaEditor from "../components/mediaEditor.js";
// import { Link } from "react-router-dom";
// import { BiSolidEdit } from 'react-icons/bi';
// // import { Tooltip } from 'react-tooltip';
// import ToastNotification from "../components/Notification/ToastNotification";
// import { Toaster } from 'react-hot-toast';

// const CloudinaryVideoPlayer = ({
//     src,
//     title,
//     type,
//     sidebar,
//     publicId,
//     startTime,
//     endTime,
//     clipId,
//     setMainVideo,
//     cloudName,
//     videoId,
// }) => {
//      // console.log(setMainVideo, 'setMainVideo');
//      const [isLoading, setIsLoading] = useState(false);
//      // const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
//      const handleDownload = async () => {
//          try {
//              setIsLoading(true);

//              if (!src) {
//                  ToastNotification({ message: 'No video source found', type: 'error' });
//              }

//              if (type === "mp4" || type === "video") {
//                  const response = await fetch(src);
//                  console.log(response);
//                  const videoBlob = await response.blob();

//                  const blobURL = URL.createObjectURL(videoBlob);

//                  const downloadLink = document.createElement("a");
//                  downloadLink.href = blobURL;
//                  downloadLink.download = `${title}.mp4`
//                  document.body.appendChild(downloadLink);

//                  // Programmatically click the link to trigger the download
//                  downloadLink.click();

//                  // Clean up: Remove the download link and revoke the Blob object URL
//                  document.body.removeChild(downloadLink);
//                  URL.revokeObjectURL(blobURL);
//              } else {
//                  const response = await fetch(src);
//                  console.log(response);
//                  const videoBlob = await response.blob();

//                  const blobURL = URL.createObjectURL(videoBlob);

//                  const downloadLink = document.createElement("a");
//                  downloadLink.href = blobURL;
//                  downloadLink.download = `${title}.mp3`
//                  document.body.appendChild(downloadLink);

//                  // Programmatically click the link to trigger the download
//                  downloadLink.click();

//                  // Clean up: Remove the download link and revoke the Blob object URL
//                  document.body.removeChild(downloadLink);
//                  URL.revokeObjectURL(blobURL);
//              }

//              setIsLoading(false);
//          } catch (error) {
//              setIsLoading(false);
//              console.error("Error while downloading the video:", error);
//          }
//      };

//     useEffect(() => {
//         // Load Cloudinary scripts dynamically
//         const loadScript = (src, onLoad) => {
//             const script = document.createElement('script');
//             script.src = src;
//             script.async = true;
//             script.onload = onLoad;
//             document.head.appendChild(script);
//         };

//         loadScript('https://cdnjs.cloudflare.com/ajax/libs/cloudinary-core/2.3.0/cloudinary-core-shrinkwrap.js', () => {
//             loadScript('https://unpkg.com/cloudinary-video-player/dist/cld-video-player.js', () => {
//                 // Initialize Cloudinary
//                 const cld = window.cloudinary.Cloudinary.new({ cloud_name: process.env.REACT_APP_CLOUDINARY_CLOUD_NAME });

//                 // Initialize player with a unique ID
//                 const player = cld.videoPlayer(`example-player-${src}`, {
//                     controls: true,
//                     preload: 'auto',
//                     fluid: false,
//                     muted: true,
//                     autoplay: true,
//                     autoplayMode: 'on-scroll',
//                     showJumpControls: true,
//                     hideContextMenu: true,
//                     loop: false,
//                     sourceTypes: ['hls', 'webm', 'mp4'],
//                     posterOptions: {
//                         transformation: {
//                             effect: 'sepia',
//                             startOffset: 2,

//                         },
//                     },
//                     colors: {
//                         base: '#6847FF',
//                         accent: '#7F6CF3',
//                         text: '#000000'
//                     },
//                     logoImageUrl: 'https://res.cloudinary.com/delkyf33p/image/upload/v1701593905/tkfstyrkbhxjqg80yz21.png',
//                 });


//                 player.on('sourcechanged');
//             });
//         });
//     }, [cloudName, src]);

//     const handleMediaEditorClick = () => {
//         const mediaEditorTab = window.open(`/editor/${clipId}`, '_blank');
//         const tabClosedListener = () => {
//             console.log('Media editor tab closed');
//             window.location.reload();
//             mediaEditorTab.removeEventListener('beforeunload', tabClosedListener);
//         };
//         mediaEditorTab.addEventListener('beforeunload', tabClosedListener);
//     };

//     return (
//         <>
//                     <Toaster position="top-center" />

//         <video  
//             id={`example-player-${src}`}
//             className={`cld-video-player cld-fluid w-full h-full ${sidebar ? 'hidden' : ''} border border-white border-opacity-60  backdrop-blur-4 flex rounded-[10px] text-center `}
//             src={`${src}`}
//             width={500}
//         // controls
//         // preload="auto"
//         // muted
//         // autoplay
//         // autoplayMode="on-scroll"
//         // data-cld-source={`{ "publicId": "${publicId}", "transformation": { "width": 500 }, "info": { "title": "${title}"} }`}
//         ></video>
//         <div className="flex justify-between items-center ">
//                 <button
//                     className={`w-1/2 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full  text-center p-2 gap-3 m-auto mt-2 ${sidebar ? 'hidden' : ''} flex-row justify-center items-center`}
//                     onClick={handleDownload}
//                 >
//                     <HiOutlineDownload />
//                     {isLoading ? "Downloading..." : `Download ${type === 'mp4' || type === 'video' ? 'Video' : 'Audio'}`}
//                 </button>

//                 <Link
//                     // to={`/editor/${clipId}`}
//                     // target="_blank"
//                     data-tooltip-id="MediaEditor"
//                     className={` w-1/2 ml-1 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full text-center p-2 gap-3 m-auto mt-2 mb-0 ${sidebar ? 'hidden' : ''} flex-row justify-center items-center ${setMainVideo ? 'hidden' : 'block'}`}
//                     onClick={handleMediaEditorClick}
//                 >
//                     <BiSolidEdit />
//                     {`Edit ${type === 'mp4' || type === 'video' ? 'Video' : 'Audio'}`}
//                 </Link>

//                 {/* <Tooltip
//                     id="MediaEditor"
//                     content="Edit your video"
//                     place="bottom"
//                     opacity={1}
//                     style={{ backgroundColor: '#B3B5E2', color: '#020913', zIndex: '999', position: 'relative' }}
//                 /> */}
//             </div>
//             <style jsx>{`

//                 .vjs-control-bar{
//                     border-bottom-left-radius: 10px !important;
//                     border-bottom-right-radius: 10px !important;
//                 }

//                 .cld-video-player .vjs-title-bar{
//                     display: none !important;
//                 }

//                 .cld-video-player .vjs-big-play-button{
//                     width: 50px !important;
//                 }
//             `}</style>
//             </>
//     );
// };

// export default CloudinaryVideoPlayer;

// loadScript('https://cdnjs.cloudflare.com/ajax/libs/cloudinary-core/2.3.0/cloudinary-core-shrinkwrap.js', () => {
//     loadScript('https://unpkg.com/cloudinary-video-player/dist/cld-video-player.js', () => {
import { useEffect, useRef, useState } from 'react';
import { HiOutlineDownload } from "react-icons/hi";
import { Link } from "react-router-dom";
import { BiSolidEdit } from 'react-icons/bi';
import ToastNotification from "../Notification/ToastNotification.js";
import { useFileSelected } from "../Table/Hooks/Context/SelectionContext.js";

export default function CloudinaryVideoPlayer({
    src,
    title,
    type,
    sidebar,
    publicId,
    startTime,
    endTime,
    clipId,
    setMainVideo,
    cloudName,
    videoId,
}) {
    console.log(type, 'typeeeeeeeeeeeeeeeeeeeeee');
    const { setPageLoaded } = useFileSelected();
    const playerRef = useRef(null);
    const videoRef = useRef(null);
    // console.log(setMainVideo, 'setMainVideo');
    const [isLoading, setIsLoading] = useState(false);
    // const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const handleDownload = async () => {
        try {
            setIsLoading(true);

            if (!src) {
                ToastNotification({ message: 'No video source found', type: 'error' });
                setIsLoading(false);
                return;
            }

            // Ensure that the src URL uses HTTPS
            const secureSrc = src.replace(/^http:/, 'https:');

            const response = await fetch(secureSrc);
            if (process.env.NODE_ENV === 'development') {
                console.log(response);
            }

            const videoBlob = await response.blob();

            const blobURL = URL.createObjectURL(videoBlob);

            const downloadLink = document.createElement("a");
            downloadLink.href = blobURL;

            if (type === "mp4" || type === "video") {
                downloadLink.download = `${title}.mp4`;
            } else {
                downloadLink.download = `${title}.mp3`;
            }

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




    const handleMediaEditorClick = () => {
        const mediaEditorTab = window.open(`/editor/${clipId}`, '_blank');
        const tabClosedListener = () => {
            if (process.env.NODE_ENV === 'development') {
                console.log('Media editor tab closeddddddd');
            }
            // window.location.reload();
            setPageLoaded(true);
            mediaEditorTab.removeEventListener('beforeunload', tabClosedListener);

        };
        mediaEditorTab.addEventListener('beforeunload', tabClosedListener);
    };
    useEffect(() => {
        const initializeVideoPlayer = async () => {
            try {
                if (!playerRef.current) {
                    playerRef.current = window.cloudinary;
                    await playerRef.current.videoPlayer(videoRef.current, {
                        controls: true,
                        preload: 'auto',
                        width: 200,
                        height: 900,
                        fluid: true,
                        autoplay: false,
                        muted: false,
                        aiHighlightsGraph: true,
                        seekbar: true,
                        showLogo: false,
                        sourceTypes: ['hls', 'webm', 'mp4'],
                        colors: {
                            accent: '#dc2626',
                            text: '#ffffff'
                        },
                        hideContextMenu: true,
                        showJumpControls: true,
                    });

                    videoRef.current.volume = 0.5;
                    videoRef.current.currentTime = 0.5;
                    videoRef.current.source = (event, data) => {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('loadeddata', event, data);
                        }
                    }
                    // const player = window.cloudinary.videoPlayer(videoRef.current, {
                    //     controls: true,
                    //     preload: 'auto',
                    //     width: 200,
                    //     height: 900,
                    //     fluid: true,
                    //     autoplay: false,
                    //     muted: false,
                    //     aiHighlightsGraph: true,
                    //     seekbar: true,
                    //     showLogo: false,
                    //     sourceTypes: ['hls', 'webm', 'mp4'],
                    //     colors: {
                    //         accent: '#dc2626',
                    //         text: '#ffffff'
                    //     },
                    //     hideContextMenu: true,
                    //     showJumpControls: true,
                    // });

                    // player.on('abort', function (e) {
                    //     console.error('Errrrrrrrrrrrrror code: ' + e);
                    //     if (e.Player.videojs.error_) {
                    //         var title = document.querySelector('.error-container');
                    //         title.innerHTML = 'Houston, we have a problem: ' + e.Player.videojs.error_.message + '. This is the status code: ' + e.Player.videojs.error_.statusCode;
                    //         title.style.color = 'red';
                    //     }
                    // })

                    // player.source(
                    //     'outdoors',
                    //     {
                    //         textTracks: {
                    //             captions: {
                    //                 label: 'English(captions)',
                    //                 language: 'en',
                    //                 default: true,
                    //                 url: 'https://res.cloudinary.com/demo/raw/upload/outdoors.vtt'
                    //             },
                    //             subtitles: [
                    //                 {
                    //                     label: 'English',
                    //                     language: 'en',
                    //                     url: 'https://res.cloudinary.com/demo/raw/upload/outdoors.vtt'
                    //                 }
                    //             ]
                    //         },
                    //         chapters: {
                    //             url:
                    //                 "https://res.cloudinary.com/demo/raw/upload/docs/chapters_example.vtt"
                    //         },
                    //         controlBar: {
                    //             chaptersButton: true
                    //         }
                    //     });
                }
            } catch (error) {
                if (process.env.NODE_ENV === 'development') {
                    console.error('Error initializing Video.js:', error);
                }
            }
        };

        initializeVideoPlayer();
    }, []);

    return (
        <>
            <div className={`cld-video-player cld-fluid w-full h-full  border border-white border-opacity-60  backdrop-blur-4 flex rounded-[10px] text-center `}>
                <video
                    ref={videoRef}
                    src={`${src}`}
                />
            </div>
            <div className={`flex justify-between items-center w-[370px] ${sidebar === true ? 'hidden' : 'block'}
            `}>
                <button
                    className={`w-1/2 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full  text-center p-2 gap-3 m-auto mt-2 ${sidebar ? '' : ''} flex-row justify-center items-center ${setMainVideo ? 'w-full' : ''}`}
                    onClick={handleDownload}
                >
                    <HiOutlineDownload />
                    {isLoading ? "Downloading..." : `Download ${type === 'mp4' || type === 'video' ? 'Video' : 'Audio'}`}
                </button>

                <Link
                    // to={`/editor/${clipId}`}
                    // target="_blank"
                    data-tooltip-id="MediaEditor"
                    className={` w-1/2 ml-1 border border-white border-opacity-60 bg-[rgba(42,42,63,0.64)] backdrop-blur-4 flex rounded-full text-center p-2 gap-3 m-auto mt-2 mb-0 ${sidebar ? '' : ''} flex-row justify-center items-center ${setMainVideo ? 'hidden' : 'block'}`}
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
    )
}