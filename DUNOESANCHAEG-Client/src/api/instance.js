import axios from 'axios';
import router from '@/router';
import { useAuthStore } from '@/store/auth.js'; // 🎯 .js 확장자 명시 확인!

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
});

instance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    // 스토어에 없으면 로컬 스토리지에서라도 가져오게 함
    const token = authStore.accessToken || localStorage.getItem('accessToken');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

instance.interceptors.response.use(
    (response) => response,
    (error) => {
        const { status, data } = error.response || {};

        // 404 에러(사용자 정보 없음)도 감시 대상에 추가해야 합니다.
        if (status === 401 || status === 404 || (status === 400 && data?.message === '사용자 정보를 찾을 수 없습니다.')) {
            console.warn("유효하지 않은 유저 상태 - 로그인 페이지로 이동합니다.");

            // 스토어와 로컬스토리지의 키를 통일하세요! ('accessToken' 인지 'token' 인지)
            localStorage.clear(); // 안전하게 전체 삭제 추천

            router.replace({ name: 'Login' });
            return Promise.reject(new Error('세션이 만료되어 로그인 페이지로 이동합니다.'));
        }

        return Promise.reject(error);
    }
);

export default instance;