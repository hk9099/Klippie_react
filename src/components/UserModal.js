import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { Form, Field, ErrorMessage } from 'formik';
import { FiEdit2 } from 'react-icons/fi';
import { useSidebarContext } from '../context/SidebarContext';
import { TokenManager } from '../components/getToken.js';

const UserModal = ({ isOpen, userNickname, userEmailAddress, avatar, social }) => {
    const { setRefreshProfile } = useSidebarContext();
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAvatar, setSelectedAvatar] = useState(avatar);
    const [successMessage, setSuccessMessage] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const userToken = TokenManager.getToken()[1]
    const validationSchema = Yup.object({
        userNickname: Yup.string().required('Required'),
    });
    
    var HOSTINGURL = 'https://dev-api.getklippie.com';

    const formik = useFormik({
        initialValues: {
            userNickname,
            userEmailAddress,
            avatar,
        },
        validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            if (process.env.NODE_ENV === 'development') {
            console.log('values', values);
            }
            let data = new FormData();
            data.append('file', values.avatar);
            let config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: 'https://dev-api.getklippie.com/v1/auth/upload-profile-image',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
                data: data
            };

            axios.request(config)
                .then((response) => {
                    var profile_image = response.data.data.profile_image;
                    if (process.env.NODE_ENV === 'development') {
                    console.log(profile_image);
                    }
                    let data = JSON.stringify({
                        "name": values.userNickname,
                        "profile_image": profile_image
                    });

                    let config = {
                        method: 'post',
                        maxBodyLength: Infinity,
                        url: `${HOSTINGURL}/v1/auth/update-profile`,
                        headers: {
                            'accept': 'application/json',
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${userToken}`
                        },
                        data: data
                    };

                    axios
                        .request(config)
                        .then((response) => {
                            setRefreshProfile(true);
                            setSuccessMessage('Profile updated successfully');
                            setTimeout(() => {
                                setSuccessMessage(null);
                            }, 3000);
                        })
                        .catch((error) => {
                            if (process.env.NODE_ENV === 'development') {
                            console.log(error);
                            }
                            setErrorMessage('Something went wrong');
                            setTimeout(() => {
                                setErrorMessage(null);
                            }, 3000);
                        })
                })
                .catch((error) => {
                    if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                    }
                    setErrorMessage('Something went wrong');
                    setTimeout(() => {
                        setErrorMessage(null);
                    }, 3000);
                });
            setIsLoading(false);
        },
        enableReinitialize: true,
    });

    const handleAvatarChange = (event) => {
        const file = event.currentTarget.files[0];
        setSelectedAvatar(URL.createObjectURL(file));
        formik.setFieldValue('avatar', file);
        if (file) {


        } else {
            setSelectedAvatar(avatar);
            formik.setFieldValue('avatar', null);
        }
    };


    if (!isOpen) return null;


    return (
        <>
            <div className="bg-white rounded-lg w-full dark:bg-gray-800">
                {successMessage && (
                    <div className="bg-green-200 p-2 text-green-800 mb-2 rounded">
                        {successMessage}
                    </div>
                )}
                {errorMessage && (
                    <div className="bg-red-200 p-2 text-red-800 mb-2 rounded">
                        {errorMessage}
                    </div>
                )}
                <Form onSubmit={formik.handleSubmit} >
                    <div className="mb-4 text-center">
                        <div className="flex items-center justify-center text-center relative">
                            <img
                                className="h-20 w-20 rounded-full cursor-pointer hover:opacity-20"
                                src={selectedAvatar || avatar}
                                alt="Avatar"
                                onClick={() => document.getElementById('avatar').click()}
                            />
                            <Field type="file" id="avatar" name="avatar" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                            {/* Add the edit icon here */}
                            <div className={`absolute bottom-0  p-1 bg-white rounded-full ${social ? 'right-[9rem]' : 'right-[10rem]'}`}>
                                {/* Replace this with your React Icon */}
                                <FiEdit2 className="text-gray-500 cursor-pointer " onClick={() => document.getElementById('avatar').click()} />
                            </div>
                        </div>
                    </div>
                    <div className="mb-4">
                        <Field
                            type="text"
                            id="userNickname"
                            value={formik.values.userNickname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            name="userNickname"
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.userNickname && formik.errors.userNickname ? 'border-red-500' : ''} dark:bg-gray-700 dark:text-gray-200`}
                            placeholder="Enter your nickname"
                        /> {/* Step 4: Use Field component */}
                        <ErrorMessage name="userNickname" component="p" className="text-red-500 text-xs italic" /> {/* Step 5: Display validation errors */}
                    </div>
                    <div className="mb-4">
                        <Field
                            type="text"
                            id="userEmailAddress"
                            name="userEmailAddress"
                            value={formik.values.userEmailAddress}
                            className={`shadow appearance-none select-none read-only:bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.userEmailAddress && formik.errors.userEmailAddress ? 'border-red-500' : ''} dark:bg-gray-700 dark:text-gray-200`}
                            placeholder="Enter your email address"
                            style={{ cursor: 'not-allowed', userSelect: 'none' }}
                            readOnly
                            disabled
                        />
                        <ErrorMessage name="userEmailAddress" component="p" className="text-red-500 text-xs italic" /> {/* Step 5: Display validation errors */}
                    </div>
                    <div className="flex justify-end mt-7">
                        <button
                            type="submit"
                            className={`${isLoading ? 'bg-gray-400 cursor-wait' : 'bg-blue-500'} w-full text-white px-4 py-2 rounded-md dark:bg-gray-700 dark:text-white`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Loading...' : 'Submit'}
                        </button>
                    </div>
                </Form>
            </div>
        </>
    );
};

export default UserModal;
