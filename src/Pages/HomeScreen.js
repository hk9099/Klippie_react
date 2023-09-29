import React, { useState, useEffect } from 'react';
import Logo from '../assets/images/logo.svg';
import { useDropzone } from 'react-dropzone';
// import { useUserNickname } from '../components/userNicknameContext.js';
function HomeScreen() {
    //eslint-disable-next-line
    const rotatingWordsWithEmojis = ['Podcast 🎙️', 'Lectures 📚', 'Business 💼', 'Marketing 📈'];
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [rotatingWords, setRotatingWords] = useState([]);
    const [currentEmoji, setCurrentEmoji] = useState('');
    // const { userNickname } = useUserNickname();
    // console.log(userNickname, 'userNickname');

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWordsWithEmojis.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [rotatingWordsWithEmojis]);

    useEffect(() => {
        // Split emojis and words
        const words = rotatingWordsWithEmojis.map((text) => text.split(' ')[0]);
        const emojis = rotatingWordsWithEmojis.map((text) => text.split(' ')[1]);

        setRotatingWords(words);
        setCurrentEmoji(emojis[currentWordIndex]);
        //eslint-disable-next-line
    }, [currentWordIndex ]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [rotatingWords.length]);

    const onDrop = (acceptedFiles) => {
        // Handle the dropped files here
        console.log('Dropped files:', acceptedFiles);
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleSectionClick = (e) => {
        // Prevent click event propagation for the section
        e.stopPropagation();
    };

    return (
        <section
            className={`flex-grow-0 flex-shrink-0 w-[100%] h-[90%] overflow-y-auto overflow-x-scroll dark:bg-[#ffffff2a] rounded-[60px] z-50`}
            draggable="true"
            onClick={handleSectionClick} // Prevent section click event propagation
        >
            <div className=" px-20 pt-9 select-none cursor-auto"  >
                <div className="w-full">
                    <img src={Logo} alt="logo" className="text-left w-12 h-12 dark:bg-white rounded-full" />
                </div>
                <h1 className=" text-white text-7xl text-left block py-4 font-normal w-full font-ubuntu">
                    Welcome to Klippie!
                </h1>
                <div className="flex justify-center items-center select-none cursor-pointer">
                    <div className="text-white  py-4 font-normal text-lg inline-block font-worksans tracking-tight">
                        Welcome to Klippie! We harness AI to effortlessly distill lengthy videos into captivating short clips. Ideal for crafting dynamic content across social media, websites, and the digital realm. Share your
                        <span className="mx-2 rotating-text font-worksans tracking-tight space-y-2 text-green-600 w-auto text-gradient bg-gradient-to-r from-sky-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%  font-bold text-xl inline-block rounded-2xl bg-clip-text text-transparent font-Satoshi">
                            {rotatingWords.map((word, index) => (
                                <span key={index} className={`rotating-word ${index === currentWordIndex ? 'visible' : 'hidden'}`}>
                                    {word}
                                </span>
                            ))}
                        </span>
                        {currentEmoji} {/* Display the current emoji */}
                        video, and I'll uncover intriguing moments. While I'm not flawless, your feedback guides my evolution.
                    </div>
                </div>
                <div className='flex justify-start items-center w-full pb-3 '>
                    <div className="text-white select-none cursor-pointer px-3 py-7 w-full font-bold text-lg inline-block m-3 dark:bg-[#ffffff2a] rounded-[50px] me-4">
                        <div className="flex justify-center items-center px-3 mb-3  ">
                            <span className="text-2xl font-bold text-white">🗂️</span>
                            <h2 className="ms-3 text-gradient-create w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                Create
                            </h2>
                        </div>
                        <div className="flex justify-center items-start flex-col mb-40">
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20 font-InclusiveSans  ">
                               Try Klip Whisper Today
                            </div>
                            <button className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full ">
                                📁 Upload Audio or Video
                            </button>
                        </div>
                    </div>
                    <div className="text-white select-none cursor-pointer px-3 py-7 w-full font-bold text-lg inline-block m-3 dark:bg-[#ffffff2a] rounded-[50px] me-4">
                        <div className="flex justify-center items-center px-3 mb-3  ">
                            <span className="text-2xl font-bold text-white">🚀</span>
                            <h2 className="ms-3 text-gradient-ideas w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                Ideas
                            </h2>
                        </div>
                        <div className="flex justify-center items-start flex-col">
                            <div className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20 font-InclusiveSans  ">
                                🎙️ Podcasters: Clip podcast highlights.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                📚 Educators: Enhance lectures.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                🏢 Businesses: Elevate webinars.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                📢 Marketers: Share social content.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2  font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                🌐 Everyone: Create engaging content.
                            </div>
                        </div>
                    </div>

                    <div className="text-white select-none cursor-pointer px-3 py-7 w-full font-bold text-lg inline-block m-3 dark:bg-[#ffffff2a] rounded-[50px] me-4">
                        <div className="flex justify-center items-center px-3 mb-3  ">
                            <span className="text-2xl font-bold text-white">💡</span>
                            <h2 className="ms-3 text-gradient-tips w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                Tips
                            </h2>
                        </div>
                        <div className="flex justify-center items-start flex-col">
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                📁 Upload 2 hours of audio or video.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                ☁️ Import from computer or cloud.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                🤖 AI finds the best clips.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                ✏️ Modify with ease.
                            </div>
                            <div className="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-2xl transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                💾 Download your favorite clips.
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center flex-col select-none cursor-pointer  ">
                    <div className="text-white select-none cursor-pointer text-center font-bold text-lg w-[50%] inline-block border-dashed border-2 border-gray-500 rounded-lg  py-10" {...getRootProps()}>
                        <input {...getInputProps()} onClick={(e) => e.stopPropagation()} />
                        <label
                            htmlFor="file"
                            className="relative items-center text-base cursor-pointer text-center text-white hover:bg-opacity-70 hover:text-opacity-90"
                        >
                            Choose a File (mov, mp3, mp4), or Drag Here
                        </label>
                    </div>
                    <div class="text-white select-none cursor-pointer px-3 py-2 font-bold text-lg w-[52%] inline-block">
                        <div class="text-center">
                            <div class="relative mt-2">
                                <div class="flex items-center">
                                    <input
                                        type="text"
                                        placeholder="Drop a video link here"
                                        class="relative w-full px-4 py-4 border-2 border-gray-500 rounded-l-lg text-white focus:outline-none bg-transparent border-dashed"
                                    />
                                    <button
                                        type="button"
                                        class="absolute right-3 px-4 py-2 font-bold text-lg text-white bg-gray-500 rounded-lg hover:bg-gray-400"
                                    >
                                        Get Clips 🚀
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}

export default HomeScreen;
