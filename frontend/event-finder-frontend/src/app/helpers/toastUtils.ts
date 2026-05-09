import { toast, Bounce } from 'react-toastify';

const toastConfig = {
    position: "top-right" as const,
    autoClose: 4000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light" as const,
    transition: Bounce,
};

export const showSuccess = (message: string) => {
    toast.success(message, toastConfig);
};

export const showError = (message: string) => {
    toast.error(message, toastConfig);
};

export const showInfo = (message: string) => {
    toast.info(message, toastConfig);
};

export const showWarning = (message: string) => {
    toast.warning(message, toastConfig);
};