import React, { useState, useRef } from 'react';
import ReactEmoji from 'react-emoji-render';
import Navbar from '../components/Navbar';
import { useSnackbar } from 'notistack';
import { useCloudinary } from '../context/CloudinaryContext.js';
import { Progress } from 'react-sweet-progress';
import axios from 'axios';
import "react-sweet-progress/lib/style.css";
import { TokenManager } from '../components/getToken.js';

function MyProgressBar({ bytesUploaded, totalBytes }) {
    const percent = Math.round((bytesUploaded / totalBytes) * 100) || 0;

    return (
        <Progress
            percent={percent}
            type="line"
            status="success"
            percentage={true}
            className="custom-progress"
            theme={{
                error: {
                    symbol: percent + '%',
                    trailColor: 'pink',
                    color: 'red'
                },
                default: {
                    symbol: percent + '%',
                    trailColor: 'lightblue',
                    color: 'blue'
                },
                active: {
                    symbol: percent + '%',
                    trailColor: 'yellow',
                    color: 'orange'
                },
                success: {
                    symbol: percent + '%',
                    trailColor: '#ACDF87',
                    color: 'green'
                }
            }}
        />
    );
}

function HomeScreen({ userName, creaditBalance }) {
    const [isDragging, setIsDragging] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { setCloudinaryResponse } = useCloudinary();
    const [isFileUploaded, setIsFileUploaded] = useState();
    const [isFileUploadedInput, setIsFileUploadedInput] = useState();
    const [isFirstChunkLogged, setIsFirstChunkLogged] = useState(false);
    const [isNewVideoUpload, setIsNewVideoUpload] = useState(false);
    const [bytesUploaded, setBytesUploaded] = useState(0);
    const [totalBytes, setTotalBytes] = useState(0);
    const fileInputRef = useRef(null);
    var loginCount = localStorage.getItem('loginCount');
    const userToken = TokenManager.getToken()[1]


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        console.log(file, 'file');

        if (file) {
            // Create a video element to read the video file
            const videoElement = document.createElement('video');
            videoElement.src = URL.createObjectURL(file);

            // When the video metadata is loaded, get the duration
            videoElement.onloadedmetadata = async () => {
                const duration = Math.floor(videoElement.duration);
                console.log('Video Duration:', duration, 'seconds');
                let data = JSON.stringify({
                    "seconds": duration
                });
                console.log(data, 'data');
                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://dev-api.getklippie.com/v1/project/project-eligibility',
                    headers: {
                        'accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${userToken}`
                    },
                    data: data
                };

                try {
                    const response = await axios.request(config);
                    console.log(response, 'response');
                    processFile(file);
                    setIsFileUploadedInput(true);
                } catch (error) {
                    enqueueSnackbar(error.response.data.error, {
                        variant: 'error',
                        autoHideDuration: 1500,
                    });
                    console.log(error.response.data.error, 'error.response.data.message');
                }
            };

            // Clean up the video element
            videoElement.remove();
        }


        fileInputRef.current.value = '';
    };


    const handleDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = e.dataTransfer.files;

        // Check if any of the dropped files have the correct extensions
        const allowedExtensions = ['.mp3', '.mp4'];
        const hasAllowedExtension = Array.from(droppedFiles).some((file) =>
            allowedExtensions.includes(file.name.toLowerCase().slice(-4))
        );

        if (droppedFiles.length > 0) {
            // Files were dropped
            if (hasAllowedExtension) {
                if (isFileUploaded) {
                    // If the entire file has already been uploaded, do nothing
                    return;
                }

                // Upload the video here
                const files = droppedFiles[0];
                console.log(files, 'files');
                // processFile(files);
                if (files) {
                    // Create a video element to read the video file
                    const videoElement = document.createElement('video');
                    videoElement.src = URL.createObjectURL(files);

                    // When the video metadata is loaded, get the duration
                    videoElement.onloadedmetadata = async () => {
                        const duration = Math.floor(videoElement.duration);
                        console.log('Video Duration:', duration, 'seconds');
                        let data = JSON.stringify({
                            "seconds": duration
                        });
                        console.log(data, 'data');
                        let config = {
                            method: 'post',
                            maxBodyLength: Infinity,
                            url: 'https://dev-api.getklippie.com/v1/project/project-eligibility',
                            headers: {
                                'accept': 'application/json',
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${userToken}`
                            },
                            data: data
                        };

                        try {
                            const response = await axios.request(config);
                            console.log(response, 'response');
                            processFile(files);
                            setIsFileUploadedInput(true);
                            setIsNewVideoUpload(true);
                            setIsFileUploaded(true)
                            enqueueSnackbar(`File uploaded successfully: ${droppedFiles[0].name}`, {
                                variant: 'success',
                                autoHideDuration: 1300,
                            });

                        } catch (error) {
                            enqueueSnackbar(error.response.data.error, {
                                variant: 'error',
                                autoHideDuration: 1500,
                            });
                            console.log(error.response.data.error, 'error.response.data.message');
                        }
                    };

                    // Clean up the video element
                    videoElement.remove();
                }
            } else {
                // Show an error notification
                enqueueSnackbar('Error: Only .mp3 and .mp4 files are allowed.', {
                    variant: 'error',
                    autoHideDuration: 1500,
                });
            }
        }
    };

    const processFile = async (file) => {
        // Set your cloud name and unsigned upload preset here:
        const YOUR_CLOUD_NAME = "delkyf33p";
        const YOUR_UNSIGNED_UPLOAD_PRESET = "klippie";

        const POST_URL = `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/auto/upload`;

        const XUniqueUploadId = +new Date();
        const sliceSize = 5 * 1024 * 1024; // Send chunks of 50MB
        let start = 0;

        // Calculate the total number of chunks
        const totalChunks = Math.ceil(file.size / sliceSize);

        while (start < file.size) {
            const end = Math.min(start + sliceSize, file.size);
            const chunk = file.slice(start, end);
            await sendChunk(chunk, start, end - 1, file.size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET, totalChunks);
            start = end;
        }
    };

    const sendChunk = async (chunk, start, end, size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET) => {
        // console.log(`bytes ${start}-${end}/${size}`)
        const formdata = new FormData();
        formdata.append("file", chunk);
        formdata.append("cloud_name", YOUR_CLOUD_NAME);
        formdata.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);
        formdata.append("public_id", "test" + XUniqueUploadId);

        const headers = {
            "X-Unique-Upload-Id": XUniqueUploadId,
            "Content-Range": `bytes ${start}-${end}/${size}`,
        };

        try {
            const response = await fetch(POST_URL, {
                method: "POST",
                headers,
                body: formdata,
            });

            if (response.ok) {
                const responseData = await response.json();
                // console.log(responseData);
                if (start === 0 && !isFirstChunkLogged) {
                    setIsFirstChunkLogged(true);
                }

                if (isNewVideoUpload) {
                    setIsNewVideoUpload(false);
                }
                setBytesUploaded(end + 1);
                setTotalBytes(size);

                if (end + 1 === size) {
                    console.log(responseData);
                    setIsFileUploaded(false);
                    setIsFileUploadedInput(false);
                    setIsFileUploaded(false);
                    setBytesUploaded(0);
                    setTotalBytes(0);
                    setIsFirstChunkLogged(false);
                    setCloudinaryResponse(responseData);
                }


            } else {
                console.error(`Failed to upload chunk ${start}-${end}`);
                console.error(await response.text());
            }
        } catch (error) {
            console.error(`Error uploading chunk ${start}-${end}: ${error.message}`);
        }
    };
    return (
        <>
            <div className="flex flex-col h-screen " onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
                <div className="">
                    <Navbar creaditBalance={creaditBalance} />
                </div>
                <section
                    className={`flex-grow flex flex-col overflow-hidden dark:bg-transparent  ${isDragging ? 'border-dashed border-2 rounded-3xl border-sky-500 dark:bg-[#ffffff2a]' : 'dark:bg-transparent'
                        } ${isFileUploaded ? 'border-dashed border-2 rounded-3xl border-green-500 dark:bg-[#ffffff2a]' : 'dark:bg-transparent'} ${isFileUploaded ? 'pointer-events-none' : ''} ${isFileUploadedInput ? 'pointer-events-none' : ''}`}
                >
                    <div
                        className={`overflow-y-auto flex-grow`}
                    >
                        <div className="px-16 flex flex-col justify-evenly select-none ">
                            <h1 className="text-white  sm:text-2xl md:text-2xl lg:text-3xl xl:text-5xl 2xl:text-6xl 
                             text-left block font-medium w-full font-montserrat py-3">
                                {loginCount > 1 ? `Welcome back, ${userName} 😊` : `Hello, ${userName} 👋`}
                            </h1>


                            <div className='flex justify-start items-center xl:h-[450px]  2xl:h-full lg:flex-col xl:flex-row 
                            w-full prompt-card'>
                                <div className='w-full rounded-[60px] overflow-hidden mr-4'>
                                    <div className="text-white relative select-none cursor-pointer px-4 py-5 w-full h-[420px] font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px] me-4 overflow-x-scroll">
                                        <div className="flex justify-center items-center px-3 mb-3  ">
                                            <span className="text-2xl font-bold text-white">🚀</span>
                                            <h2 className="ms-3 text-gradient-ideas w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                                Find the best clips for your....
                                            </h2>
                                        </div>
                                        <div className="flex justify-start items-start flex-wrap flex-row">
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20 font-InclusiveSans  ">
                                                <ReactEmoji text=":studio_microphone: Podcasts" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":computer: Webinars" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":female-technologist: Product Demos" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="📢 Speeches" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":books: Lectures" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="💻 Online Courses" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="🌐  News Shows" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":raising_hand: Panel Discussions" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":office: Corporate Meetings" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="🏅 Sports Shows" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":microphone: Comedy Shows" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":mega: Political Speeches" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="🏛 Town Hall Meetings" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text="💬 Talk shows" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":pray: Religious events" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":cake: Cooking shows" />
                                            </div>
                                            <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-1 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                                <ReactEmoji text=":earth_americas: And much more!" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-white select-none cursor-pointer px-4 py-5 w-full h-[420px] font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px] me-4">
                                    <div className="flex justify-center items-center px-3 mb-3  ">
                                        <span className="text-2xl font-bold text-white">💡</span>
                                        <h2 className="ms-3 text-gradient-tips w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                            Getting Started...
                                        </h2>
                                    </div>
                                    <div className="flex justify-center items-start flex-col">
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":arrow_up: Upload up to 2 hours of audio or video" />                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":robot_face: AI Finds the best clips" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":email: We'll email you when the clips are ready!" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":eyes: Review your clips for accuracy" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":computer: Modify the start & stop times" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":arrow_down: Download your favorite clips" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-white select-none cursor-pointer px-3 py-7 invisible w-[20%] font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px]">

                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-center items-center flex-col select-none cursor-pointer file-input mt-2" >
                        <div
                            className={`text-white select-none cursor-pointer text-center font-bold text-lg w-[50%] inline-block border-dashed border-2 rounded-lg py-10 ${isDragging ? 'border-blue-500 bg-blue-100 dark:bg-[#ffffff2a]' : 'border-gray-500 dark:bg-transparent'} ${isFileUploaded ? 'border-dashed border-2 border-green-500 dark:bg-[#ffffff2a]' : ''} ${isFileUploadedInput ? 'border-dashed border-2 border-green-500 dark:bg-[#ffffff2a]' : ''}`}
                            onClick={() => { fileInputRef.current.click(); }}
                        >
                            <input
                                hidden
                                type='file'
                                accept=".mp3, .mp4"
                                className={`${isFileUploadedInput ? 'cursor-not-allowed' : ''} ${isFileUploaded ? 'cursor-not-allowed' : ''}`}
                                id='file'
                                onChange={handleFileChange}
                                ref={fileInputRef}
                            />
                            <label htmlFor="file" className="relative items-center text-base cursor-pointer text-center text-white hover:bg-opacity-70 hover:text-opacity-90">
                                Choose a File (MP3, MP4) or Drag Here
                            </label>
                        </div>
                        <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg w-[51.5%] inline-block">
                            <div className="text-center">
                                <div className="relative mt-2">
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Paste a YouTube Link Here"
                                            className="relative w-full px-4 py-4 border-2 border-gray-500 rounded-lg text-white focus:outline-none bg-transparent border-dashed"
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-3 px-4 py-2 font-bold text-lg text-white bg-gray-500 rounded-lg hover:bg-gray-400"
                                        >
                                            Get Clips 🚀
                                        </button>
                                    </div>
                                </div>
                            </div>


                        </div>

                    </div>
                    {isFileUploadedInput || isFileUploaded ? (
                        <>
                            <div className="text-white w-full text-center font-ubuntu font-semibold flex justify-center items-center">
                                <MyProgressBar bytesUploaded={bytesUploaded} totalBytes={totalBytes} />
                                {/* <div className="text-white text-center font-ubuntu font-semibold">
                            {(bytesUploaded / 1048576).toFixed(2)}&nbsp;/&nbsp;{(totalBytes / 1048576).toFixed(2)}&nbsp;MB
                        </div> */}
                            </div>
                        </>
                    ) : null}
                </section>
            </div>
        </>
    );
}

export default HomeScreen;