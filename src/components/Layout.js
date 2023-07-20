import React from 'react'

const Layout = ({ children }) => {
    return (
        <>
            <div className='flex flex-auto h-screen'>
                {/* <Sidebar /> */}
                <div className='grow'>
                    {/* <Navbar /> */}
                    <div className=''>{children}</div>
                </div>
            </div>
        </>
    )
}

export default Layout