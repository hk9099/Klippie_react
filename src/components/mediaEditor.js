import React from 'react';

const CloudinaryMediaEditor = ({ publicId, startTime, endTime }) => {
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

      console.log(result, 'result');
    }
    );

    myEditor.on('export', (data) => {
      console.log('Exported data:', data);

      // Create a Blob from the exported data
      const blob = new Blob([data.data], { type: data.format });
      console.log('blob', blob);

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
      window.close();
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
