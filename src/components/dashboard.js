import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import * as filestack from 'filestack-js';

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(false);
  const [isDropPaneOpen, setIsDropPaneOpen] = useState(true);
  const apiKey = process.env.REACT_APP_FILESTACK_API_KEY;

  useEffect(() => {
    const handleDrop = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isLoading) {
        setIsLoading(true);
        const client = filestack.init(apiKey);
        client.picker({
          displayMode: 'dropPane',
          container: '.App',
          fromSources: ['local_file_system', 'url', 'googledrive', 'dropbox'],
          accept: ['image/*', 'video/*'],
          maxFiles: 1,
          minFiles: 1,
        }).open();


        const files = event.dataTransfer.files;
        client.upload(files[0])
          .then(data =>
            console.log(data),
            setIsLoading(false)
            //reset the drop pane
          )
          .catch(err =>
            console.log(err),
            setIsLoading(false)
          );
      }
    };

    const handleDragEnter = (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!isDropPaneOpen) {
        setIsDropPaneOpen(true);
      }
    };

    const handleDragLeave = () => {
      setIsDropPaneOpen(false);
    };

    const rootElement = document.getElementById('root');
    rootElement.addEventListener('dragenter', handleDragEnter);
    rootElement.addEventListener('dragleave', handleDragLeave);
    rootElement.addEventListener('dragover', (event) => {
      event.preventDefault();
      event.stopPropagation();
    });
    rootElement.addEventListener('drop', handleDrop);

    return () => {
      rootElement.removeEventListener('dragenter', handleDragEnter);
      rootElement.removeEventListener('dragleave', handleDragLeave);
      rootElement.removeEventListener('dragover', (event) => {
        event.preventDefault();
        event.stopPropagation();
      });
      rootElement.removeEventListener('drop', handleDrop);
    };
  }, [isLoading, apiKey, isDropPaneOpen]);

  const openPicker = () => {
    if (!isLoading) {
      setIsLoading(true);
      const client = filestack.init(apiKey);
      client.picker({
        displayMode: 'overlay',
        container: '.App',
        fromSources: ['local_file_system', 'googledrive', 'dropbox','instagram','facebook'],
        accept: [ 'video/*'],
        maxFiles: 1,
        minFiles: 1,
        onFileUploadFailed: function (res) {
          console.log(res, 'failed');
        },
        onOpen: function () {
          console.log("opened");
        },
        onClose: function () {
          setIsLoading(false);
        },
        onFileUploadFinished: async function (res) {
          console.log(res , 'finished');
        },
      }).open();
    }
  };

  return (
    <div className='flex flex-auto h-screen'>
      <Sidebar openPicker={openPicker} />
      <div className='grow'>
        <Navbar />
        <div className='App' id='root'>
          {/* Add other components/content here */}
        </div>
      </div>
    </div>
  );
}