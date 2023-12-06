import React from 'react';
import { Link } from 'react-router-dom'; // Import Link if you're using React 

const NotFoundPage = () => {
  return (
    <div className="bg-gradient-to-r from-[#595282] to-[#595282]-200 select-none min-h-screen flex items-center justify-center">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl  border-2 border-opacity-20 shadow-lg sm:rounded-lg p-8  px-[150px]">
        <div className="text-center font-nunito">
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
          <h1 className="text-6xl text-white font-medium mb-6">Oops! Page not found</h1>
          <p className="text-lg text-white mb-8">
            Oops! The page you are looking for does not exist.
          </p>
          <button className="bg-gradient-to-r from-purple-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white font-semibold px-6 py-3 rounded-md mr-4">
            <Link to="/dashboard" className="text-white font-semibold">
              BACK TO HOME
            </Link>
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
