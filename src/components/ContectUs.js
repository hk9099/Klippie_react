import React, { useState } from "react";
import { useUserNickname } from "./userNicknameContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { TokenManager } from '../components/getToken.js';

export default function ContactUs({ isOpen, onClose }) {
    const userToken = TokenManager.getToken();
    const { userName, userEmail } = useUserNickname();
    const [message, setMessage] = useState("");
    
    const handleSubmit = () => async () =>{
        let data = JSON.stringify({
            "name": userName,
            "email": userEmail,
            "message": message
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: '/v1/auth/contact',
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + userToken
            },
            data: data
        };

        const response = await axios.request(config)
        console.log(response.data);
        onClose()
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute w-full h-full bg-black opacity-50 blur-xl" onClick={onClose}   ></div>
            <div className="bg-gray-800 w-full max-w-md p-6 rounded-lg shadow-lg z-40">

                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                    <RxCross2 className="text-2xl text-white cursor-pointer" onClick={onClose} />
                   </div>
                <form>
                    <div className="mb-4">
                        <label htmlFor="name" className="block text-gray-300 font-bold mb-2">Name:</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={userName}
                            readOnly
                            className="border border-gray-300 bg-gray-700 text-white rounded-md px-3 py-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-300 font-bold mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={userEmail}
                            readOnly
                            className="border border-gray-300 bg-gray-700 text-white rounded-md px-3 py-2 w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="message" className="block text-gray-300 font-bold mb-2">Message:</label>
                        <textarea
                            id="message"
                            name="message"
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="border border-gray-300 bg-gray-700 text-white rounded-md px-3 py-2 w-full h-40 resize-none"
                        />
                    </div>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className=" text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white w-full"
                    >
                        Submit
                    </button>
                </form>
            </div>
        </div>
    );
}
