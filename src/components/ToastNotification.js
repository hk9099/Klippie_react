import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

const ToastNotification = ({ type, message }) => {
  const showToast = () => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      {showToast()}
    </>
  );
};

export default ToastNotification;
