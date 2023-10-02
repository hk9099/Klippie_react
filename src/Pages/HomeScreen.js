import React from 'react';
import ReactEmoji from 'react-emoji-render';
// import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
// import { Swiper, SwiperSlide } from 'swiper/react';
// // Import Swiper styles
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import 'swiper/css/scrollbar';

// import Logo from '../assets/images/logo.svg';
import { useDropzone } from 'react-dropzone';
import Navbar from '../components/Navbar';
function HomeScreen({ userName }) {
    //eslint-disable-next-line
    // const rotatingWordsWithEmojis = ['Podcast 🎙️', 'Lectures 📚', 'Business 💼', 'Marketing 📈'];
    // const [currentWordIndex, setCurrentWordIndex] = useState(0);
    // const [rotatingWords, setRotatingWords] = useState([]);
    // // const [currentEmoji, setCurrentEmoji] = useState('');
    // const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // useEffect(() => {
    //     const handleResize = () => {
    //         setWindowWidth(window.innerWidth);
    //     };

    //     window.addEventListener('resize', handleResize);

    //     return () => {
    //         window.removeEventListener('resize', handleResize);
    //     };
    // }, []);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWordsWithEmojis.length);
    //     }, 2000);

    //     return () => clearInterval(interval);
    // }, [rotatingWordsWithEmojis]);

    // useEffect(() => {
    //     // Split emojis and words
    //     const words = rotatingWordsWithEmojis.map((text) => text.split(' ')[0]);
    //     const emojis = rotatingWordsWithEmojis.map((text) => text.split(' ')[1]);

    //     setRotatingWords(words);
    //     setCurrentEmoji(emojis[currentWordIndex]);
    //     //eslint-disable-next-line
    // }, [currentWordIndex]);

    // useEffect(() => {
    //     const interval = setInterval(() => {
    //         setCurrentWordIndex((prevIndex) => (prevIndex + 1) % rotatingWords.length);
    //     }, 2000);

    //     return () => clearInterval(interval);
    // }, [rotatingWords.length]);

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
        <>
            <div className="flex flex-col h-screen">
                <div className="">
                    <Navbar />
                    {/* Your Navbar component here */}
                </div>
                <div className="flex-grow flex flex-col overflow-hidden dark:bg-transparent rounded-[60px]">
                    <section
                        className="overflow-y-auto flex-grow"
                        draggable="true"
                        onClick={handleSectionClick}
                    >
                        <div className="px-16 h-[99%] flex flex-col justify-evenly select-none cursor-auto">
                            {/* <div className="w-full">
                        <img src={Logo} alt="logo" className="text-left w-12 h-12 dark:bg-white rounded-full" />
                    </div> */}
                            <h1 className=" text-white text-6xl text-left block font-normal w-full font-montserrat">
                                Hello, {userName}
                            </h1>
                            {/* <div className="flex justify-center items-center select-none cursor-pointer">
                        <div className="text-white  py-4 font-normal text-lg inline-block font-worksans tracking-tight">
                            Welcome to Klippie! We harness AI to effortlessly distill lengthy videos into captivating short clips. Ideal for crafting dynamic content across social media, websites, and the digital realm. Share your
                            <span className="mx-2 rotating-text font-worksans tracking-tight space-y-2 text-green-600 w-auto text-gradient bg-gradient-to-r from-sky-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%  font-bold text-xl inline-block rounded-2xl bg-clip-text text-transparent font-Satoshi">
                                {rotatingWords.map((word, index) => (
                                    <span key={index} className={`rotating-word ${index === currentWordIndex ? 'visible' : 'hidden'}`}>
                                        {word}
                                    </span>
                                ))}
                            </span>
                            {currentEmoji}
                            video, and I'll uncover intriguing moments. While I'm not flawless, your feedback guides my evolution.
                        </div>
                    </div> */}

                            <div className='flex justify-start items-center w-full prompt-card'>
                                <div className="text-white select-none cursor-pointer px-4 py-5 w-full  font-bold text-lg inline-block  dark:bg-[#ffffff2a] rounded-[50px] me-4">
                                    <div className="flex justify-center items-center px-3 mb-3  ">
                                        <span className="text-2xl font-bold text-white">🚀</span>
                                        <h2 className="ms-3 text-gradient-ideas w-full font-bold text-3xl inline-block rounded-2xl bg-clip-text text-transparent ">
                                            Find the best clips for your....
                                        </h2>
                                    </div>
                                    <div className="flex justify-center items-start flex-col">
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20 font-InclusiveSans  ">
                                            <ReactEmoji text=":studio_microphone: Podcasts" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":computer: Webinars" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":female-technologist: Product Demos" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":mega: Speeches" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":books: Lectures" />
                                        </div>
                                        <div className="text-white select-none cursor-pointer px-3 py-2  font-medium text-lg inline-block mx-3 my-1 dark:bg-[#ffffff2a] rounded-full transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-20">
                                            <ReactEmoji text=":earth_americas: And much more!" />
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
                        <div className="text-white select-none cursor-pointer text-center font-bold text-lg w-[50%] inline-block border-dashed border-2 border-gray-500 rounded-lg py-10" {...getRootProps()}>
                            <input {...getInputProps()} onClick={(e) => e.stopPropagation()} />
                            <label htmlFor="file" className="relative items-center text-base cursor-pointer text-center text-white hover:bg-opacity-70 hover:text-opacity-90">
                                Choose a File ( mp3, mp4), or Drag Here
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
