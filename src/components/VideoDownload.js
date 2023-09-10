import React, { useState, useEffect } from "react";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import ZipLoader from "./zipLoader.js";

const VideoDownload = ({ selectedRows, onComplete }) => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        async function downloadVideos() {
            const zip = new JSZip();
            // const totalFiles = selectedRows.length;
            // let filesDownloaded = 0;

            // const updateProgressBar = () => {
            //     const currentProgress = (filesDownloaded / totalFiles) * 100;
            //     setProgress(currentProgress);
            // };

            for (const row of selectedRows) {
                const videoBlob = await fetch(row.src).then((response) => {
                    if (!response.ok) {
                        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
                    }
                    return response.blob();
                });

                zip.file(row.title + '.mp4', videoBlob);

                // filesDownloaded++;
                // updateProgressBar();
            }

            zip.generateAsync({ type: 'blob' }, (metadata) => {
                if (metadata.percent) {
                    const currentProgress = metadata.percent;
                    setProgress(currentProgress);
                }
            }).then((content) => {
                setProgress(100); 
                saveAs(content, `videos${Date.now()}.zip`);
                onComplete();
            });
        }

        if (selectedRows.length > 0) {
            downloadVideos();
        }
    }, [selectedRows, onComplete]);
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 z-[999999999999999999999999999999999999999999999999]">
            <div className="bg-white rounded-lg p-4 max-w-2xl w-full">
                <ZipLoader progress={progress} onComplete={onComplete} />
            </div>
        </div>
    );
};

export default VideoDownload;
