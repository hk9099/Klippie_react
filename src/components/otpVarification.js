import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import backgroundimage from '../assets/images/round.png';
import '../assets/css/signin.css';
import Loader from './Loader.js';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Signin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [attempts, setAttempts] = useState(0);
    const [showResendButton, setShowResendButton] = useState(true);
    const [resendButtonLoading, setResendButtonLoading] = useState(false);

    useEffect(() => {
        const encodedEmail = localStorage.getItem('_auth');
        if (encodedEmail) {
            setIsLoading(true);
            // const email = atob(encodedEmail); // Decode email
            navigate('/dashboard');
        }
    }, [navigate]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        if (email) {
            setIsLoading(true);
            navigate('/signin');
        } else {
            startResendTimer();
        }
    }, [navigate]);

    const startResendTimer = () => {
        setShowResendButton(false);
        setResendTimer(30);
        const intervalId = setInterval(() => {
            setResendTimer((prevTimer) => {
                if (prevTimer === 1) {
                    clearInterval(intervalId);
                    setShowResendButton(true);
                }
                return prevTimer - 1;
            });
        }, 1000); // Set the interval to 1 second (1000 milliseconds)
    };

    const initialValues = {
        otp: '',
    };

    const validationSchema = Yup.object({
        otp: Yup.string()
            .required('OTP is required')
            .max(6, 'OTP must be 6 characters')
            .matches(/^[0-9]+$/, 'Must be only digits'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        setIsLoading(true);
        const payload = {
            token: localStorage.getItem('signupToken'),
            otp: values.otp,
            type: 'fp',
        };
        localStorage.removeItem('signupToken');
        axios
            .post('https://api.getklippie.com/v1/auth/verify-otp', payload)
            .then((response) => {
                // Handle successful verification
                toast.success('OTP verified successfully');
                console.log(response.data);
                navigate('/signin');
            })
            .catch((error) => {
                toast.error(error.message);
                setAttempts((prevAttempts) => prevAttempts + 1);
                if (attempts + 1 >= 3) {
                    setShowResendButton(false);
                    navigate('/signup');
                }
            })
            .finally(() => {
                setIsLoading(false);
                setSubmitting(false);
            });
    };

    const handleResendOTP = () => {
        if (resendButtonLoading) return; // Prevent multiple resends while loading
        setResendButtonLoading(true);
        const data = JSON.stringify({
            email: 'akshit@getklippie.com',
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://api.getklippie.com/v1/auth/signup-resend-otp',
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: data,
        };

        axios
            .request(config)
            .then((response) => {
                console.log(JSON.stringify(response.data));
                setResendButtonLoading(false);
                startResendTimer();
                toast.success('OTP sent successfully');
            })
            .catch((error) => {
                toast.error('Too many attempts. Please try again later.');
                console.log(error);
                setResendButtonLoading(false);
            });
    };

    return (
        <main>
            <ToastContainer />
            {isLoading && <Loader />}

            <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
                <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                    <div className="left_heading text-center">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                                Klippie
                            </span>
                            &#128075;
                        </h1>
                        <p className="text-gray-500">Please Enter your OTP</p>
                    </div>
                    <div className="mt-10 form_layout">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="flex flex-col justify-center items-center">
                                    <div className="emailinput form_layout mb-3  ">
                                        <label className="text-gray-500">OTP</label>
                                        <Field
                                            type="text"
                                            name="otp"
                                            placeholder="Enter OTP"
                                            className="px-2 py-3 focus:outline-none bg-transparent"
                                            onMouseEnter={(e) => {
                                                e.target.style.borderBottomColor = 'blue';
                                                e.target.previousSibling.style.color = 'blue';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.target.style.borderBottomColor = 'gray';
                                                e.target.previousSibling.style.color = 'gray';
                                            }}
                                            onFocus={(e) => {
                                                e.target.placeholder = '';
                                            }}
                                            onBlur={(e) => {
                                                e.target.placeholder = 'Enter OTP';
                                            }}
                                        />
                                        <ErrorMessage name="otp" component="div" className="text-red-500" />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Verify OTP
                                    </button>

                                    {showResendButton && attempts < 3 ? (
                                        <button
                                            type="button"
                                            disabled={isSubmitting || resendButtonLoading}
                                            onClick={handleResendOTP}
                                            className="resendbutton mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            {resendButtonLoading ? 'Loading...' : 'Resend OTP'}
                                        </button>
                                    ) : (
                                        <div className="resend-timer mt-3">
                                            Resend OTP in {resendTimer} seconds
                                        </div>
                                    )}

                                    {attempts >= 3 && (
                                        <p className="text-red-500 mt-4">Maximum attempts exceeded. Please sign up.</p>
                                    )}
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>

                <div className="hidden sm:block right_block ">
                    <img src={backgroundimage} alt="backgroundimage" className="h-screen w-full object-cover" />
                    <div className="text-overlay">
                        <h1>Hello, World!</h1>
                        <p>This is some sample text.</p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Signin;
