import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [videoURL, setVideoURL] = useState('');
    const [fileInfo, setFileInfo] = useState(null);
    const [error, setError] = useState(null);

    const handleDownload = async () => {
//         const fileUrl = "http://localhost:4000/proxy"; // Point to your proxy server

// const processFile = async (fileUrl) => {
//   const response = await fetch(fileUrl);
//   if (!response.ok) {
//     console.error("Failed to fetch the file");
//     return;
//   }

//   const fileBlob = await response.blob();
//   const fileSize = fileBlob.size;

//   console.log("File size:", fileSize);
// };

// processFile(fileUrl);


        try {
            const response = await axios.post('http://localhost:4000/download', { URL: videoURL }, {

                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log(response);
            const file = response.data.data.formats[13].url
            console.log(file, 'file');

          

            const processFile = async (file) => {
                const response = await fetch(file);
                if (!response.ok) {
                    console.error("Failed to fetch the file");
                    return;
                }

                const fileBlob = await response.blob();
                const fileSize = fileBlob.size;

                console.log("File size:", fileSize);

                // Set your cloud name and unsigned upload preset here:
                const YOUR_CLOUD_NAME = "delkyf33p";
                const YOUR_UNSIGNED_UPLOAD_PRESET = "klippie";

                const POST_URL = `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/auto/upload`;

                const XUniqueUploadId = +new Date();
                const sliceSize = 5 * 1024 * 1024; // Send chunks of 50MB
                let start = 0;

                // Calculate the total number of chunks
                const totalChunks = Math.ceil(file.size / sliceSize);
                console.log(totalChunks);
                while (start < file.size) {
                    const end = Math.min(start + sliceSize, file.size);
                    const chunk = file.slice(start, end);
                    console.log(chunk);
                    await sendChunk(chunk, start, end - 1, file.size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET, totalChunks);
                    start = end;
                }
            };

            const sendChunk = async (chunk, start, end, size, XUniqueUploadId, POST_URL, YOUR_CLOUD_NAME, YOUR_UNSIGNED_UPLOAD_PRESET) => {
                // console.log(`bytes ${start}-${end}/${size}`)
                const formdata = new FormData();
                formdata.append("file", chunk);
                formdata.append("cloud_name", YOUR_CLOUD_NAME);
                formdata.append("upload_preset", YOUR_UNSIGNED_UPLOAD_PRESET);
                formdata.append("public_id", "test" + XUniqueUploadId);

                const headers = {
                    "X-Unique-Upload-Id": XUniqueUploadId,
                    "Content-Range": `bytes ${start}-${end}/${size}`,
                };

                try {
                    const response = await fetch(POST_URL, {
                        method: "POST",
                        headers,
                        body: formdata,
                    });

                    console.log(response);

                    if (response.ok) {
                        const responseData = await response.json();
                        console.log(responseData);
                    } else {
                        console.error(`Failed to upload chunk ${start}-${end}`);
                        console.error(await response.text());
                    }
                } catch (error) {
                    console.error(`Error uploading chunk ${start}-${end}: ${error.message}`);
                }
            };

            processFile(file);

        } catch (error) {
            console.error('Network error:', error.message);
            setError('Network error. Please try again later.');
        }
    };


    return (
        <div>
            <h1>YouTube Video Downloader</h1>
            <div>
                <label>YouTube Video URL:</label>
                <input type="text" value={videoURL} onChange={(e) => setVideoURL(e.target.value)} />
            </div>
            <div>
                <button onClick={handleDownload}>Download Video</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
};

export default App;





// import React, { useState, useEffect } from 'react';

// const AudioInfoComponent = () => {
//   const [url, setUrl] = useState(''); // State to store the URL input
//   const [duration, setDuration] = useState(null);
//   const [size, setSize] = useState(null);

//   const fetchData = async () => {
//     try {
//       const response = await fetch(url);
//       const blob = await response.blob();
      
//       // Getting size from the blob
//       const fileSize = blob.size;
//       setSize(fileSize);

//       // Creating an audio element to get duration
//       const audioElement = new Audio();
//       audioElement.src = URL.createObjectURL(blob);
//       audioElement.addEventListener('loadedmetadata', () => {
//         // Getting duration from the audio element
//         const audioDuration = audioElement.duration;
//         setDuration(audioDuration);
//       });
//     } catch (error) {
//       console.error('Error fetching data:', error);
//     }
//   };

//   useEffect(() => {
//     // Fetch data when the component mounts or when the URL changes
//     if (url) {
//       fetchData();
//     }
//   }, [url]);

//   return (
//     <div>
//       <label>
//         Enter audio URL:
//         <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} />
//       </label>
//       <button onClick={fetchData}>Fetch Data</button>

//       {duration !== null && <p>Duration: {duration.toFixed(2)} seconds</p>}
//       {size !== null && <p>Size: {size} bytes</p>}
//     </div>
//   );
// };

// export default AudioInfoComponent;
