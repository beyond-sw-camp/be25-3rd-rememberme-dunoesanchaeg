// src/store/auth.js
import { defineStore } from 'pinia'; // 🎯 이 줄이 빠져서 에러가 난 것입니다!
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // 초기값 로드 (새로고침 시에도 상태 유지)
    const token = ref(localStorage.getItem('token') || null);
    const role = ref(localStorage.getItem('role') || null);
    const isProfileCompleted = ref(localStorage.getItem('isProfileCompleted') === 'true');

    /**
     * 로그인 정보 저장 (KakaoCallback 등에서 호출)
     */
    const setLoginInfo = (newToken, newRole, completed) => {
        token.value = newToken;
        role.value = newRole;
        isProfileCompleted.value = completed;

        // 라우터 가드 및 API 인스턴스가 참조할 수 있도록 로컬 스토리지 동기화
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        localStorage.setItem('isProfileCompleted', String(completed));
    };

    /**
     * 로그아웃 처리
     */
    const logout = () => {
        token.value = null;
        role.value = null;
        isProfileCompleted.value = false;

        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('isProfileCompleted');
    };

    return {
        token,
        role,
        isProfileCompleted,
        setLoginInfo,
        logout
    };
});