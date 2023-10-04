import React, { useState } from 'react';
import ReactEmoji from 'react-emoji-render';
import Navbar from '../components/Navbar';
import { useSnackbar } from 'notistack';
import { useCloudinary } from '../components/CloudinaryContext.js';


function HomeScreen({ userName }) {
    const [isDragging, setIsDragging] = useState(false);
    const { enqueueSnackbar } = useSnackbar();
    const { setCloudinaryResponse } = useCloudinary(); // Access the Cloudinary context

    // Flag to indicate if a new video is being uploaded
    const [isNewVideoUpload, setIsNewVideoUpload] = useState(false);

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

        if (hasAllowedExtension) {
            // Set isNewVideoUpload flag to true when a new video is uploaded
            setIsNewVideoUpload(true);

            // Upload the video here
            const files = droppedFiles[0];
            processFile(files);

            enqueueSnackbar(`File uploaded successfully: ${droppedFiles[0].name}`, {
                variant: 'success',
                autoHideDuration: 1300,
            });
        } else {
            // Show an error notification
            enqueueSnackbar('Error: Only .mp3 and .mp4 files are allowed.', {
                variant: 'error',
                autoHideDuration: 1500,
            });
        }
    };


    const processFile = async (file) => { // Use the passed file argument instead of e.target.files[0]
        // Set your cloud name and unsigned upload preset here:
        const YOUR_CLOUD_NAME = "delkyf33p";
        const YOUR_UNSIGNED_UPLOAD_PRESET = "klippie";

        const POST_URL = `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/auto/upload`;

        const XUniqueUploadId = +new Date();
        const sliceSize = 50 * 1024 * 1024; // Send chunks of 50MB
        let start = 0;

        while (start < file.size) {
            const end = Math.min(start + sliceSize, file.size);
            const chunk = file.slice(start, end);
            await sendChunk(chunk, start, end - 1, file.size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET);
            start = end;
        }
    };

    const sendChunk = async (chunk, start, end, size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET) => {
        console.log(`Sending chunk ${start}-${end} out of ${size}`);
        const formdata = new FormData();
        formdata.append("file", chunk);
        formdata.append("cloud_name", YOUR_CLOUD_NAME);
        formdata.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);
        formdata.append("public_id", "test" + XUniqueUploadId);

        const headers = {
            "X-Unique-Upload-Id": XUniqueUploadId,
        };

        try {
            const response = await fetch(POST_URL, {
                method: "POST",
                headers,
                body: formdata,
            });

            if (response.ok) {
                console.log(`Uploaded chunk ${start}-${end}`);
                const responseData = await response.json();
                console.log(responseData); // Log Cloudinary's response

                // Pass the Cloudinary response only once for a new video upload
                if (isNewVideoUpload) {
                    setCloudinaryResponse(responseData);
                    setIsNewVideoUpload(false); // Reset the flag after passing the data
                }
            } else {
                console.error(`Failed to upload chunk ${start}-${end}`);
                console.error(await response.text()); // Log the error response
            }
        } catch (error) {
            console.error(`Error uploading chunk ${start}-${end}: ${error.message}`);
        }
    };


    return (
        <>
            <div className="flex flex-col h-screen">
                <div className="">
                    <Navbar />
                </div>
                <div className={`flex-grow flex flex-col overflow-hidden dark:bg-transparent rounded-[60px] ${isDragging ? 'bg-blue-100 dark:bg-[#ffffff2a]' : 'bg-transparent'}`}
                    onDragEnter={handleDragEnter}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                >
                    <section
                        className="overflow-y-auto flex-grow"
                    >
                        <div className="px-16 h-[99%] flex flex-col justify-evenly select-none cursor-auto">
                            <h1 className=" text-white text-6xl text-left block font-normal w-full font-montserrat">
                                Hello, {userName}
                            </h1>

                            <div className='flex justify-start items-center h-[450px] w-full prompt-card'>
                                <div className="text-white select-none cursor-pointer px-4 py-5 w-full  font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px] me-4">
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
                                            <ReactEmoji text=":earth_americas: And much more!" />
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
                                    </div>
                                </div>

                                <div className="text-white select-none cursor-pointer px-4 py-5 w-full font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px] me-4">
                                    <div className="flex justify-center items-center px-3 mb-3  ">
                                        <span className="text-2xl font-bold text-white">💡</span>
                                        <h2 className="ms-3 text-gradient-tips w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                            Getting Started...
                                        </h2>
                                    </div>
                                    <div className="flex justify-center items-start flex-col">
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":arrow_up: Upload up to 2 hours of audio or video" />                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":robot_face: AI Finds the best clips" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":email: We'll email you when the clips are ready!" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":eyes: Review your clips for accuracy" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":computer: Modify the start & stop times" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2 font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":arrow_down: Download your favorite clips" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-white select-none cursor-pointer px-3 py-7 invisible w-[20%] font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px]">

                                </div>
                            </div>
                        </div>
                    </section>
                    <div className="flex justify-center items-center flex-col select-none cursor-pointer file-input mt-2" >
                        <div
                            className={`text-white select-none cursor-pointer text-center font-bold text-lg w-[50%] inline-block border-dashed border-2 rounded-lg py-10 ${isDragging ? 'border-blue-500 bg-blue-100 dark:bg-[#ffffff2a]' : 'border-gray-500 dark:bg-transparent'}`}
                            onClick={() => document.getElementById('file').click()}
                        >
                            <input hidden type='file' accept=".mp3, .mp4 " />
                            <label htmlFor="file" className="relative items-center text-base cursor-pointer text-center text-white hover:bg-opacity-70 hover:text-opacity-90">
                                Choose a File ( MP3, MP4 ) or Drag Here
                            </label>
                        </div>
                        <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg w-[52%] inline-block">
                            <div className="text-center">
                                <div className="relative mt-2">
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            placeholder="Paste a YouTube Link Here"
                                            className="relative w-full px-4 py-4 border-2 border-gray-500 rounded-l-lg text-white focus:outline-none bg-transparent border-dashed"
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
                </div>
            </div>
        </>
    );
}

export default HomeScreen;
