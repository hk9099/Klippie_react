import React, { useState , useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import backgroundimage from '../assets/images/round.png';
import googleicon from '../assets/images/google.png';
import '../assets/css/signup.css';

function Signup() {
    const navigate = useNavigate();
    // eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);
    
    const initialValues = {
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    };

    useEffect(() => {
        const encodedEmail = localStorage.getItem('_auth');
        if (encodedEmail) {
            setIsLoading(true);
            // const email = atob(encodedEmail); // Decode email
            navigate('/dashboard');
        }
    }, [navigate]);


    const validationSchema = Yup.object({
        name: Yup.string()
            .required('Name is required')
            .max(50, 'Name is too long - should be 50 chars maximum.'),
        email: Yup.string()
            .email('Invalid email address')
            .required('Email is required')
            .max(50, 'Email is too long - should be 50 chars maximum.')
            .matches(
                /^[a-zA-Z0-9]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
                'Invalid email address'
            )
            .lowercase(),
        password: Yup.string()
            .required('Password is required')
            .min(8, 'Password is too short - should be 8 chars minimum.')
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
                'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character'
            ),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = (values, { setSubmitting }) => {
        setLoading(true);
        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            confirmPassword: values.confirmPassword,
        };
        axios
            .post('https://api.getklippie.com/v1/auth/signup', payload)
            .then(response => {
                var signupToken = response.data.data;
                console.log(signupToken);   
                localStorage.setItem('signupToken', signupToken); 
                navigate('/otpVarification'); 
            })
            .catch(error => {
                // Handle registration error
                console.log(error);
            })
            .finally(() => {
                setLoading(false);
                setSubmitting(false);
            });
    };


    return (
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
                    <p className="text-gray-500">Sign up for your new Account</p>
                </div>
                <div className="mt-10 form_layout">
                    <Formik
                        initialValues={initialValues}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ isSubmitting }) => (
                            <Form className="flex flex-col justify-center items-center">
                                <div className="nameinput form_layout mb-10">
                                    <label className="text-gray-500">Enter your name</label>
                                    <Field
                                        type="text"
                                        name="name"
                                        placeholder="Name"
                                        className="px-2 py-1 focus:outline-none"
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
                                            e.target.placeholder = 'Name';
                                        }}
                                    />
                                    <ErrorMessage name="name" component="div" className="text-red-500 mt-2" />
                                </div>
                                <div className="emailinput form_layout  mb-10">
                                    <label className="text-gray-500">Enter your email</label>
                                    <Field
                                        type="text"
                                        name="email"
                                        placeholder="Email"
                                        className="px-2 py-1 focus:outline-none "
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
                                            e.target.placeholder = 'Email';
                                        }}
                                    />
                                    <ErrorMessage name="email" component="div" className="text-red-500 mt-2" />
                                </div>
                                <div className="passwordinput form_layout">
                                    <label className="text-gray-500 mt-2">Enter your password</label>
                                    <Field
                                        type="password"
                                        name="password"
                                        placeholder="Password"
                                        className="px-2 py-1 focus:outline-none mt-2"
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
                                            e.target.placeholder = 'Password';
                                        }}
                                    />
                                    <ErrorMessage
                                        name="password"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <div className="passwordinput form_layout mt-10">
                                    <label className="text-gray-500 mt-2">
                                        Enter your Confirm password
                                    </label>
                                    <Field
                                        type="password"
                                        name="confirmPassword"
                                        placeholder="Confirm Password"
                                        className="px-2 py-1 focus:outline-none mt-2"
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
                                            e.target.placeholder = 'Confirm Password';
                                        }}
                                    />
                                    <ErrorMessage
                                        name="confirmPassword"
                                        component="div"
                                        className="text-red-500"
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                    disabled={isSubmitting || loading}
                                >
                                    {loading ? 'Signing Up...' : 'Sign Up'}
                                </button>
                            </Form>
                        )}
                    </Formik>

                    <div className="flex flex-col justify-center items-center mt-2">
                        <p className="create_acp">
                            Already have an account?
                            <Link to="/" className="create_ac">
                                Login
                            </Link>
                        </p>
                    </div>
                    <div title="OR" className="or_block">
                        <div className="line"></div>
                        <p>OR</p>
                    </div>
                    <button title="Login with google" className="Signup_with_thirdparty_btn">
                        <div className="icon">
                            <img src={googleicon} alt="google" />
                        </div>
                        <p>Login with Google</p>
                    </button>
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
    );
}

export default Signup;
