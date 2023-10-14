import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Logo from '../assets/images/logo.svg';

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const PopupForm = ({ onSubmit, onCancel }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-[#ffffff2a] p-6 rounded-[30px] shadow-lg ">
                <div className="flex justify-center items-center mb-6">
                    <img src={Logo} alt="logo" className="bg-gray-400 rounded-full w-16 h-16 mr-3" />
                    <h1 className="text-4xl text-white text-center font-bold tracking-wider">
                        Klippie</h1>
                </div>
                <p className="text-lg text-gray-200 text-center mb-8">  Your session has expired. Please log in to continue.</p>
                <Formik
                    initialValues={{
                        email: '',
                        password: '',
                    }}
                    validationSchema={validationSchema}
                    onSubmit={onSubmit}
                >
                    <Form>
                        <div className="mb-4">
                            <label className="block text-white">Email</label>
                            <Field
                                type="text"
                                name="email"
                                className="border border-white text-white bg-transparent px-3 py-2 rounded-lg w-full"
                            />
                            <ErrorMessage name="email" component="div" className="text-red-200" />
                        </div>
                        <div className="mb-4">
                            <label className="block text-white">Password</label>
                            <Field
                                type="password"
                                name="password"
                                className="border border-white text-white bg-transparent px-3 py-2 rounded-lg w-full"
                            />
                            <ErrorMessage name="password" component="div" className="text-red-200" />
                        </div>
                        <div className="flex justify-center">
                            <button
                                type="submit"
                                className="bg-white text-blue-600 hover:bg-blue-200 px-4 py-2 rounded-lg font-semibold mr-4"
                            >
                                Log In
                            </button>
                            <button
                                type="button"
                                onClick={onCancel}
                                className="bg-gray-400 text-white hover:bg-gray-600 px-4 py-2 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </Form>
                </Formik>
            </div>
        </div>
    );
};

export default PopupForm;
