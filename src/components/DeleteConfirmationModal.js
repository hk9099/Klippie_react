import React from "react";
import { RxCross2 } from "react-icons/rx";
import { FaCheckCircle } from "react-icons/fa";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Code } from '@mantine/core';

function ConfirmationModal({ show, onConfirm, onCancel, projectName }) {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 bottom-0 right-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <MantineProvider>
      <div className="bg-gray-800 w-full max-w-md p-6 rounded-lg border shadow-lg z-50 border-gray-700 text-white">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Confirmation</h2>
          <RxCross2 className="text-2xl cursor-pointer" onClick={onCancel} />
        </div>
        <p className="text-gray-300 mb-4">
          <span className="block select-none text-sm"> Are you sure you want to delete the project  </span>
          <Code 
          styles={{
            root: {
              color: 'white',
              fontWeight: 800,
              fontSize: '0.9rem',
              backgroundColor: '#f87171',
            },
          }}
          >{projectName}</Code>
          <span className="block select-none text-sm">After deleting, you will not be able to recover this Project.</span>
          
        </p>
        <div className="flex justify-end">
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 flex items-center"
          >
            <FaCheckCircle className="mr-2" />
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-500 text-white rounded-md hover-bg-gray-600 ml-2"
          >
            Cancel
          </button>
        </div>
      </div>
      </MantineProvider>
    </div>
  );
}

export default ConfirmationModal;
