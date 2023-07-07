import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

import { BsArrowLeftCircle } from 'react-icons/bs'
import { AiOutlinePlus } from 'react-icons/ai'
// import { SiFuturelearn } from 'react-icons/si'
// import { SiOpenaccess } from 'react-icons/si'
// import { CgProfile } from 'react-icons/cg'
import Logo from '../assets/images/logo.svg'
import HamburgerButton from './HumbergerButton'
import '.././assets/css/Sidebar.css'

const Sidebar = () => {
    const [open, setOpen] = useState(true)
    const [mobileMenu, setMobileMenu] = useState(false)
    const location = useLocation()

    // const Menus = [
    //     { title: 'Dashboard', path: '/dashboard', src: <AiOutlinePlus /> },
    // ]

    return (
        <>
            <div  className={`${open ? 'w-80' : 'w-fit' }  hidden sm:block relative duration-300 bg-gray-100 border-r border-gray-200 dark:border-gray-600 p-5 dark:bg-custom-color-dark`}>
                <BsArrowLeftCircle
                    className={`${!open && 'rotate-180'
                        } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-custom-color-dark`}
                    onClick={() => setOpen(!open)}
                />
                <Link to='/'>
                    <div className={`flex ${open && 'gap-x-4'} items-center`}>
                        <img src={Logo} alt='' className='pl-2' />
                        {open && (
                            <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
                                Klippie
                            </span>
                        )}
                    </div>
                </Link>

                <div className='pt-6'>
                    <Link to="/dashboard">
                        <button
                            className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        mt-2 ${location.pathname === "/dashboard" && 'bg-gray-200 dark:bg-gray-700'}`}
                        >
                            <span className='text-2xl'><AiOutlinePlus /></span>
                            <span className={`${!open && 'hidden'} origin-left duration-300 hover:block`}>
                                Add New Video/Audio
                            </span>
                        </button>
                    </Link>
                </div>

                <div className={`pt-6 bottom-0 left-0 right-0 overscroll-auto overflow-auto h-auto max-h-[100%] w-auto text-md leading-tight scrollbar scrollbar-thumb-blue-300 scrollbar-track-blue-100 dark:scrollbar-thumb-blue-500 dark:scrollbar-track-gray-800 scrollbar-thin ${!open && 'hidden'}`}>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    <p className='width-content'>lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                    </div>
                            
                <div className={`pt-6 fixed bottom-0 left-0 right-0`}>
                    <div className=" flex flex-col gap-2 pb-5">
                        <Link to="/dashboard">
                            <button
                                className={`flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700
                        mt-2 ${location.pathname === "/dashboard" && 'bg-gray-200 dark:bg-gray-700'}`}
                            >
                                <span className='text-2xl'><AiOutlinePlus /></span>
                                <span className={`${!open && 'hidden'} origin-left duration-300 hover:block`}>
                                    Add New Video/Audio
                                </span>
                            </button>
                        </Link>
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
