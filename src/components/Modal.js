import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import qs from "qs";
import FilestackUploader from "./FileStackPicker";
import { updateMainVideo } from "./data";
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
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        youtubeLink: Yup.string().required("YouTube link is required"),
    });

    const uploadValidationSchema = Yup.object({
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
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
                        name: values.title,
                        description: values.description,
                        yt_url: youtubeLink,
                    };
                } else {
                    data = {
                        name: values.title,
                        description: values.description,
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
                    console.log("API call successful:", response.data);

                    const title = response.data.data.name;
                    const description = response.data.data.description;
                    const src = response.data.data.video_url;
                    const id = response.data.data.id;

                    // Calculate the duration of the video (assuming src is the video URL)
                    const videoElement = document.createElement('video');
                    videoElement.src = src;
                    videoElement.onloadedmetadata = () => {
                        const durationInSeconds = Math.floor(videoElement.duration);

                        // Convert duration to HH:MM:SS format
                        const hours = Math.floor(durationInSeconds / 3600);
                        const minutes = Math.floor((durationInSeconds % 3600) / 60);
                        const seconds = durationInSeconds % 60;
                        const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                        const newMainVideo = [
                            { title, description, src, id, time: formattedDuration }
                        ];
                        updateMainVideo(newMainVideo);

                        var projectId = response.data.data.id;
                        onSubmit(projectId);
                    };

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
                <h2 className="text-xl font-medium mb-4 text-gray-800 dark:text-white font-poppins">
                    Create a new post
                </h2>

                <form onSubmit={formik.handleSubmit}>
                    <div className="mb-4">
                        <label
                            htmlFor="title"
                            className="block font-medium text-gray-800 dark:text-gray-200"
                        >
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            className={`mt-1 block w-full border ${formik.errors.title && formik.touched.title
                                ? "border-red-500"
                                : "border-gray-300"
                                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.title}
                        />
                        {formik.errors.title && formik.touched.title && (
                            <p className="text-red-500 text-sm mt-1">{formik.errors.title}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label
                            htmlFor="description"
                            className="block font-medium text-gray-800 dark:text-gray-200"
                        >
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows="4"
                            className={`mt-1 block w-full border ${formik.errors.description && formik.touched.description
                                ? "border-red-500"
                                : "border-gray-300"
                                } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200`}
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
                                checked={selectedOption === "youtube"}
                                onChange={() => setSelectedOption("youtube")}
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                                htmlFor="youtube"
                                className="ml-2 text-gray-800 dark:text-gray-200"
                            >
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
                                className="form-radio h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label
                                htmlFor="upload"
                                className="ml-2 text-gray-800 dark:text-gray-200"
                            >
                                Upload Image/Video
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
                                    } rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
                                        className="mt-1  w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 select-none dark:text-gray-200 dark:border-gray-700 dark:hover:bg-gray-700 dark:hover:text-gray-200"
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
                                        Upload Image/Video
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
                    <div className="flex justify-end">
                        <button
                            type="button"
                            className="mr-2 px-4 py-2 rounded-lg font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => {
                                resetFormAndFileStack();
                                onClose();
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className={`px-4 py-2 bg-blue-500 text-white rounded-lg font-medium ${formik.isSubmitting
                                ? "opacity-75 cursor-wait"
                                : "hover:bg-blue-600 dark:hover:bg-blue-600 cursor-pointer grab:cursor grab:transition-all grab:duration-200"
                                } focus:outline-none focus:ring-2 focus:ring-blue-500`}
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
