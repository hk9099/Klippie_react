import React, { useEffect, useState } from 'react';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Tooltip} from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'
import { RiInformationLine } from 'react-icons/ri';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { auth } from './config.js';
import backgroundimage from '../assets/images/round.png';
import googleicon from '../assets/images/google.png';
import '../assets/css/signin.css';
import Loader from './Loader.js';
import axios from 'axios';
import bannerRight from '../assets/images/banner-right-pic.avif';
import Hiiii from '../assets/images/hi_40x40.gif';
import {HiOutlineMail} from 'react-icons/hi';

function Signin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);


    useEffect(() => {
        const encodedEmail = localStorage.getItem('_auth');
        if (encodedEmail) {
            setIsLoading(true);
            // const email = atob(encodedEmail); // Decode email
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleGoogleLogin = () => {
        const customProvider = new GoogleAuthProvider();
        customProvider.setCustomParameters({ prompt: 'select_account' });

        signInWithPopup(auth, customProvider)
            .then((result) => {
                console.log(result.user, 'result');
                // setToken(result.user);
                const userGoogle = {
                    googleToken: result.user.accessToken,
                    googleId: result.user.uid,
                    googleName: result.user.displayName,
                    googleEmail: result.user.email,
                    googleImage: result.user.photoURL,
                };

                const encodedUser = btoa(JSON.stringify(userGoogle));
                console.log(encodedUser, 'encodedUser');
                localStorage.setItem('_auth', encodedUser);
                navigate('/dashboard');
            })
            .catch((error) => {
                // console.log(error.message);
                toast.error(error.message, {
                    position: toast.POSITION.TOP_CENTER
                });
            });
    };

    const initialValues = {
        email: '',
        password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Required').max(50, 'Email is too long - should be 50 chars maximum.').matches(/^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/, 'Invalid email address').lowercase(),
        password: Yup.string().required('Required').min(8, 'Password is too short - should be 8 chars minimum.').matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character',
        ),
    });

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        try {
            const response = await axios.post('https://api.getklippie.com/v1/auth/login', {
                email: values.email,
                password: values.password,
                is_social: false,
                firebase_id: 'string',
                id_token: 'string',
                device_id: 'string'
            });
            // console.log(response.data.token.access_token);
            const encodedUser = btoa(JSON.stringify(response.data));
            localStorage.setItem('_sodfhgiuhih', encodedUser);
            const encodedEmail = btoa(values.email); 
            localStorage.setItem('_auth', encodedEmail);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
            if (error.response && error.response.data && error.response.data.error) {
                const errorMessage = error.response.data.error;
                toast.error(errorMessage, {
                    position: toast.POSITION.TOP_CENTER
                });
            } else {
                toast.error(error.response.data.detail, {
                    position: toast.POSITION.TOP_CENTER
                });
            }
        }
        setIsLoading(false);
        setSubmitting(false);
    };

    return (
        <main>
            {isLoading && <Loader />}

            <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
                <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                    <div className="left_heading text-center">
                        <h1 className="text-4xl font-bold text-gray-800">
                            Welcome to <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent mr-3">Klippie</span><img src={Hiiii} alt="Hiiii" style={ { width: '40px', height: '40px' ,display : 'inline-block' } } />
                        </h1>
                        <p className="text-gray-500">Please Login to your account.</p>
                    </div>
                    <div className="mt-10 form_layout">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ errors, touched }) => (
                                <Form className="flex flex-col justify-center items-center">
                                    <div className="emailinput form_layout mb-10">
                                        <label className="text-gray-500 emailinput">Enter your email</label>
                                        <div className="inputbox-container">
                                            <Field
                                                type="text"
                                                name="email"
                                                placeholder="Email"
                                                className={`inputbox`}
                                            />
                                            <span className="email-icon"><HiOutlineMail /></span>
                                        </div>
                                        <ErrorMessage name="email" component="div" className="error-message mt-2" />
                                    </div>
                                    <div className="passwordinput form_layout">
                                        <label className="text-gray-500 mt-2">Enter your password <RiInformationLine data-tooltip-id='password-tooltip' className="password-tooltip" /></label>
                                       
                                        <Tooltip id="password-tooltip" content="Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character" className="custom-tooltip" />
                                        <div className="inputbox-container">
                                            <Field
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                                className={`inputbox`}
                                            />
                                            <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
                                                {showPassword ? < BsEyeFill /> : < BsEyeSlashFill />}
                                            </span>
                                        </div>
                                    </div>

                                    <p className="create_acp">
                                        {errors.password && (
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="error-message mt-2"
                                                value={errors.password}
                                            />
                                        )}
                                        {!errors.password && (
                                            <div className="default-error-message mt-2">
                                                
                                            </div>
                                        )}
                                        <Link to="/forgotpassword" className="create_ac">
                                            Forgot Password?
                                        </Link>
                                    </p>
                                    <button
                                        type="submit"
                                        className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Sign in
                                    </button>
                                </Form>
                            )}
                        </Formik>

                            <p className="mt-3 text-center">
                                <Link to="/signup" className="create_ac">
                                    Create New Account
                                </Link>
                            </p>
                        <div title="OR" className="or_block">
                            <div className="line"></div>
                            <p>OR</p>
                        </div>
                        <button
                            title="Login with google"
                            className="Signup_with_thirdparty_btn"
                            onClick={handleGoogleLogin}
                        >
                            <div className="icon">
                                <img src={googleicon} alt="google" />
                            </div>
                            <div>Sign in with Google</div>
                        </button>
                    </div>
                </div>

                <div className="hidden sm:block right_block">
                    <img src={backgroundimage} alt="backgroundimage" className="h-screen w-full object-cover backgroundimage" />
                    <div className="text-overlay">
                        <img src={bannerRight} alt="logo" className="logo" style={{ width: '90%',display:'inline-block' }} />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
}

export default Signin;
