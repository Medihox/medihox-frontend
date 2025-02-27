import toast, { Toast, ToastOptions } from 'react-hot-toast';

// Custom toast functions with consistent styling
export const showSuccessToast = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#10B981',
      color: '#fff',
    },
    ...options,
  });
};

export const showErrorToast = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    duration: 4000,
    position: 'top-right',
    style: {
      background: '#EF4444',
      color: '#fff',
    },
    ...options,
  });
};

export const showInfoToast = (message: string, options?: ToastOptions) => {
  return toast(message, {
    duration: 3000,
    position: 'top-right',
    style: {
      background: '#3B82F6',
      color: '#fff',
    },
    ...options,
  });
};

// Default export for backward compatibility
export default {
  success: showSuccessToast,
  error: showErrorToast,
  info: showInfoToast,
}; 