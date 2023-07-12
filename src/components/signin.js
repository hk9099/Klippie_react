import React, { useEffect, useState } from 'react';
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

function Signin() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

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
                console.log(result.user);
                const encodedEmail = btoa(result.user.email); 
                localStorage.setItem('_auth', encodedEmail);
                navigate('/dashboard');
            })
            .catch((error) => {
                console.log(error.message);
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
            console.log(response.data);
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
                            Welcome to <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">Klippie</span>&#128075;
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
                                        <label className="text-gray-500">Enter your email</label>
                                        <Field
                                            type="text"
                                            name="email"
                                            placeholder="Email"
                                            className={`px-2 py-1 focus:outline-none bg-transparent ${errors.email && touched.email ? 'border-red-500' : ''
                                                }`}
                                        />
                                        <ErrorMessage name="email" component="div" className="text-red-500 mt-2" />
                                    </div>
                                    <div className="passwordinput form_layout">
                                        <label className="text-gray-500 mt-2">Enter your password</label>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="Password"
                                            className={`px-2 py-1 focus:outline-none bg-transparent ${errors.password && touched.password ? 'border-red-500' : ''
                                                }`}
                                        />
                                        <ErrorMessage name="password" component="div" className="text-red-500" />
                                    </div>

                                    <button
                                        type="submit"
                                        className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                    >
                                        Sign in
                                    </button>
                                </Form>
                            )}
                        </Formik>

                        <div className="flex flex-row justify-between items-center mt-2">
                            <p className="create_acp">
                                <Link to="/signup" className="create_ac">
                                    Create New Account
                                </Link>
                            </p>
                            <p className="create_acp">
                                <Link to="/forgotpassword" className="create_ac">
                                    Forgot Password?
                                </Link>
                            </p>
                        </div>
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
                    <img src={backgroundimage} alt="backgroundimage" className="h-screen w-full object-cover" />
                    <div className="text-overlay">
                        <h1>Hello, World!</h1>
                        <p>This is some sample text.</p>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
}

export default Signin;
