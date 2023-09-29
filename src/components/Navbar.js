import React, { useState } from 'react'
// import Toggle from './ThemeToggle'
//eslint-disable-next-line
import { Link, useLocation } from 'react-router-dom'
import { BsStopwatch } from 'react-icons/bs'

const Navbar = () => {
    //eslint-disable-next-line
    const [open] = useState(true)
    //eslint-disable-next-line
    const location = useLocation()

    return (
        <>
        <nav className=' border-gray-200 mx-2 px-2 py-2.5 rounded dark:bg-transparent h-[90px] sticky top-0 z-20 '>
            <div className=' flex justify-end items-center mx-auto'>
                    <div className="flex justify-end items-center w-100">
                        <div className="text-green-600  px-3 py-2 font-bold text-lg flex justify-center items-center m-3 ">
                            <BsStopwatch className='mr-2'/> 2h 00m
                        </div>
                        <button className="text-gray-300 text-center  inline-block px-3 py-2 font-bold text-lg dark:bg-[#ffffff3a] m-3 rounded-lg">
                            Add More Credit
                        </button>
                    </div>
            </div>
            </nav>
        </>
    )
}

export default Navbar