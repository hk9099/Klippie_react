import React, { useState } from 'react';
import { useDrop } from 'react-dnd';
import { Paper, Typography } from '@mui/material';

const Types = {
    FILE: 'file',
};

const Dropzone = () => {
    const [isDropzoneActive, setIsDropzoneActive] = useState(false);

    const [, drop] = useDrop({
        accept: Types.FILE,
        drop: (item, monitor) => {
            // Handle the dropped files here
            const files = monitor.getItem().files;
            console.log(files);
            setIsDropzoneActive(false);
        },
        collect: (monitor) => ({
            isOver: monitor.isOver(),
        }),
    });

    const handleDragEnter = () => {
        setIsDropzoneActive(true);
    };

    const handleDragLeave = () => {
        setIsDropzoneActive(false);
    };

    return (
        <div
            ref={drop}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={(e) => e.preventDefault()} // Prevent the default behavior to allow dropping
            style={{
                height: '100vh', // Set height to 100% of viewport height
                width: '100vw',  // Set width to 100% of viewport width
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <Paper
                elevation={isDropzoneActive ? 3 : 1}
                className={`dropzone mx-auto ${isDropzoneActive ? 'border-blue-500' : 'border-gray-300'
                    }`}
            >
                <Typography variant="h5" component="div" className="p-4">
                    {isDropzoneActive ? 'Drop your file here' : 'Drag a file here to upload'}
                </Typography>
            </Paper>
        </div>
    );
};

export default Dropzone;
