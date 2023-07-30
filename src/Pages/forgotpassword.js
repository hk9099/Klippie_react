import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import backgroundimage from '../assets/images/round.png';
import '../assets/css/signin.css';
import axios from 'axios';
import { HiOutlineMail } from 'react-icons/hi';
import { RiInformationLine } from 'react-icons/ri';
import { TbDeviceMobileMessage } from 'react-icons/tb';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import bannerRight from '../assets/images/banner-right-pic.avif';
import think from '../assets/images/think_40x40.gif';



const MultiStepForm = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [emailSent, setEmailSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // eslint-disable-next-line no-unused-vars
    const [success, setSuccess] = useState(null);
    const [emailToken, setEmailToken] = useState(null);
    const inputRef = useRef();
    const [emailLoading, setEmailLoading] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setEmailLoading(true);


        try {
            const response = await axios.post(
                'https://api.getklippie.com/v1/auth/forgot-password-send-otp',
                {
                    email: formData.email,
                }
            );
            const emailtoken = response.data.data;
            setEmailSent(true);
            setLoading(false);
            setStep(2);
            setEmailToken(emailtoken);
            showToast('Email sent successfully!');
        } catch (error) {
            var err = error.response.data.detail;
            setLoading(false);
            setError('Failed to send email. Please try again.');
            showToast(err);
        } finally {
            setEmailLoading(false);
        }
    };

    const handleOtpVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOtpLoading(true);
        try {
            const response = await axios.post(
                'https://api.getklippie.com/v1/auth/verify-otp',
                {
                    token: emailToken,
                    otp: formData.otp,
                    type: 'fp',
                }
            );
            console.log(JSON.stringify(response.data));
            setOtpVerified(true);
            setLoading(false);
            setStep(3);
            showToast('OTP verification successful!');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('OTP verification failed. Please try again.');
            showToast('OTP verification failed. Please try again.');
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordLoading(true);
        try {
            const response = await axios.post(
                'https://api.getklippie.com/v1/auth/reset-forgot-password',
                {
                    token: emailToken,
                    new_password: formData.password,
                }
            );
            console.log(JSON.stringify(response.data));
            setLoading(false);
            setSuccess('Password reset successful!');
            showToast('Password reset successful!');
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError('Failed to reset password. Please try again.');
            showToast('Failed to reset password. Please try again.');
        } finally {
            setPasswordLoading(false);
        }
        
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const initialValues = {
        email: '',
        password: '',
        token: '',
        otp: '',
        confirm_password: '',
    };

    const validationSchema = Yup.object({
        email: Yup.string().email('Invalid email address').required('Email is required'),
        otp: Yup.string().required('OTP is required'),
        password: Yup.string().required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    const showToast = (message) => {
        toast(message, { position: toast.POSITION.TOP_CENTER });
    };

  

    return (
        <main>
            <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
                <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                    <div className="left_heading text-center">
                        <h1 className="text-4xl font-bold text-gray-800 flext items-center">
                           Forgot {'  '}
                            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                                Password
                            </span>
                                <img src={think} alt="think" className="inline-block ml-2" />
                        </h1>
                        <p className="text-gray-500">Please Login to your account.</p>
                    </div>
                    <div className="mt-10 form_layout">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={() => { }}
                        >
                            <Form className="flex flex-col justify-center items-center">
                                {step === 1 && (
                                    <div>
                                        <div className="emailinput form_layout mb-5">
                                            <label className="text-gray-500 emailinput">
                                                Enter your email
                                            </label>
                                            <div className="inputbox-container">
                                                <Field
                                                    type="text"
                                                    name="email"
                                                    placeholder="Email"
                                                    className={`inputbox`}
                                                    onChange={handleChange}
                                                    value={formData.email || ''}
                                                />
                                                <span className="email-icon">
                                                    <HiOutlineMail />
                                                </span>
                                            </div>
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="error-message mt-2"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!formData.email || emailLoading}
                                            className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                            onClick={(e) => {
                                                handleEmailSubmit(e);
                                            }}
                                        >
                                            {emailLoading ? 'Sending Email...' : 'Send OTP'}
                                        </button>
                                    </div>
                                )}

                                {step === 2 && emailSent && (
                                    <div className="emailinput form_layout mb-10">
                                        <p className="text-gray-500 mt-3 font-medium">
                                            {' '}
                                            we have sent an OTP to your <span className="font-extrabold text-[#917bea]">{formData.email}</span>{' '}
                                            email address
                                        </p>
                                        {/* <h1 className="text-2xl font-bold text-gray-800 text-center">Step 2</h1> */}
                                        <div className="emailinput form_layout mb-5 mt-5">
                                            <label className="text-gray-500 emailinput">
                                                Enter OTP
                                            </label>
                                            <div className="inputbox-container">
                                                <Field
                                                    type="text"
                                                    name="otp"
                                                    placeholder="OTP"
                                                    onChange={handleChange}
                                                    value={formData.otp || ''}
                                                    className={`inputbox`}
                                                />
                                                <span className="email-icon">
                                                    <TbDeviceMobileMessage />
                                                </span>
                                                
                                            </div>
                                            <ErrorMessage
                                                name="email"
                                                component="div"
                                                className="error-message mt-2"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!formData.otp || otpLoading}
                                            onClick={handleOtpVerifySubmit}
                                            className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            {otpLoading ? 'Verifying OTP...' : 'Verify OTP'}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            Previous
                                        </button>
                                    </div>
                                )}

                                {step === 3 && otpVerified && (
                                    <div className="emailinput form_layout mb-10">
                                        {/* <h1 className="text-2xl font-bold text-gray-800 text-center">Step 3</h1> */}
                                        <label className="text-gray-500 mt-4">Enter your new password</label>
                                        <Field
                                            type="password"
                                            name="password"
                                            placeholder="New Password"
                                            className={`px-2 py-1 focus:outline-none bg-transparent ${error && error.password ? 'border-red-500' : ''
                                                }`}
                                            onChange={handleChange}
                                            value={formData.password || ''}
                                        />
                                        <ErrorMessage
                                            name="password"
                                            component="div"
                                            className="text-red-500 mt-2"
                                        />
                                        <label className="text-gray-500 mt-4">Confirm your new password</label>
                                        <Field
                                            type="password"
                                            name="confirm_password"
                                            placeholder="Confirm Password"
                                            className={`px-2 py-1 focus:outline-none bg-transparent ${error && error.confirm_password ? 'border-red-500' : ''
                                                }`}
                                            onChange={handleChange}
                                            value={formData.confirm_password || ''}
                                            ref={inputRef}
                                        />
                                        <ErrorMessage
                                            name="confirm_password"
                                            component="div"
                                            className="text-red-500 mt-2"
                                        />

                                        <div className="passwordinput form_layout mb-5">
                                            <label className="text-gray-500 mt-2">
                                                Enter your password{' '}
                                                <RiInformationLine
                                                    data-tooltip-id="password-tooltip"
                                                    className="password-tooltip ml-2"
                                                />
                                            </label>
                                            <Tooltip
                                                id="password-tooltip"
                                                content="Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
                                                className="custom-tooltip"
                                            />
                                            <div className="inputbox-container">
                                                <Field
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="Password"
                                                    className={`inputbox`}
                                                    onChange={handleChange}
                                                    value={formData.password || ''}
                                                    autoComplete="current-password"                                                />
                                                <span
                                                    className="password-icon"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                </span>
                                            </div>
                                            <ErrorMessage
                                                name="password"
                                                component="div"
                                                className="error-message mt-2"
                                            />
                                        </div>
                                        <div className="passwordinput form_layout mb-5">
                                            <label className="text-gray-500 mt-2">
                                                Confirm your password{' '}
                                                <RiInformationLine
                                                    data-tooltip-id="confirm-password-tooltip"
                                                    className="password-tooltip ml-2"
                                                />
                                            </label>
                                            <Tooltip
                                                id="confirm-password-tooltip"
                                                content="Password must contain 8 characters, one uppercase, one lowercase, one number and one special case character"
                                                className="custom-tooltip"
                                            />
                                            <div className="inputbox-container">
                                                <Field
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirmPassword"
                                                    placeholder="Confirm Password"
                                                    className={`inputbox`}
                                                    value={formData.confirm_password || ''}
                                                    ref={inputRef}
                                                />
                                                <span
                                                    className="password-icon"
                                                    onClick={() =>
                                                        setShowConfirmPassword(!showConfirmPassword)
                                                    }
                                                >
                                                    {showConfirmPassword ? (
                                                        <BsEyeFill />
                                                    ) : (
                                                        <BsEyeSlashFill />
                                                    )}
                                                </span>
                                            </div>
                                            <ErrorMessage
                                                name="confirmPassword"
                                                component="div"
                                                className="error-message mt-2"
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!formData.password || !formData.confirm_password || passwordLoading}
                                            onClick={handlePasswordSubmit}
                                            className="submitbutton mt-10 bg-black text-white font-bold py-2 px-4 rounded-full"
                                        >
                                            {passwordLoading ? 'Resetting Password...' : 'Reset Password'}
                                        </button>
                                    </div>
                                      
                                )}
                                <div className="flex flex-col justify-center items-center mt-2">
                                    <p className="signup_create_acp" style={{ justifyContent: 'space-between!important' }}   >
                                       
                                        <Link to="/" className="create_ac ml-2">
                                            Back to Login
                                        </Link>
                                    </p>
                                </div>
                            </Form>
                        </Formik>
                    </div>
                </div>

                <div className="hidden sm:block right_block">
                    <img src={backgroundimage} alt="backgroundimage" className="h-screen w-full object-cover" />
                    <div className="text-overlay">
                        <img src={bannerRight} alt="logo" className="logo" style={{ width: '90%', display: 'inline-block' }} />
                    </div>
                </div>
            </div>
            <ToastContainer />
        </main>
    );
};

export default MultiStepForm;
