import React,{useEffect} from 'react';

const CloudinaryMediaEditor = ({ publicId, startTime, endTime }) => {

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Notify the parent component that the tab is being closed
      window.dispatchEvent(new Event('mediaEditorClosed'));
    };

    // Attach the event listener when the component mounts
    window.addEventListener('beforeunload', handleBeforeUnload);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  const initializeEditor = () => {
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    const myEditor = window.cloudinary.mediaEditor();

    myEditor.update({
      cloudName: cloudName,
      publicIds: [
        {
          publicId: 'test1698990260550',
          resourceType: 'video',
        },
      ],
      video: {
        steps: ['trim'],
        trim: {
          startOffset: 1,
          endOffset: 2,
          units: 'seconds',
        },
      },
      showAdvanced: true,
      showConsoles: true,
      showLeftMenu: true,
      showRightMenu: true,
    });

    myEditor.show();

    myEditor.on('save', (result) => { 
      if (process.env.NODE_ENV === 'development') {
      console.log(result, 'result');
      }
    }
    );

    myEditor.on('export', (data) => {
      if (process.env.NODE_ENV === 'development') {
      console.log('Exported data:', data);
      }
      // Create a Blob from the exported data
      const blob = new Blob([data.data], { type: data.format });
      if (process.env.NODE_ENV === 'development') {
      console.log('blob', blob);
      }
      // Create an object URL for the Blob
      const url = URL.createObjectURL(blob);

      // Create a download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'edited_video.' + data.format; // Specify the desired filename

      // Trigger a click event on the download link to start the download
      downloadLink.click();

      // Clean up the object URL after the download link is clicked
      URL.revokeObjectURL(url);

      // Close the tab when the download starts
      // window.close();
    });

    myEditor.on('close', () => {
    });
  };

  const openEditor = () => {
    initializeEditor();
  };

  return (
    <div>
      <button onClick={openEditor}>Open Editor</button>
    </div>
  );
};

export default CloudinaryMediaEditor;
