import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import * as filestack from 'filestack-js';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);

  const apiKey = process.env.REACT_APP_FILESTACK_API_KEY;

  const openPicker = () => {
    if (!isLoading) {
      setIsLoading(true);
      const client = filestack.init(apiKey);
      const options = {
        fromSources: [
          "local_file_system",
          "url",
          "googledrive",
          "dropbox",
          "onedrive",
          "facebook",
          "instagram",
        ],
        accept: ["image/*", "video/*"],
        maxFiles: 10,
        minFiles: 1,

        onFileUploadFinished: async function (res) {
          console.log(res);
        },
        onFileUploadFailed: function (res) {
          console.log(res);
        },
        onOpen: function () {
          console.log("opened");
        },
        onClose: function () {
          setIsLoading(false);
        }
      };

      client.picker(options).open();
    }
  };

  return (
    <div className='flex flex-auto h-screen'>
      <Sidebar openPicker={openPicker} />
      <div className='grow'>
        <Navbar />
      </div>
    </div>
  );
}
