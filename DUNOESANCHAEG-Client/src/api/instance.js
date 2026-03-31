import axios from 'axios';
import { useAuthStore } from '@/stores/auth.js'; // 🎯 .js 확장자 명시 확인!

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`;
    }

    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;