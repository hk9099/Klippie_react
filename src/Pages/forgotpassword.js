import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import '../assets/css/signin.css';
import axios from 'axios';
import { HiOutlineMail } from 'react-icons/hi';
import { RiInformationLine } from 'react-icons/ri';
// import { TbDeviceMobileMessage } from 'react-icons/tb';
import { BsEyeFill, BsEyeSlashFill } from 'react-icons/bs';
import { Tooltip } from 'react-tooltip';
import think from '../assets/images/think_40x40.gif';
import { useNavigate } from 'react-router-dom';
import ToastNotification from "../components/ToastNotification";
import { Toaster } from 'react-hot-toast';

const MultiStepForm = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [emailSent, setEmailSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    // eslint-disable-next-line no-unused-vars
    const [loading, setLoading] = useState(false);
    // eslint-disable-next-line no-unused-vars
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
                'https://dev-api.getklippie.com/v1/auth/forgot-password-send-otp',
                {
                    email: formData.email,
                }
            );
            const emailtoken = response.data.data;
            console.log(JSON.stringify(response.data));
            setEmailSent(true);
            setLoading(false);
            setStep(2);
            setEmailToken(emailtoken);
            ToastNotification({ message: 'Email sent successfully!', type: 'success' });
        } catch (error) {
            var err = error.response.data.detail;
            setLoading(false);
            setError(err);
            ToastNotification({ message: err, type: 'error' });
        } finally {
            setEmailLoading(false);
        }
    };

    const handleOtpVerifySubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setOtpLoading(true);
        try {

            //eslint-disable-next-line
            const response = await axios.post(
                'https://dev-api.getklippie.com/v1/auth/verify-otp',
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
            ToastNotification({ message: 'Code verified successfully!', type: 'success' });
        } catch (error) {
            console.log(error.response.data.detail);
            setLoading(false);
            setError(error.response.data.detail);
            ToastNotification({ message: error.response.data.detail, type: 'error' });
        } finally {
            setOtpLoading(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setPasswordLoading(true);
        try {
            //eslint-disable-next-line
            const response = await axios.post(
                'https://dev-api.getklippie.com/v1/auth/reset-forgot-password',
                {
                    token: emailToken,
                    new_password: formData.password,
                }
            );
            console.log(JSON.stringify(response.data));
            setLoading(false);
            setSuccess('Password reset successful!');
            ToastNotification({ message: 'Password reset successful!', type: 'success' });
            navigate('/');
        } catch (error) {
            console.log(error.response.data.detail);
            setLoading(false);
            setError(error.response.data.detail);
            ToastNotification({ message: error.response.data.detail, type: 'error' });
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
        email: Yup.string()
      .email("Invalid email address")
      .required("Email is required")
      .max(50, "Email is too long - should be 50 chars maximum.")
      .matches(
        /^[a-zA-Z0-9.]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
        "Invalid email address"
      )
      .lowercase(),
        otp: Yup.string().required('Code is required').min(6, 'Code must be 6 digits').max(6, 'Code must be 6 digits').matches(/^[0-9]+$/, "Must be only digits").typeError('Must be a number'),
        password: Yup.string().required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    return (
        <main>
            <Toaster position="top-center" />
            <div className="h-full w-full">
                <div className="flex flex-col justify-center items-center left_block left_backgroundinage">
                    <div className="left_heading text-center">
                        <h1 className="text-4xl font-bold text-gray-200 flext items-center">
                            Forgot {'  '}
                            <span className="bg-gradient-to-r from-fuchsia-500 to-cyan-500 bg-clip-text text-transparent">
                                Password
                            </span>
                            <img src={think} alt="think" className="inline-block ml-2 rounded-full" />
                        </h1>
                        {/* <p className="text-gray-500 mt-2">Please Login to your account.</p> */}
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
                                            <div className="inputbox-container mt-2">
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
                                            {emailLoading ? 'Sending Email...' : 'Send Code'}
                                        </button>
                                    </div>
                                )}

                                {step === 2 && emailSent && (
                                    <div className="emailinput form_layout mb-10">
                                        <p className="text-gray-500 mt-3 font-medium text-center">
                                            {' '}
                                            Please Enter The Unique Code That We Sent To  <span className="font-extrabold text-[#917bea]">{formData.email}</span>{' '}
                                            Email
                                        </p>
                                        {/* <h1 className="text-2xl font-bold text-gray-800 text-center">Step 2</h1> */}
                                        <div className="emailinput form_layout mb-5 mt-5">
                                            {/* <label className="text-gray-500 emailinput">
                                                Enter OTP
                                            </label> */}
                                            <div className="inputbox-container">
                                                <Field
                                                    type="text"
                                                    name="otp"
                                                    placeholder="Enter Code"
                                                    onChange={handleChange}
                                                    value={formData.otp || ''}
                                                    className={`inputbox`}
                                                />
                                                {/* <span className="email-icon">
                                                    <TbDeviceMobileMessage />
                                                </span> */}

                                            </div>
                                            <ErrorMessage
                                                name="otp"
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
                                            {otpLoading ? 'Verifying Code...' : 'Verify Code'}
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
                                    <>
                                        <div className="passwordinput form_layout mb-5">
                                            <label className="text-gray-500 mt-2">
                                                Enter your new password{' '}
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
                                            <div className="inputbox-container mt-2">
                                                <Field
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="password"
                                                    placeholder="Password"
                                                    className={`inputbox`}
                                                    onChange={handleChange}
                                                    value={formData.password || ''}
                                                    autoComplete="current-password" />
                                                <span
                                                    className="password-icon"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? <BsEyeFill /> : <BsEyeSlashFill />}
                                                </span>
                                            </div>
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
                                            <div className="inputbox-container mt-2">
                                                <Field
                                                    type={showConfirmPassword ? 'text' : 'password'}
                                                    name="confirm_password"
                                                    placeholder="Confirm Password"
                                                    className={`inputbox`}
                                                    onChange={handleChange}
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
                                                name="confirm_password"
                                                component="div"
                                                className="text-red-500 mt-2"
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
                                    </>

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
            </div>
        </main>
    );
};

export default MultiStepForm;
