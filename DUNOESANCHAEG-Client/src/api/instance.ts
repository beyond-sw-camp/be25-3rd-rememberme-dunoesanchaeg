import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true, // 🎯 중요: 쿠키를 주고받기 위해 설정
});

instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    if (authStore.accessToken) {
        config.headers.Authorization = `Bearer ${authStore.accessToken}`; //
    }
    return config;
});