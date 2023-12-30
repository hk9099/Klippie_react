import React from 'react';
import toast, { Toaster, ToastBar } from 'react-hot-toast';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { CloseButton } from '@mantine/core';

const ToastNotification = ({ type, message }) => {
  const showToast = () => {
    switch (type) {
      case 'success':
        toast.custom((t) => (
          <MantineProvider>
            <div className="bg-white p-4 rounded-md shadow-md w-auto d-flex border-l-8 border-green-500 flex items-center justify-between font-monospace">
              <div className="text-green-600">
                {message}
              </div>
              <CloseButton size="lg"
              styles={{
                root: {
                  marginLeft: '10px',
                },
              }}
                onClick={() => toast.remove(t.id)}
              />
            </div>
          </MantineProvider>
        ), {
          duration: Infinity,
        });
        break;
      case 'error':
        toast.custom((t) => (
          <MantineProvider>
          <div className="bg-white p-4 rounded-md shadow-md w-auto d-flex border-l-8 border-red-500 flex items-center justify-between font-monospace">
            <div className="text-red-600">{message}</div>
            <CloseButton size="lg"
            styles={{
              root: {
                marginLeft: '10px',
              },
            }}
                onClick={() => toast.remove(t.id)}
              />
          </div>
          </MantineProvider>
        ), {
          duration: Infinity,
        });
        break;
      case 'info':
        toast.custom((t) => (
          <MantineProvider>
          <div className="bg-white p-4 rounded-md shadow-md w-auto d-flex border-l-8 border-blue-500 flex items-center justify-between font-monospace">
            <div className="text-blue-600">{message}</div>
            <CloseButton size="lg"
            styles={{
              root: {
                marginLeft: '10px',
              },
            }}
                onClick={() => toast.remove(t.id)}
              />
          </div>
          </MantineProvider>
        ), {
          duration: Infinity,
        });
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Toaster position="top-right"
      />
      {showToast()}
    </>
  );
};

export default ToastNotification;

