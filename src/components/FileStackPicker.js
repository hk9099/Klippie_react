import { useEffect, useRef } from 'react';
import * as filestack from 'filestack-js';

var FILESTACK = process.env.REACT_APP_FILESTACK_API_KEY;

const FilestackUploader = ({ setUploadedFileUrl, setUploadedFileName, onClose }) => {
    const apiKey = FILESTACK;
    const pickerRef = useRef(null);

    const handleFileUploadFinished = async (res) => {
        // // console.log(res, "res");
        setUploadedFileUrl(res.url);
        setUploadedFileName(res.filename);
        onClose(); // Close the picker after file selection
    };

    const handleFileUploadFailed = (res) => {
        // // console.log(res);
        // Handle file upload failure if needed
    };

    const handleFileUploadProgress = (res) => {
        // Handle file upload progress if needed
    };

    const handleFileSelected = (res) => {
        // Handle file selection if needed
    };

    const handleOpen = (res) => {
        // Handle picker open event if needed
    };

    const handleClose = (res) => {
        // Handle picker close event if needed
        onClose(); // Close the picker when it's closed
    };

    useEffect(() => {
        var client = filestack.init(apiKey);
        var options = {
            fromSources: [
                "local_file_system",
                "googledrive",
                "dropbox",
                "onedrive",
                "facebook",
                "instagram",
            ],
            onFileUploadFinished: handleFileUploadFinished,
            onFileUploadFailed: handleFileUploadFailed,
            onFileUploadProgress: handleFileUploadProgress,
            onFileSelected: handleFileSelected,
            onOpen: handleOpen,
            onClose: handleClose,
            onUploadDone: (res) => {
                // Handle upload done if needed
            },
            onUploadStarted: (res) => {
                // Handle upload started if needed
            },
            disableTransformer: true,
            uploadInBackground: true,
            accept: ["video/*", "audio/*"],
            maxFiles: 1,
        };

        pickerRef.current = client.picker(options);
        pickerRef.current.open();

        return () => {
            pickerRef.current.close();
        };
        // eslint-disable-next-line
    }, []);

    return null;
};

export default FilestackUploader;
