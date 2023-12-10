// import React, {useState, useEffect } from 'react';
// import { HiOutlineDownload } from "react-icons/hi";
// // import CloudinaryMediaEditor from "../components/mediaEditor.js";
// import { Link } from "react-router-dom";
// import { BiSolidEdit } from 'react-icons/bi';
// // import { Tooltip } from 'react-tooltip';
// import ToastNotification from "../components/ToastNotification";
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
import { useEffect, useRef ,useState} from 'react';
import { HiOutlineDownload } from "react-icons/hi";
// import CloudinaryMediaEditor from "../components/mediaEditor.js";
import { Link } from "react-router-dom";
import { BiSolidEdit } from 'react-icons/bi';
// import { Tooltip } from 'react-tooltip';
import ToastNotification from "../components/ToastNotification";
import { Toaster } from 'react-hot-toast';

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
    useEffect(() => {
        if (playerRef.current) return;
        playerRef.current = window.cloudinary;
        playerRef.current.videoPlayer(videoRef.current, {
            controls: true,
            preload: 'auto',
            width: 200,
            height: 900,
            fluid: true,
            autoplay: true,
            muted: true,
            aiHighlightsGraph: true,
            autoplayMode: 'on-scroll',
            sourceTypes: ['hls', 'webm', 'mp4'],
            logoImageUrl: 'https://res.cloudinary.com/delkyf33p/image/upload/v1701593905/tkfstyrkbhxjqg80yz21.png',
            logoOnclickUrl: 'https://klippie-react.vercel.app',
            colors: {
                base: '#7360b96d',
                accent: '#7360b96d',
                text: '#ffffff'
            },
            // floatingWhenNotVisible: 'right',
            hideContextMenu: true,
            showJumpControls: true
        });

        // return () => {
        //     if (playerRef.current) {
        //         playerRef.current.destroy();
        //         playerRef.current = null;
        //     }
        // }

    }, [])
    return (
        <>
        <div className={`cld-video-player cld-fluid w-full h-full ${sidebar ? 'hidden' : ''} border border-white border-opacity-60  backdrop-blur-4 flex rounded-[10px] text-center `}>
            <video
                ref={videoRef}
                src={`${src}`}
            />
            <style jsx>{`
                .vjs-control-bar{
                    border-bottom-left-radius: 10px !important;
                    border-bottom-right-radius: 10px !important;
                }
            
                .cld-video-player .vjs-title-bar{
                    display: none !important;
                }
            
                .cld-video-player .vjs-big-play-button{
                    width: 50px !important;
                }
            `}</style>
        </div>
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
    )
}


// import React from 'react';
// import 'devextreme/dist/css/dx.light.css';
// import { Button } from 'devextreme-react';
// import { Popup, ToolbarItem } from 'devextreme-react/popup';
// import ScrollView from 'devextreme-react/scroll-view';

// export default function App() {
//   const [popupVisible, setPopupVisible] = React.useState(false);
//   const [popupWithScrollViewVisible, setPopupWithScrollViewVisible] = React.useState(false);

//   const showPopup = React.useCallback(() => {
//     setPopupVisible(true);
//   }, [setPopupVisible]);

//   const showPopupWithScrollView = React.useCallback(() => {
//     setPopupWithScrollViewVisible(true);
//   }, [setPopupWithScrollViewVisible]);

//   const hide = React.useCallback(() => {
//     setPopupVisible(false);
//     setPopupWithScrollViewVisible(false);
//   }, [setPopupVisible, setPopupWithScrollViewVisible]);

//   const bookButtonOptions = React.useMemo(() => ({
//     width: 300,
//     text: 'Book',
//     type: 'default',
//     stylingMode: 'contained',
//     onClick: hide,
//   }));

//   return (
//     <React.Fragment>
//       <div className="demo-container">
//         <div className="button-container">
//           <Button
//             text="Show Popup"
//             type="default"
//             width={300}
//             onClick={showPopup}
//           />
//           <div className="label"> A native scrollable container </div>
//         </div>

//         <div className="button-container">
//           <Button
//             text="Show Popup"
//             width={300}
//             onClick={showPopupWithScrollView}
//           />
//           <div className="label"> The ScrollView </div>
//         </div>
//       </div>

//       <Popup
//         width={360}
//         height={320}
//         visible={popupVisible}
//         onHiding={hide}
//         hideOnOutsideClick={true}
//         showCloseButton={true}
//         title="Downtown Inn">
//         <div className="popup-content">
//           <div className="caption">Description</div>
//           In the heart of LA&apos;s business district, the Downtown Inn has a welcoming staff
//           and award winning restaurants that remain open 24 hours a day.
//           Use our conference room facilities to conduct meetings and have a drink
//           at our beautiful rooftop bar.
//           <br /><br />
//           <div className="content">
//             <div>
//               <div className="caption">Features</div>
//               <div>Concierge</div>
//               <div>Restaurant</div>
//               <div>Valet Parking</div>
//               <div>Fitness Center</div>
//               <div>Sauna</div>
//               <div>Airport Shuttle</div>
//             </div>
//             <div>
//               <div className="caption">Rooms</div>
//               <div>Climate control</div>
//               <div>Air conditioning</div>
//               <div>Coffee/tea maker</div>
//               <div>Iron/ironing</div>
//             </div>
//           </div>
//         </div>
//         <ToolbarItem
//           widget="dxButton"
//           toolbar="bottom"
//           location="center"
//           options={bookButtonOptions}
//         />
//       </Popup>

//       <Popup
//         width={360}
//         height={320}
//         visible={popupWithScrollViewVisible}
//         onHiding={hide}
//         hideOnOutsideClick={true}
//         showCloseButton={true}
//         title="Downtown Inn">
//         <ScrollView width='100%' height='100%'>
//           <div className="caption">Description</div>
//           In the heart of LA&apos;s business district, the Downtown Inn has a welcoming staff
//           and award winning restaurants that remain open 24 hours a day.
//           Use our conference room facilities to conduct meetings and have a drink
//           at our beautiful rooftop bar.
//           <br /><br />
//           <div className="content">
//             <div>
//               <div className="caption">Features</div>
//               <div>Concierge</div>
//               <div>Restaurant</div>
//               <div>Valet Parking</div>
//               <div>Fitness Center</div>
//               <div>Sauna</div>
//               <div>Airport Shuttle</div>
//             </div>
//             <div>
//               <div className="caption">Rooms</div>
//               <div>Climate control</div>
//               <div>Air conditioning</div>
//               <div>Coffee/tea maker</div>
//               <div>Iron/ironing</div>
//             </div>
//           </div>
//         </ScrollView>
//         <ToolbarItem
//           widget="dxButton"
//           toolbar="bottom"
//           location="center"
//           options={bookButtonOptions}
//         />
//       </Popup>
//     </React.Fragment>
//   );
// }
