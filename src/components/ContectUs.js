import React, { useState } from "react";
import { useUserNickname } from "../context/userNicknameContext";
import { RxCross2 } from "react-icons/rx";
import axios from "axios";
import { TokenManager } from '../components/getToken.js';
import { FaCheckCircle } from "react-icons/fa";

export default function ContactUs({ isOpen, onClose }) {
    const userToken = TokenManager.getToken()[1]
    const { userName, userEmail } = useUserNickname();
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({ name: '', email: '', message: '' });

    const validateForm = () => {
        const newErrors = {};

        if (!userName) {
            newErrors.name = "Name is required";
        }

        if (!userEmail) {
            newErrors.email = "Email is required";
        } else if (!/^\S+@\S+\.\S+$/.test(userEmail)) {
            newErrors.email = "Invalid email format";
        }

        if (!message) {
            newErrors.message = "Message is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            let data = JSON.stringify({
                "name": userName,
                "email": userEmail,
                "message": message
            });

            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${process.env.REACT_APP_DEV_HOSTING_URL}/v1/auth/contact`,
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + userToken
                },
                data: data
            };

            await axios.request(config);
            setSuccess(true);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`fixed inset-0 flex justify-center items-center z-50 ${isOpen ? 'block' : 'hidden'}`}>
            <div className="absolute w-full h-full inset-0 backdrop-blur-md bg-black bg-opacity-60" onClick={onClose}></div>
            <div className="bg-gray-800 w-full max-w-md p-6 rounded-3xl border shadow-lg z-40 border-gray-700">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-white">Contact Us</h2>
                    <RxCross2 className="text-2xl text-white cursor-pointer" onClick={onClose} />
                </div>
                {success ? (
                    <div className="success-message">
                        <FaCheckCircle size={80} color="#2ecc71" className="success-icon" />
                        <p className="text-white">Your request has been successfully submitted. We'll get back to you shortly.</p>
                    </div>
                ) : (
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
                            <span className="text-red-500">{errors.name}</span>
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
                            <span className="text-red-500">{errors.email}</span>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="message" className="block text-gray-300 font-bold mb-2">Message:</label>
                            <textarea
                                id="message"
                                name="message"
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                className={`border border-gray-300 bg-gray-700 text-white rounded-md px-3 py-2 w-full h-40 resize-none ${errors.message ? 'border-red-500' : ''}`}
                            />
                            <span className="text-red-500">{errors.message}</span>
                        </div>
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className="text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white w-full"
                            disabled={loading}
                        >
                            {loading ? "Submitting..." : "Submit"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
