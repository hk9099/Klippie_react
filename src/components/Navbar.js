import React, { useState } from 'react'
import Toggle from './ThemeToggle'
import { Link, useLocation } from 'react-router-dom'
import { AiOutlineShareAlt } from 'react-icons/ai'

const Navbar = () => {
    const [open] = useState(true)
    const location = useLocation()

    return (
        <nav className='bg-white border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-[#0D0E20] sticky top-0 z-20 dashborardbg'>
            <div className=' flex justify-between items-center mx-auto pt-3'>
                <div className='flex items-center mx-auto'>
                    {/* <span className='text-xl font-medium whitespace-nowrap dark:text-white'>
                        Welcome
                    </span> */}
                </div>
                <div className='flex justify-end pr-4'>
                    <Link to="/dashboard">
                        <p className={`flex items-center gap-x-2 p-3 px-4 text-base font-normal rounded-full dark:bg-gray-700 bg-gray-200 cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 
                        ${location.pathname === "/dashboard" && ''}`}
                        >
                            <span className='text-2xl'><AiOutlineShareAlt /></span>
                            <span className={`${!open && 'hidden'} origin-left duration-300 hover:block text-sm`}>
                                Share
                            </span>
                        </p>
                    </Link>
                    <Toggle />
                </div>
            </div>
        </nav>
    )
}

export default Navbar