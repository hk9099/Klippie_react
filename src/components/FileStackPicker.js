import { useEffect, useRef } from 'react';
import * as filestack from 'filestack-js';

const FilestackUploader = ({ setUploadedFileUrl, setUploadedFileName }) => {
    const apiKey = "Ah6BGoib5TtiyxsLeCtXBz";
    const pickerRef = useRef(null); // Use useRef to preserve 'picker' over renders

    const handleFileUploadFinished = async (res) => {
        console.log(res, "res");
        setUploadedFileUrl(res.url);
        setUploadedFileName(res.filename);
        pickerRef.current.close();
    };

    const handleFileUploadFailed = (res) => {
        console.log(res);
        // toastr.error('File upload failed');
    };

    const handleFileUploadProgress = (res) => {
        // console.log(res);
        // toastr.info('File upload in progress');
    };

    const handleFileSelected = (res) => {
        // console.log(res);
    };

    const handleOpen = (res) => {
        // console.log(res);
    };

    const handleClose = (res) => {
        // console.log(res);
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
                // console.log(res);
            },
            onUploadStarted: (res) => {
                // console.log(res);
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
