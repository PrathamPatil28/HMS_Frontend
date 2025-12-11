import axios, { InternalAxiosRequestConfig, AxiosError } from 'axios';

// ✅ Automatically use environment-based URL
const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:9000',
    timeout: 10000, // 10s timeout to prevent hanging requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// ✅ Request interceptor to attach JWT
axiosInstance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = sessionStorage.getItem('token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('Request Interceptor Error:', error);
        return Promise.reject(error);
    }
);

// ✅ Response interceptor for handling token expiry or unauthorized access
axiosInstance.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            console.warn('Session expired or unauthorized access.');
            sessionStorage.removeItem('token');
            window.location.href = '/login'; // redirect to login page
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
