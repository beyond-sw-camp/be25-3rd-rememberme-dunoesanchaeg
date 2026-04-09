// src/api/instance.js
import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/store/auth.js';

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

// 재발급 중인지 확인하는 플래그와 대기 중인 요청 큐
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// 1. 요청 인터셉터: 헤더에 토큰 주입
instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const token = authStore.accessToken || localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// 2. 401 발생 시 Silent Refresh 수행
instance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const authStore = useAuthStore();
        const originalRequest = error.config;

        // 401 에러이고, 이미 재시도한 요청이 아닐 때만 실행
        if (error.response?.status === 401 && !originalRequest._retry) {

            // 재발급 API 자체가 401이 나면 무한 루프 방지를 위해 로그아웃
            if (originalRequest.url.includes('/auth/reissue')) {
                authStore.logout();
                router.replace({ name: 'Login' });
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // 이미 다른 요청이 재발급 중이라면 큐에서 대기
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        return instance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // 백엔드 재발급 API 호출
                const { data } = await axios.post(
                    `${import.meta.env.VITE_API_BASE_URL}/auth/reissue`,
                    {},
                    { withCredentials: true }
                );

                const { accessToken, role, isProfileCompleted } = data.data;

                // 스토어와 로컬 스토리지dp 새 토큰 갱신
                authStore.setLoginInfo({
                    accessToken: accessToken,
                    role: role,
                    isProfileCompleted: isProfileCompleted,
                    isHighContrast: authStore.isHighContrast,
                    fontSize: authStore.fontSize
                });

                // 새 토큰 전달 후 재실행
                processQueue(null, accessToken);

                // 현재 실패했던 요청 다시 보내기
                originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                return instance(originalRequest);

            } catch (refreshError) {
                // 재발급 실패 시  로그아웃
                processQueue(refreshError, null);
                authStore.logout();
                await router.replace({name: 'Login'});
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;