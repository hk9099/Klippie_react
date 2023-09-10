import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import axios from 'axios';
import UserModal from '../components/UserModal.js';
import { useSnackbar } from 'notistack';

var HOSTINGURL = process.env.REACT_APP_HOSTING_URL;

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

const AccountModal = ({
    showAccount,
    onclose,
    userNickname,
    userEmailAddress,
    avatar,
}) => {
    const [token, setToken] = useState(null);
    const { enqueueSnackbar } = useSnackbar();
    const [googleToken, setGoogleToken] = useState(null);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [social, setSocial] = useState(false);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(!social ? 'profile' : 'changePassword');

    useEffect(() => {
        const encodedToken = localStorage.getItem('_sodfhgiuhih');
        const userGoogle = localStorage.getItem('_auth');

        if (encodedToken) {
            const decodedToken = atob(encodedToken);
            var userInfo = JSON.parse(decodedToken);
            var social = userInfo.user.is_social
            setSocial(social);
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
            <div className={`bg-white rounded p-4 flex flex-col gap-4 dark:bg-gray-800 ${!social ? 'w-[600px]' : 'w-[400px]'} `}>
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        
                    </h2>
                    <button
                        onClick={() => {
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
                        {!social && (
                            <button
                                onClick={() => setActiveTab('changePassword')}
                                className={`${activeTab === 'changePassword' ? 'bg-blue-500' : 'bg-gray-400'
                                    } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                            >
                                Change&nbsp;Password
                            </button>
                        )} 
                        {!social && (
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`${activeTab === 'profile' ? 'bg-blue-500' : 'bg-gray-400'
                                } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                        >
                            Profile
                            </button>
                        )}
                    </div>

                    {!social && (
                    <div className="w-1 border-r border-gray-200 dark:border-gray-700 mx-3" />
                    )}

                    <div className="w-[100%]">
                        {activeTab === 'changePassword' && (
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
                                            `${HOSTINGURL}/v1/auth/change-password`,
                                            {
                                                old_password: values.oldPassword,
                                                new_password: values.confirmNewPassword,
                                            },
                                            {
                                                headers: {
                                                    accept: 'application/json',
                                                    'Content-Type': 'application/json',
                                                    Authorization: `Bearer ${token ? token : googleToken}`,
                                                },
                                            }
                                        );
                                        enqueueSnackbar(response.data.message, {
                                            variant: 'success',
                                            autoHideDuration: 1500,
                                        });
                                        localStorage.removeItem('_auth');
                                        localStorage.removeItem('_sodfhgiuhih');
                                        navigate('/');
                                        setSubmitting(false);
                                    } catch (error) {
                                        console.error(error);
                                        enqueueSnackbar(error.response.data.message, {
                                            variant: 'error',
                                            autoHideDuration: 1500,
                                        });
                                        setSubmitting(false);
                                    }
                                }}
                            >
                                {(formikProps) => (
                                    <Form className="flex flex-col gap-3">
                                        <div className="flex flex-col gap-2 relative">
                                            <label
                                                htmlFor="oldPassword"
                                                className="text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                Old Password
                                            </label>
                                            <Field
                                                type={showOldPassword ? 'text' : 'password'}
                                                name="oldPassword"
                                                className="px-4 py-2 border rounded-md relative"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() =>
                                                    setShowOldPassword((prev) => !prev)
                                                }
                                            >
                                                {showOldPassword ? (
                                                    <IoMdEyeOff size={20} />
                                                ) : (
                                                    <IoMdEye size={20} />
                                                )}
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="oldPassword"
                                            component="p"
                                            className="text-red-500 text-sm"
                                        />
                                        <div className="flex flex-col gap-2 relative">
                                            <label
                                                htmlFor="newPassword"
                                                className="text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                New Password
                                            </label>
                                            <Field
                                                type={showNewPassword ? 'text' : 'password'}
                                                name="newPassword"
                                                className="px-4 py-2 border rounded-md"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() =>
                                                    setShowNewPassword((prev) => !prev)
                                                }
                                            >
                                                {showNewPassword ? (
                                                    <IoMdEyeOff size={20} />
                                                ) : (
                                                    <IoMdEye size={20} />
                                                )}
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="newPassword"
                                            component="p"
                                            className="text-red-500 text-sm"
                                        />

                                        <div className="flex flex-col gap-2 relative">
                                            <label
                                                htmlFor="confirmNewPassword"
                                                className="text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                Confirm New Password
                                            </label>
                                            <Field
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                name="confirmNewPassword"
                                                className="px-4 py-2 border rounded-md"
                                            />
                                            <div
                                                className="absolute top-[71%] -translate-y-1/2 right-3 cursor-pointer"
                                                onClick={() =>
                                                    setShowConfirmPassword((prev) => !prev)
                                                }
                                            >
                                                {showConfirmPassword ? (
                                                    <IoMdEyeOff size={20} />
                                                ) : (
                                                    <IoMdEye size={20} />
                                                )}
                                            </div>
                                        </div>
                                        <ErrorMessage
                                            name="confirmNewPassword"
                                            component="p"
                                            className="text-red-500 text-sm"
                                        />
                                        <button
                                            type="submit"
                                            disabled={formikProps.isSubmitting}
                                            className={`${formikProps.isSubmitting
                                                    ? 'bg-gray-400 cursor-wait'
                                                    : 'bg-blue-500'
                                                } text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                                        >
                                            {formikProps.isSubmitting ? 'Loading...' : 'Submit'}
                                        </button>
                                    </Form>
                                )}
                            </Formik>
                        )}
                        {activeTab === 'profile' && (
                            <Formik initialValues={{}} onSubmit={() => { }}>
                                <UserModal
                                    isOpen={true} // Always show the UserModal when the "Profile" tab is active
                                    userNickname={userNickname}
                                    userEmailAddress={userEmailAddress}
                                    avatar={avatar}
                                    social={social}
                                    onclose={() => {
                                        onclose();
                                    }}
                                />
                            </Formik>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccountModal;
