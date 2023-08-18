import React, { useState , useEffect} from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const UserModal = ({ isOpen, onClose, userNickname, userEmailAddress, avatar, onSubmit }) => {
    // eslint-disable-next-line no-unused-vars
    const [isLoading, setIsLoading] = useState(false); 
    const [selectedAvatar, setSelectedAvatar] = useState(avatar);
    // console.log('avatar', avatar);

    const validationSchema = Yup.object({
        userNickname: Yup.string().required('Required'),
        userEmailAddress: Yup.string().email('Invalid email').required('Required'),
    });

    useEffect(() => {
        const handleOutsideClick = (event) => {
            const modalElement = document.querySelector('.modal-container');
            if (modalElement && !modalElement.contains(event.target)) {
                onClose();
            }
        };

        if (isOpen) {
            window.addEventListener('click', handleOutsideClick);
        }

        return () => {
            window.removeEventListener('click', handleOutsideClick);
        };
    }, [isOpen, onClose]);

    const formik = useFormik({
        initialValues: {
            userNickname,
            userEmailAddress,
        },
        validationSchema,
        onSubmit: (values) => {
            setIsLoading(true);
            onSubmit(values);
            setIsLoading(false);
            onClose();
        },
        enableReinitialize: true,
    });

    const handleAvatarChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedAvatar(reader.result);
                formik.setFieldValue('avatar', file);

                const data = new FormData();    
                data.append('file', file);

                let config = {
                    method: 'post',
                    maxBodyLength: Infinity,
                    url: 'https://api.getklippie.com/v1/auth/upload-profile-image',
                    headers: {
                        'accept': 'application/json',
                        ...data.getHeaders()
                    },
                    data: data
                };

                axios.request(config)
                    .then((response) => {
                        console.log(JSON.stringify(response.data));
                    })
                    .catch((error) => {
                        console.log(error);
                    });
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedAvatar(avatar);
            formik.setFieldValue('avatar', null);
        }
    };


    if (!isOpen) return null;

    const defaultAvatarUrl = avatar

    return (
        <section className={`fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-50 dark:bg-gray-500 dark:bg-opacity-70`} style={{ margin: '0px' }}>
            <div className="bg-white p-4 rounded-lg w-[400px] dark:bg-gray-800">
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="userNickname" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">
                            Nickname
                        </label>
                        <input
                            type="text"
                            id="userNickname"
                            name="userNickname"
                            value={formik.values.userNickname}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.userNickname && formik.errors.userNickname ? 'border-red-500' : ''
                                } dark:bg-gray-700 dark:text-gray-200`}
                            placeholder="Enter your nickname"
                        />
                        {formik.touched.userNickname && formik.errors.userNickname && (
                            <p className="text-red-500 text-xs italic">{formik.errors.userNickname}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="userEmailAddress" className="block text-gray-700 text-sm font-bold mb-2 dark:text-gray-200">
                            Email Address
                        </label>
                        <input
                            type="text"
                            id="userEmailAddress"
                            name="userEmailAddress"
                            value={formik.values.userEmailAddress}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`shadow appearance-none select-none read-only:bg-gray-100 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${formik.touched.userEmailAddress && formik.errors.userEmailAddress ? 'border-red-500' : ''
                                } dark:bg-gray-700 dark:text-gray-200`}
                            placeholder="Enter your email address"
                            style={{ cursor: 'not-allowed', userSelect: 'none' }}
                            readOnly disabled
                        />
                        {formik.touched.userEmailAddress && formik.errors.userEmailAddress && (
                            <p className="text-red-500 text-xs italic">{formik.errors.userEmailAddress}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="avatar" className="block text-gray-700 text-sm font-bold mb-2">
                            Avatar
                        </label>
                        <div className="flex items-center">
                            <img
                                className="h-12 w-12 rounded-full cursor-pointer border border-gray-400 hover:opacity-20"
                                src={selectedAvatar || avatar || defaultAvatarUrl}
                                alt="Avatar"
                                onClick={() => document.getElementById('avatar').click()}
                            />
                            <input
                                type="file"
                                id="avatar"
                                name="avatar"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                className="hidden"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 rounded-md border border-gray-500 bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 rounded-md border border-blue-500 bg-blue-500 text-white font-bold hover:bg-blue-600 dark:bg-blue-600 dark:text-gray-200"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default UserModal;
