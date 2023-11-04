import React from 'react';
import SuggetionImage from '../assets/images/suggetion.png';

function Suggetionpopup({ isOpen, onClose }) {
    return (
        <div className={`max-w-2xl mx-auto ${isOpen ? 'block' : 'hidden'}`}>
            <div
                id="default-modal"
                data-modal-show="true"
                aria-hidden="true"
                className="fixed h-screen top-0 left-0 right-0 flex justify-center items-center z-50"
            >
                      <div className="absolute w-full h-full inset-0 backdrop-blur-md bg-black bg-opacity-60" onClick={onClose}   ></div>

          <div className="relative w-auto max-w-2xl mx-auto px-4">
            <div className="bg-white rounded-lg relative dark:bg-[#1d2e61] ">
              <button
                type="button"
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white absolute top-2 right-2"
                onClick={onClose}
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </button>
              <div className="p-6 space-y-6 flex justify-center items-center flex-col select-none	cursor-help">
                <img src={SuggetionImage} alt="Suggetion" width={150} height={150} className='select-none	' />

                <div className="flex flex-col items-start">
                  <ul className="text-gray-500 text-start leading-relaxed dark:text-white">
                    <li className='font-bold text-lg'>
                      🕵️‍♂️ Klippie is finding your clips
                    </li>
                    <li className='font-bold text-lg'>
                      ⏳ This may take up to 15 minutes
                    </li>
                    <li className='font-bold text-lg'>
                      📧 We will email you when it's complete
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
            </div>
        </div>
    );
}

export default Suggetionpopup;

