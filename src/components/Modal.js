import React, { useState , useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import qs from 'qs';
import FilestackUploader from './FileStackPicker';

const Modal = ({ isOpen, onClose }) => {
    const [selectedOption, setSelectedOption] = useState('upload');
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    const [isFilestackOpen, setIsFilestackOpen] = useState(false);

    const handleFilestackOpen = () => {
        setIsFilestackOpen(true);
    };

    const youtubeValidationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        youtubeLink: Yup.string().required('YouTube link is required'),
    });

    const uploadValidationSchema = Yup.object({
        title: Yup.string().required('Title is required'),
        description: Yup.string().required('Description is required'),
        file: Yup.mixed().required('File is required'),
    });

    const validationSchema =
        selectedOption === 'youtube' ? youtubeValidationSchema : uploadValidationSchema;

    const formik = useFormik({
        initialValues: {
            title: '',
            description: '',
            youtubeLink: '',
            file: uploadedFileUrl,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            console.log('Submitting form:', values);
            try {
                // Prepare the data for the API call
                let data = {};
                if (selectedOption === 'youtube') {
                    data = {
                        name: values.title,
                        description: values.description,
                        yt_url: values.youtubeLink,
                    };
                } else {
                    data = {
                        name: values.title,
                        description: values.description,
                        file_url: values.file,
                    };
                }
                const encodedToken = localStorage.getItem('_sodfhgiuhih');
                if (encodedToken) {
                    var decodedToken = atob(encodedToken);
                    const userInfo = JSON.parse(decodedToken);
                    var Token = userInfo.token.access_token;
                }
                const apiUrl = 'https://api.getklippie.com/v1/project/create';
                const config = {
                    headers: {
                        accept: 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                        Authorization: `Bearer ${Token}`,
                    },
                };
                // console.log(data, config);
                const response = await axios.post(apiUrl, qs.stringify(data), config);

                if (response.status === 200) {
                    console.log('API call successful:', response.data);
                } else {
                    console.error('API call error:', response.data);
                }

                formik.resetForm();
                setSubmitting(false);
                onClose();
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        formik.setFieldValue('file', uploadedFileUrl);
        // eslint-disable-next-line
    }, [uploadedFileUrl]);

    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-50" style={{ margin: '0px' }}>
            <div className="bg-white p-8 rounded-lg w-96">
                <h2 className="text-xl font-medium mb-4">Create a new post</h2>
                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="title" className="block font-medium text-gray-800">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`mt-1 block w-full border ${formik.errors.title && formik.touched.title
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                        />
                        {formik.errors.title && formik.touched.title && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block font-medium text-gray-800">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className={`mt-1 block w-full border ${formik.errors.description && formik.touched.description
                                ? 'border-red-500'
                                : 'border-gray-300'
                                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.description}
                        />
                        {formik.errors.description && formik.touched.description && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.description}
                            </p>
                        )}
                    </div>

                    <div className="mb-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="youtube"
                                name="option"
                                value="youtube"
                                checked={selectedOption === 'youtube'}
                                onChange={() => setSelectedOption('youtube')}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor="youtube" className="ml-2">
                                YouTube Link
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="upload"
                                name="option"
                                value="upload"
                                checked={selectedOption === 'upload'}
                                onChange={() => setSelectedOption('upload')}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label htmlFor="upload" className="ml-2">
                                Upload Image/Video
                            </label>
                        </div>
                    </div>


                    {selectedOption === 'youtube' ? (
                        <div className="mb-4">
                            <label htmlFor="youtubeLink" className="block font-medium text-gray-800">
                                YouTube Link
                            </label>
                            <input
                                type="text"
                                id="youtubeLink"
                                name="youtubeLink"
                                className={`mt-1 block w-full border ${formik.errors.youtubeLink && formik.touched.youtubeLink
                                    ? 'border-red-500'
                                    : 'border-gray-300'
                                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.youtubeLink}
                            />
                            {formik.errors.youtubeLink && formik.touched.youtubeLink && (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.youtubeLink}</p>
                            )}
                        </div>
                    ) : (
                        <div className="mb-4">
                            {uploadedFileUrl ? (
                                <div className="relative">
                                    <p
                                        id="filename"
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 select-none"
                                    >{uploadedFileName}</p>
                                    <input
                                        type="text"
                                        id="file"
                                        value={uploadedFileUrl}
                                        readOnly
                                        className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden "
                                    />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className={`flex items-center justify-center w-full gap-x-6 p-3 text-base rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 border-2 border-gray-500 dark:border-gray-100 mt-2 border-animation`}
                                    onClick={handleFilestackOpen} // Set the event handler to open FilestackPicker
                                    id="uploadBtn"
                                >
                                    <span className={` origin-left duration-300 hover:block font-medium text-sm text-center`}>
                                        Upload Image/Video
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                    {isFilestackOpen && <FilestackUploader onClose={() => setIsFilestackOpen(false)} setUploadedFileUrl={setUploadedFileUrl} setUploadedFileName={setUploadedFileName} />}
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg font-medium ${formik.isSubmitting ? 'opacity-75 cursor-wait' : 'hover:bg-blue-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            disabled={
                                formik.isSubmitting ||
                                (selectedOption === 'youtube' && !formik.values.youtubeLink) ||
                                (selectedOption === 'upload' && !formik.values.file)
                            }
                        >
                            {formik.isSubmitting ? 'Submitting...' : 'Submit'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
