import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BsArrowLeftCircle } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
import { IoSettingsOutline } from 'react-icons/io5'
import { MdOutlineLiveHelp } from 'react-icons/md'
// import { BiLogOut } from 'react-icons/bi'
import Logo from '../assets/images/logo.svg'
import HamburgerButton from './HumbergerButton'
import '.././assets/css/Sidebar.css'
import { AiOutlineDelete } from 'react-icons/ai'
import Logout from './logout'


const Sidebar = () => {
    const navigate = useNavigate();
    const [open, setOpen] = useState(true)
    const [mobileMenu, setMobileMenu] = useState(false)
    const location = useLocation()
    const [lines, setLines] = useState([
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
        'Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.',
        'Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.',
        'Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)',
        'Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.',
    ]);

    useEffect(() => {
        const encodedEmail = localStorage.getItem('_auth');
        if (encodedEmail) {
            navigate('/dashboard');
        } else {
            navigate('/');
        }
    }, [navigate]);



    // const Menus = [
    //     { title: 'Dashboard', path: '/dashboard', src: <AiOutlinePlus /> },
    // ]

    const deleteLine = (index) => {
        setLines((prevLines) => {
            const updatedLines = [...prevLines];
            updatedLines.splice(index, 1);
            return updatedLines;
        });
    };

    return (
        <>
            <div className={`${open ? 'w-[260px]' : 'w-fit'} fixed top-0 p-2  z-40 flex h-full  flex-none flex-col space-y-2  text-[14px] transition-all sm:relative sm:top-0 bg-gray-100 border-r border-gray-200 dark:border-gray-600 dark:bg-custom-color-dark`}>

                <BsArrowLeftCircle
                    className={`${!open && 'rotate-180'
                        } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-custom-color-dark`}
                    onClick={() => setOpen(!open)}
                />
                <Link to='/dashboard'>
                    <div className={`flex ${open && 'gap-x-4'} items-center`}>
                        <img src={Logo} alt='' className='pl-2' />
                        {open && (
                            <span className={`text-3xl ml-4 font-bold font-poppins whitespace-nowrap dark:text-white`}>
                                Klippie
                            </span>
                        )}
                    </div>
                </Link>

                <div className='pt-6'>
                    <Link to="/dashboard">
                        <button
                            className={`flex items-center w-full gap-x-6 p-3 text-base rounded-full cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border-4 border-gray-500 dark:border-gray-100
                        mt-2 ${location.pathname === "/dashboard" && 'bg-gray-200 dark:bg-gray-700'}
                        border-animation`}
                        >
                            <span className='text-2xl'><AiOutlinePlus /></span>
                            <span className={`${!open && 'hidden'} origin-left duration-300 hover:block font-medium text-sm`}>
                                Add New Video/Audio
                            </span>
                        </button>

                    </Link>
                </div>

                <div className="border-t border-white/20 flex-grow overflow-y-auto">
                    <div className={`overflow-hidden ${!open && 'hidden'} relative`}>
                        {lines.map((line, index) => (
                            <div key={index} className="width-content row relative bg-gray-200 dark:bg-gray-700 my-2 rounded">
                                <p className='py-2 px-1 bg-gray-200 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-white rounded' style={{ width: '243px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {line}
                                </p>
                                <button onClick={() => deleteLine(index)} className="delete-button">
                                    <AiOutlineDelete />
                                </button>
                            </div>
                        ))}
                    </div>

                </div>
                <div className={` bottom-0 left-0 right-0 border-t border-white/20`}>
                    <div className=" flex flex-col gap-1">
                        <Link to="/dashboard">
                            <p className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${location.pathname === "/dashboard" && ''}`}
                            >
                                <span className='text-2xl'><IoSettingsOutline /></span>
                                <span className={`${!open && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                                    Settings
                                </span>
                            </p>
                        </Link>
                        <Link to="/dashboard">
                            <p
                                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        ${location.pathname === "/dashboard" && ''}`}
                            >
                                <span className='text-2xl'><MdOutlineLiveHelp /></span>
                                <span className={`${!open && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                                    Get Help
                                </span>
                            </p>
                        </Link>
                        <Logout />
                    </div>
                </div>

            </div>
            {/* Mobile Menu */}
            <div className="pt-3">
                <HamburgerButton
                    setMobileMenu={setMobileMenu}
                    mobileMenu={mobileMenu}
                />
            </div>
            <div className="sm:hidden">
                <div
                    className={`${mobileMenu ? 'flex' : 'hidden'
                        } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-blackk-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
                >
                    <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
                        <span className={` ${location.pathname === "/dashboard" && 'bg-gray-200 dark:bg-gray-700'} p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}>
                            Dashboard
                        </span>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default Sidebar
