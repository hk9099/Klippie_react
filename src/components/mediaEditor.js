import React, { useRef } from 'react';

const CloudinaryMediaEditor = ({publicId,startTime,endTime}) => {
    const editorRef = useRef(null);
    
    const initializeEditor = () => {
      console.log(publicId,startTime,endTime);

    // Initialize the media editor
    const myEditor = window.cloudinary.mediaEditor();
    const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
    console.log(cloudName);

    // Customize the editor configuration
    myEditor.update({
      cloudName: cloudName,
      publicIds: [
        {
          publicId: publicId,
          resourceType: 'video',
        },
      ],
      video: {
        steps: ['trim'],
        trim: {
          startOffset: 10,
          endOffset: 20,
          units: 'seconds',
        },  
      },
      showAdvanced: true,
      showConsoles: true,
      showLeftMenu: true,
      showRightMenu: true,
      
    });

    // Show the editor
    myEditor.show();

  

    // Add event listeners for custom actions
    myEditor.on('export', (data) => {
      const downloadUrl = data.assets[0].downloadUrl;
    
      fetch(downloadUrl)
        .then(response => response.blob())
        .then(blob => {
          // Create a temporary anchor element to trigger the download
          const a = document.createElement('a');
          a.style.display = 'none';
    
          // Create a URL for the blob
          const videoUrl = window.URL.createObjectURL(blob);
          a.href = videoUrl;
    
          // Set the download attribute and file name
          a.download = `edited_video.${data.format}`
    
          // Trigger a click event on the anchor element to start the download
          document.body.appendChild(a);
          a.click();
    
          // Clean up the temporary anchor element
          document.body.removeChild(a);
        })
        .catch(error => {
          console.error('Error downloading video:', error);
        });
    
    });
    

    myEditor.on('import', (data) => {
      console.log('Imported data:', data);
    })

    myEditor.on('sourceChanged', (data) => {
      console.log('Source changed:', data);
    })

    myEditor.on('sourceChanging', (data) => {
      console.log('Source changing:', data);
    })

    myEditor.on('close', () => {
      // Store the editor instance in the ref
      editorRef.current = myEditor;
    });

    myEditor.on('error', (error) => {
      console.error(error);
    });  

    // Store the editor instance in the ref
    editorRef.current = myEditor;
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
