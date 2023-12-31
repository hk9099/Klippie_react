import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { IoMdCloudUpload } from 'react-icons/io';
// import { useNavigate } from 'react-router-dom';
// import { useUserNickname } from '../components/userNicknameContext.js';
import { useCloudinary } from '../context/CloudinaryContext.js';
import { Progress } from 'react-sweet-progress';
// import { useClipsFoundStatus } from '../components/ClipsFoundContext.js';
import { TokenManager } from '../components/getToken.js';
// import PopupForm from '../components/sessionPopup.js';
import axios from 'axios';
import { Tooltip } from 'react-tooltip';
import ToastNotification from "../components/ToastNotification";
import { Toaster } from 'react-hot-toast';

function MyProgressBar({ bytesUploaded, totalBytes }) {
  const percent = Math.round((bytesUploaded / totalBytes) * 100) || 0;

  return (
    <Progress
      percent={percent}
      type="line"
      status="success"
      percentage={true}
      className="custom-progress"
      theme={{
        error: {
          symbol: percent + '%',
          trailColor: 'pink',
          color: 'red'
        },
        default: {
          symbol: percent + '%',
          trailColor: 'lightblue',
          color: 'blue'
        },
        active: {
          symbol: percent + '%',
          trailColor: 'yellow',
          color: 'orange'
        },
        success: {
          symbol: percent + '%',
          trailColor: '#ACDF87',
          color: 'green'
        }
      }}
    />
  );
}
const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 6,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dotted',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
};

const focusedStyle = {
  borderColor: '#2196f3',
};

const acceptStyle = {
  borderColor: '#00e676',
};

const rejectStyle = {
  borderColor: '#ff1744',
};

function DragDropModal() {
  const [acceptedFiles, setAcceptedFiles] = useState([]); // State to store accepted files
  const [inputText, setInputText] = useState('');
  const { setCloudinaryResponse } = useCloudinary();
  const [isFileUploaded, setIsFileUploaded] = useState();
  const [isFileUploadedInput, setIsFileUploadedInput] = useState();
  const [isFirstChunkLogged, setIsFirstChunkLogged] = useState(false);
  const [isNewVideoUpload, setIsNewVideoUpload] = useState(false);
  const [bytesUploaded, setBytesUploaded] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [disabled, setDisabled] = useState(true);
  // var loginCount = localStorage.getItem('loginCount');
  const userToken = TokenManager.getToken()[1]


  const onDrop = (acceptedFiles, rejectedFiles) => {
    setAcceptedFiles(acceptedFiles);
    if (acceptedFiles.length > 0) {
      // Files were accepted, show a success notification
      console.log('Accepted files:', acceptedFiles[0].name);

      const file = acceptedFiles[0];
      console.log(file, 'file');

      if (file) {
        // Create a video element to read the video file
        const videoElement = document.createElement('video');
        videoElement.src = URL.createObjectURL(file);
        console.log(file.size, 'file.size');

        // When the video metadata is loaded, get the duration
        videoElement.onloadedmetadata = async () => {
          const duration = Math.floor(videoElement.duration);
          console.log('Video Duration:', duration, 'seconds');
          // const size = file.size;
          //convert bytes to mb
          const size = file.size / 1048576;
          console.log(size, 'size');
          if (duration > 7200) {
            ToastNotification({ type: 'error', message: 'Only files less than 2 hours are allowed.' });
            setAcceptedFiles([]);
            return;
          } else if (size > 2e+9) {
            ToastNotification({ type: 'error', message: 'Only files less than 2GB are allowed.' });
            setAcceptedFiles([]);
            return;
          }
          let data = JSON.stringify({
            "seconds": duration,
            "size": size
          });
          console.log(data, 'dataaaaaaaaaaaaaaaa');
          let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://dev-api.getklippie.com/v1/project/project-eligibility',
            headers: {
              'accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userToken}`
            },
            data: data
          };

          try {
            const response = await axios.request(config);
            console.log(response, 'response');
            processFile(file);
            setIsFileUploadedInput(true);
            ToastNotification({ type: 'loading', message: `uploading ${acceptedFiles[0].name}!` });
          } catch (error) {
            setAcceptedFiles([]);
            ToastNotification({ type: 'error', message: error.response.data.error });
          }
        };
        // Clean up the video element
        videoElement.remove();
      }
    }

    if (rejectedFiles.length > 0) {
      ToastNotification({ type: 'error', message: `File ${rejectedFiles[0].name} was rejected.` });
      console.log('Rejected files:', rejectedFiles);
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'audio/mp3': ['.mp3'],
      'video/mp4': ['.mp4'],
    }
  });

  const style = {
    ...baseStyle,
    ...(isDragActive ? focusedStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  };

  const handleInputClick = event => {
    event.stopPropagation();
  };

  const handleSubmit = () => {
    // console.log("Input Text Value: " + inputText);
    setInputText('');
  };

  const processFile = async (file) => {
    // Set your cloud name and unsigned upload preset here:
    const YOUR_CLOUD_NAME = "delkyf33p";
    const YOUR_UNSIGNED_UPLOAD_PRESET = "klippie";

    const POST_URL = `https://api.cloudinary.com/v1_1/${YOUR_CLOUD_NAME}/auto/upload`;

    const XUniqueUploadId = +new Date();
    const sliceSize = 5 * 1024 * 1024; // Send chunks of 50MB
    let start = 0;

    // Calculate the total number of chunks
    const totalChunks = Math.ceil(file.size / sliceSize);

    while (start < file.size) {
      const end = Math.min(start + sliceSize, file.size);
      const chunk = file.slice(start, end);
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

      if (response.ok) {
        const responseData = await response.json();
        console.log(responseData);
        if (start === 0 && !isFirstChunkLogged) {
          setIsFirstChunkLogged(true);
        }

        if (isNewVideoUpload) {
          setIsNewVideoUpload(false);
        }
        setBytesUploaded(end + 1);
        setTotalBytes(size);

        if (end + 1 === size) {
          console.log(responseData);
          setIsFileUploaded(false);
          setIsFileUploadedInput(false);
          setBytesUploaded(0);
          setTotalBytes(0);
          setIsFirstChunkLogged(false);
          setCloudinaryResponse(responseData);
        }


      } else {
        console.error(`Failed to upload chunk ${start}-${end}`);
        console.error(await response.text());
      }
    } catch (error) {
      console.error(`Error uploading chunk ${start}-${end}: ${error.message}`);
    }
  };

  return (
    <div className="flex justify-center items-center h-[85vh]">
      <Toaster />
      <div {...getRootProps()} style={style} className="dropzone w-[80%] h-[80%] cursor-pointer flex flex-col justify-center items-center px-[100px!important] py-[50px!important] rounded-lg">
        <input {...getInputProps()} />
        <IoMdCloudUpload className="text-8xl text-white" />
        <h1 className="text-4xl font-bold w-[400px] text-center text-white select-none">
          Drag and drop file here
        </h1>
        <p className="text-3xl font-bold w-[400px] text-center text-white mb-4 select-none">
          or
        </p>
        <button className="bg-red-700 hover:bg-red-500 text-white font-bold py-1 px-4 text-sm rounded-lg ml-3 mb-5">
          Upload
        </button>
        <div className="flex justify-center items-center select-none" onClick={handleInputClick} data-tooltip-id={disabled ? "inputdisabled" : null}>
          <span className="text-md font-semibold text-center text-gray-500 mr-2 font-ubuntu select-none" >
            Paste YouTube Link :
          </span>
          <input
            className={`border border-gray-300 dark:bg-[#ffffff2a] px-2 py-1 rounded-lg text-sm focus:outline-none text-white font-ubuntu ${disabled ? 'bg-gray-500 cursor-not-allowed' : 'bg-gray-700'}`}
            type="text"

            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            disabled={disabled}
          />
          <Tooltip id="inputdisabled" content="This feature is coming soon"
            place="bottom"
            className="dark:custom-modal-bg-color dark:text-gray-300 font-semibold text-[2xl!important] font-ubuntu "
            opacity={1}
            style={{ backgroundColor: '#B3B5E2', color: '#020913' }}
          />
          <button className="bg-blue-700 hover:bg-blue-700 text-white font-bold py-1 px-4 text-xs rounded ml-3" onClick={handleSubmit}>
            Submit
          </button>
        </div>
        {acceptedFiles.length > 0 && (
          <div className="mt-4 select-none" onClick={handleInputClick}>
            <hr className="mb-4" />
            <ul className="list-inside text-white">
              {acceptedFiles.map((file) => (
                <li key={file.path} className="text-sm">
                  {file.path} - {(file.size / 1048576).toFixed(2)} MB
                </li>
              ))}
            </ul>
          </div>
        )}
        {isFileUploadedInput || isFileUploaded ? (
          <>
            <div className="text-white w-full text-center font-ubuntu font-semibold flex justify-center items-center">
              <MyProgressBar bytesUploaded={bytesUploaded} totalBytes={totalBytes} />
              {/* <div className="text-white text-center font-ubuntu font-semibold">
                            {(bytesUploaded / 1048576).toFixed(2)}&nbsp;/&nbsp;{(totalBytes / 1048576).toFixed(2)}&nbsp;MB
                        </div> */}
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default DragDropModal;