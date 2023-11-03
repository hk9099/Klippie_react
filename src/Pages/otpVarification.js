import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import '../assets/css/signin.css';
import Loader from './Loader.js';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { FaMobileAlt } from 'react-icons/fa';
import { useClipsFoundStatus } from '../context/ClipsFoundContext.js';


function Signin() {
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(30);
    const [attempts, setAttempts] = useState(0);
    const [showResendButton, setShowResendButton] = useState(true);
    const [resendButtonLoading, setResendButtonLoading] = useState(false);
    const { setClipsFoundStatus } = useClipsFoundStatus();

    useEffect(() => {
        const encodedEmail = localStorage.getItem('_auth');
        console.log(encodedEmail, 'encodedEmail');
        if (encodedEmail) {
            setIsLoading(true);
            // const email = atob(encodedEmail); // Decode email
            navigate('/dashboard');
            // setClipsFoundStatus(false);
        }
    }, [navigate , setClipsFoundStatus]);

    useEffect(() => {
        const email = localStorage.getItem('email');
        const resendCount = parseInt(localStorage.getItem('resendCount') || '0');
        if (resendCount >= 3) {
            setAttempts(3);
            setShowResendButton(false);
        } else {
            setAttempts(resendCount);
            startResendTimer();
        }

        if (email) {
            setIsLoading(true);
            navigate('/signin');
        }
    }, [navigate]);

    const startResendTimer = () => {
        setShowResendButton(false);
        const startTime = Date.now();
        const intervalId = setInterval(() => {
            const currentTime = Date.now();
            const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
            const remainingSeconds = Math.max(30 - elapsedSeconds, 0);
            setResendTimer(remainingSeconds);
            if (remainingSeconds === 0) {
                clearInterval(intervalId);
                setShowResendButton(true);
            }
        }, 1000);
    };

    const initialValues = {
        otp: '',
    };

    const validationSchema = Yup.object({
        otp: Yup.string()
            .required('Uniqe Code is required')
            .max(6, 'Uniqe Code must be 6 characters')
            .matches(/^[0-9]+$/, 'Must be only digits'),
    });

    const handleSubmit = (values, { setSubmitting }) => {
        setIsLoading(true);
        const payload = {
            token: localStorage.getItem('signupToken'),
            otp: values.otp,
        };
        localStorage.removeItem('signupToken');
        axios
            .post('https://dev-api.getklippie.com/v1/auth/verify-otp', payload)
            .then((response) => {
                enqueueSnackbar('Code verified successfully', { variant: 'success', autoHideDuration: 1500 });
                console.log(response.data);
                navigate('/');
            })
            .catch((error) => {
                enqueueSnackbar('Invalid Code', { variant: 'error', autoHideDuration: 1500 });
                setAttempts((prevAttempts) => prevAttempts + 1);
                if (attempts + 1 >= 3) {
                    setShowResendButton(false);
                    navigate('/');
                }
            })
            .finally(() => {
                setIsLoading(false);
                setSubmitting(false);
            });
    };

    // const handleResendOTP = () => {
    //     if (resendButtonLoading) return; // Prevent multiple resends while loading
    //     setResendButtonLoading(true);
    //     localStorage.setItem('resendClicked', 'true');
    //     var getemail = localStorage.getItem('_authemail');
    //     console.log(getemail, 'getemail');
    //     const data = JSON.stringify({
    //         email: getemail,
    //     });

    //     const config = {
    //         method: 'post',
    //         maxBodyLength: Infinity,
    //         url: 'https://dev-api.getklippie.com/v1/auth/signup-resend-otp',
    //         headers: {
    //             accept: 'application/json',
    //             'Content-Type': 'application/json',
    //         },
    //         data: data,
    //     };

    //     axios
    //         .request(config)
    //         .then((response) => {
    //             console.log(JSON.stringify(response.data));
    //             setResendButtonLoading(false);
    //             startResendTimer();
    //             toast.success('OTP sent successfully');
    //         })
    //         .catch((error) => {
    //             toast.error('Too many attempts. Please try again later.');
    //             console.log(error);
    //             setResendButtonLoading(false);
    //         });
    // };

    const handleResendOTP = () => {
        if (attempts >= 3) {
            // Maximum attempts reached, do nothing
            return;
        }

        if (resendButtonLoading) return;
        setResendButtonLoading(true);
        var getemail = atob(localStorage.getItem('_authemail'));
        console.log(getemail, 'getemail');
        const data = JSON.stringify({
            email: getemail,
        });

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev-api.getklippie.com/v1/auth/signup-resend-otp',
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
                if (attempts < 2) {
                    startResendTimer();
                } else {
                    setShowResendButton(false);
                }
                enqueueSnackbar('New Code sent successfully', { variant: 'success', autoHideDuration: 1500 });

                // Update resendCount in localStorage
                const updatedResendCount = attempts + 1;
                localStorage.setItem('resendCount', updatedResendCount.toString());
                setAttempts(updatedResendCount); // Update attempts state
            })
            .catch((error) => {
                enqueueSnackbar('Too many attempts. Please try again later.', {
                    variant: 'error',
                    autoHideDuration: 1500,
                });
                setResendButtonLoading(false);
            });
    };

    return (
        <main>
            {isLoading && <Loader />}

            <div className="h-full w-full">
                <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                    <div className="left_heading text-center">
                        <h1 className="text-4xl font-bold text-gray-200">
                            Welcome to{' '}
                            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                                Klippie
                            </span>
                            &#128075;
                        </h1>
                        <p className="text-gray-500 mt-2">Please Enter The Unique Code That We Sent To Your Email</p>
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
                                        <div className="inputbox-container">
                                            <Field
                                                type="text"
                                                name="otp"
                                                placeholder="Enter Code"
                                                className={`inputbox`}
                                            />
                                            <span className="email-icon">
                                                <FaMobileAlt />
                                            </span>
                                        </div>
                                        <ErrorMessage
                                            name="otp"
                                            component="div"
                                            className="error-message mt-2"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Verify Code
                                    </button>

                                    {attempts >= 3 ? (
                                        <div className="resend-timer mt-3">
                                            <p>
                                                Maximum attempts reached. Please{' '}
                                                <Link to="/signup" className="create_ac ml-1">
                                                    sign up
                                                </Link>
                                                .
                                            </p>
                                        </div>
                                    ) : (
                                        <>
                                            {showResendButton ? (
                                                <button
                                                    type="button"
                                                    disabled={isSubmitting || resendButtonLoading}
                                                    onClick={handleResendOTP}
                                                    className="resendbutton mt-4 bg-gray-500 text-white font-bold py-2 px-4 rounded-full"
                                                >
                                                    {resendButtonLoading ? 'Loading...' : 'Resend Code'}
                                                </button>
                                            ) : (
                                                <div className="resend-timer mt-3">
                                                    Resend Code in {resendTimer} seconds
                                                </div>
                                            )}
                                        </>
                                    )}

                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Signin;