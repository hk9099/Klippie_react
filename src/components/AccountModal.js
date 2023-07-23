import React, { useState ,useEffect} from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import * as Yup from 'yup';
import axios from 'axios';

const ChangePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string().required('Old Password is required'),
    newPassword: Yup.string()
        .notOneOf(
            [Yup.ref('oldPassword'), null],
            'New Password cannot be the same as Old Password'
        )
        .min(8, 'New Password must be at least 8 characters')
        .required('New Password is required'),
    confirmNewPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm New Password is required'),
});

const AccountModal = ({ showAccount , onclose }) => {
    const [showChangePassword, setShowChangePassword] = useState(true);
    const [showExportData, setShowExportData] = useState(false);
    const [token, setToken] = useState(null);
    const [googleToken, setGoogleToken] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleChangePassword = () => {
        setShowChangePassword(!showChangePassword);
        setShowExportData(false);
    };

    const toggleExportData = () => {
        setShowChangePassword(false);
        setShowExportData(!showExportData);
    };
    

    useEffect(() => {
        const encodedToken = localStorage.getItem('_sodfhgiuhih');
        const userGoogle = localStorage.getItem('_auth');

        if (encodedToken) {
            const decodedToken = atob(encodedToken);
            var userInfo = JSON.parse(decodedToken);
            setToken(userInfo.token.access_token);
        } else if (userGoogle) {
            const decodedGoogle = atob(userGoogle);
            var googleUserInfo = JSON.parse(decodedGoogle);
            setGoogleToken(googleUserInfo.token.access_token);
        }
        
    }, []);

    return (
        <div
        className={`fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-50 ${showAccount ? '' : 'hidden'
    } `}
    >
    <ToastContainer />
            <div className="bg-white rounded p-4 w-auto flex flex-col gap-4 dark:bg-gray-800">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white"> Account </h2>
                    <button
                        onClick={() => {
                            setShowChangePassword(false);
                            setShowExportData(false);
                            onclose();
                        }}
                        className="text-gray-600 hover:text-gray-800 dark:text-gray-200 dark:hover:text-gray-300"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.293 6.293a1 1 0 011.414 0L10 8.586l3.293-3.293a1 1 0 111.414 1.414L11.414 10l3.293 3.293a1 1 0 01-1.414 1.414L10 11.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 10 5.293 6.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </button>
                </div>
                <div className="flex flex-row">
                    <div className="w-25 flex flex-col gap-2">
                        <button
                            onClick={toggleChangePassword}
                            className={`${showChangePassword ? 'bg-blue-500' : 'bg-gray-400'
                                } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                        >
                            Change Password
                        </button>
                        <button
                            onClick={toggleExportData}
                            className={`${showExportData ? 'bg-blue-500' : 'bg-gray-400'
                                } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                        >
                            EXPORT ALL DATA
                        </button>
                    </div>

                    <div className="w-1 border-r border-gray-200 dark:border-gray-700 mx-3" />

                    <div className="w-80">
                        {showChangePassword && (
                            <Formik
                                initialValues={{
                                    oldPassword: '',
                                    newPassword: '',
                                    confirmNewPassword: '',
                                }}
                                validationSchema={ChangePasswordSchema}
                                onSubmit={async (values, { setSubmitting }) => {
                                    try {
                                        const response = await axios.post(
                                            'https://api.getklippie.com/v1/auth/change-password',
                                            {
                                                old_password: values.oldPassword,
                                                new_password: values.confirmNewPassword,
                                            },
                                            {
                                                headers: {
                                                    'accept': 'application/json',
                                                    'Content-Type': 'application/json',
                                                    'Authorization':`Bearer ${token ? token : googleToken}`
                                                },
                                            }
                                        );
                                        console.log(response.data);
                                        toast.success(response.data.message);

                                        setSubmitting(false);
                                    } catch (error) {
                                        console.error(error);
                                        toast.error(error.response.data.message);
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {({ isSubmitting }) => (
                                    <Form className="flex flex-col gap-4">
                                        <div className="flex flex-col gap-2 relative">
                                            <label htmlFor="oldPassword" className="text-sm text-gray-600 dark:text-gray-400">
                                                Old Password
                                            </label>
                                            <Field
                                                type={showOldPassword ? 'text' : 'password'}
                                                name="oldPassword"
                                                className="px-4 py-2 border rounded-md"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() => setShowOldPassword((prev) => !prev)}
                                            >
                                                {showOldPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                            </div>
                                            <ErrorMessage name="oldPassword" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <div className="flex flex-col gap-2 relative">
                                            <label htmlFor="newPassword" className="text-sm text-gray-600 dark:text-gray-400">
                                                New Password
                                            </label>
                                            <Field
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                className="px-4 py-2 border rounded-md"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() => setShowNewPassword((prev) => !prev)}
                                            >
                                                {showNewPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                            </div>
                                            <ErrorMessage name="newPassword" component="p" className="text-red-500 text-sm" />
                                        </div>

                                        <div className="flex flex-col gap-2 relative">
                                            <label htmlFor="confirmNewPassword" className="text-sm text-gray-600 dark:text-gray-400">
                                                Confirm New Password
                                            </label>
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmNewPassword"
                                                className="px-4 py-2 border rounded-md"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                            >
                                                {showConfirmPassword ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
                                            </div>
                                            <ErrorMessage name="confirmNewPassword" component="p" className="text-red-500 text-sm" />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`${isSubmitting ? 'bg-gray-400 cursor-wait' : 'bg-blue-500'
                                                } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}    
                                        >
                                            {isSubmitting ? 'Loading...' : 'Submit'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        )}
                        {showExportData && (
                            <div>
                                <p>Export Data</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;