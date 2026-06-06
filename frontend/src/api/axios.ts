import axios from 'axios';

// Base instance for all API calls
const api = axios.create({
    baseURL: 'http://localhost:5000/api',
});

// Automatically attach token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;