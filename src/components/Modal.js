import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import qs from "qs";
import FilestackUploader from "./FileStackPicker";
// import { updateMainVideo } from "./data";
const Modal = ({ onSubmit, isOpen, onClose }) => {
    const [selectedOption, setSelectedOption] = useState("upload");
    //eslint-disable-next-line
    const [isLoading, setIsLoading] = useState(false);
    const [uploadedFileUrl, setUploadedFileUrl] = useState(null);
    const [uploadedFileName, setUploadedFileName] = useState(null);
    // const [isLoading, setIsLoading] = useState(false);
    const [isFilestackOpen, setIsFilestackOpen] = useState(false);
    const handleFilestackOpen = () => {
        setIsFilestackOpen(true);
    };

    const resetFormAndFileStack = () => {
        formik.resetForm();
        setUploadedFileUrl(null);
        setUploadedFileName(null);
    };

    const youtubeValidationSchema = Yup.object({
        youtubeLink: Yup.string().required("YouTube link is required"),
    });

    const uploadValidationSchema = Yup.object({
        file: Yup.mixed().required("File is required"),
    });

    function convertYouTubeUrl(youtubeLink) {
        const shortFormatRegex = /https:\/\/youtu.be\/([a-zA-Z0-9_-]+)/;

        const longFormatRegex =
            /https:\/\/www.youtube.com\/watch\?v=([a-zA-Z0-9_-]+)/;

        const isShortFormat = shortFormatRegex.test(youtubeLink);

        const isLongFormat = longFormatRegex.test(youtubeLink);

        if (isLongFormat) {
            return youtubeLink;
        }

        if (isShortFormat) {
            const match = youtubeLink.match(shortFormatRegex);
            if (match && match[1]) {
                const videoId = match[1];
                return `https://www.youtube.com/watch?v=${videoId}`;
            }
        }

        return youtubeLink;
    }

    const validationSchema =
        selectedOption === "youtube"
            ? youtubeValidationSchema
            : uploadValidationSchema;

    const formik = useFormik({
        initialValues: {
            title: "",
            description: "",
            youtubeLink: "",
            file: null,
        },
        validationSchema,
        onSubmit: async (values, { setSubmitting }) => {
            try {
                setIsLoading(true);
                let data = {};

                if (validationSchema === youtubeValidationSchema) {
                    // Convert the YouTube URL format before submitting
                    const youtubeLink = convertYouTubeUrl(values.youtubeLink);
                    data = {
                        yt_url: youtubeLink,
                    };
                } else {
                    data = {
                        file_url: values.file,
                    };
                }

                const encodedToken = localStorage.getItem("_sodfhgiuhih");
                if (encodedToken) {
                    var decodedToken = atob(encodedToken);
                    const userInfo = JSON.parse(decodedToken);
                    var Token = userInfo.token.access_token;
                }

                const apiUrl = "https://api.getklippie.com/v1/project/create";
                const config = {
                    headers: {
                        accept: "application/json",
                        "Content-Type": "application/x-www-form-urlencoded",
                        Authorization: `Bearer ${Token}`,
                    },
                };

                const response = await axios.post(apiUrl, qs.stringify(data), config);
                if (response.status === 200) {
                    // console.log("API call successful:", response.data);


                    var projectId = response.data.data.id;
                    onSubmit(projectId);

                } else {
                    console.error("API call error:", response.data);
                }
                resetFormAndFileStack();
            } catch (error) {
                console.error("Error submitting form:", error);
            } finally {
                setIsLoading(false);
                setSubmitting(false);
            }
        },
    });

    useEffect(() => {
        formik.setFieldValue("file", uploadedFileUrl);
        // eslint-disable-next-line
    }, [uploadedFileUrl]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-50"
            style={{ margin: "0px" }}
        >
            <div className=" p-8 rounded-lg w-96 bg-white dark:bg-gray-800 shadow-lg">
                <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white font-poppins text-center font-bold">
                    Create a new Project
                </h2>
                <hr className="dark:border-gray-500 my-1" />
                <form onSubmit={formik.handleSubmit} className="mt-4">
                    <div className="mb-4 flex justify-between items-center">
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="youtube"
                                name="option"
                                value="youtube"
                                checked={selectedOption === "youtube"}
                                onChange={() => setSelectedOption("youtube")}
                                className="form-radio hidden h-0 w-0"
                            />
                            <label
                                htmlFor="youtube"
                                className="relative cursor-pointer pl-8 text-gray-800 dark:text-gray-200 select-none"
                            >
                                <div className="absolute left-0 flex items-center justify-center w-6 h-6 border border-gray-400 dark:border-gray-600 rounded-full">
                                    <div className={`w-3 h-3 rounded-full ${selectedOption === "youtube" ? 'bg-indigo-600' : 'bg-white'}`}></div>
                                </div>
                                YouTube Link
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                type="radio"
                                id="upload"
                                name="option"
                                value="upload"
                                checked={selectedOption === "upload"}
                                onChange={() => setSelectedOption("upload")}
                                className="form-radio hidden h-0 w-0"
                            />
                            <label
                                htmlFor="upload"
                                className="relative cursor-pointer pl-8 text-gray-800 dark:text-gray-200 select-none"
                            >
                                <div className="absolute left-0 flex items-center justify-center w-6 h-6 border border-gray-400 dark:border-gray-600 rounded-full">
                                    <div className={`w-3 h-3 rounded-full ${selectedOption === "upload" ? 'bg-indigo-600' : 'bg-white'}`}></div>
                                </div>
                                Upload Audio/Video
                            </label>
                        </div>
                    </div>


                    {selectedOption === "youtube" ? (
                        <div className="mb-4">
                            {/* <label
                                htmlFor="youtubeLink"
                                className="block font-medium text-gray-800"
                            >
                                YouTube Link
                            </label> */}
                            <input
                                type="text"
                                id="youtubeLink"
                                name="youtubeLink"
                                className={`mt-1 block w-full border ${formik.errors.youtubeLink && formik.touched.youtubeLink
                                    ? "border-red-500"
                                    : "border-gray-300"
                                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 bg-transparent text-white`}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.youtubeLink}
                            />
                            {formik.errors.youtubeLink && formik.touched.youtubeLink && (
                                <p className="text-red-500 text-sm mt-1">
                                    {formik.errors.youtubeLink}
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="mb-4">
                            {uploadedFileUrl ? (
                                <div className="relative">
                                    <p
                                        id="filename"
                                        className="mt-1  w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 select-none dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200 whitespace-nowrap overflow-hidden overflow-ellipsis"
                                    >
                                        {uploadedFileName}
                                    </p>
                                    <input
                                        type="text"
                                        id="file"
                                        value={uploadedFileUrl}
                                        readOnly
                                        className="mt-1  w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hidden dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                                    />
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className={`flex items-center justify-center w-full gap-x-6 p-3 text-base rounded-lg cursor-pointer mt-2 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200`}
                                    onClick={handleFilestackOpen}
                                    id="uploadBtn"
                                >
                                    <span
                                        className={` origin-left duration-300 hover:block font-medium text-sm text-center`}
                                    >
                                        Upload Audio/Video
                                    </span>
                                </button>
                            )}
                        </div>
                    )}
                    {isFilestackOpen && (
                        <FilestackUploader
                            onClose={() => setIsFilestackOpen(false)}
                            setUploadedFileUrl={setUploadedFileUrl}
                            setUploadedFileName={setUploadedFileName}
                        />
                    )}
                    <hr className="dark:border-gray-500 my-1" />
                    <div className="flex justify-end mt-4">
                        <button
                            type="button"
                            className="mr-2 w-full px-4 py-2 rounded-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => {
                                resetFormAndFileStack();
                                onClose();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 w-full bg-gray-500 text-white rounded-lg font-medium ${formik.isSubmitting
                                ? "opacity-75 cursor-wait"
                                : "hover:bg-gray-600 dark:hover:bg-gray-600 cursor-pointer grab:cursor grab:transition-all grab:duration-200"
                                } focus:outline-none focus:ring-2 focus:ring-gray-500`}
                            disabled={
                                formik.isSubmitting ||
                                (selectedOption === "youtube" && !formik.values.youtubeLink) ||
                                (selectedOption === "upload" && !formik.values.file)
                            }
                        >
                            {formik.isSubmitting ? "Submitting..." : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Modal;
