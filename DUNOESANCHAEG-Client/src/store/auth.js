// src/store/auth.js
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    // 초기값 로드 (새로고침 시에도 상태 유지)
    const accessToken = ref(localStorage.getItem('accessToken') || null);
    const role = ref(localStorage.getItem('role') || null);
    const isProfileCompleted = ref(localStorage.getItem('isProfileCompleted') === 'true');
    const isHighContrast = ref(localStorage.getItem('isHighContrast') === 'true');
    const fontSize = ref(localStorage.getItem('fontSize') || 'medium'); //

    /**
     * 로그인 정보 저장 (KakaoCallback 등에서 호출)
     */
    const setLoginInfo = (data) => {
        accessToken.value = data.accessToken;
        role.value = data.role;
        isProfileCompleted.value = data.isProfileCompleted;
        isHighContrast.value = data.isHighContrast;
        fontSize.value = data.fontSize;

        // 라우터 가드 및 API 인스턴스가 참조할 수 있도록 로컬 스토리지 동기화
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('isProfileCompleted', String(data.isProfileCompleted));
        localStorage.setItem('isHighContrast', String(data.isHighContrast));
        localStorage.setItem('fontSize', data.fontSize);

        // 즉시 UI 적용
        applyTheme(data.isHighContrast, data.fontSize);
    };

    /**
     * 로그아웃 처리
     */
    const logout = () => {
        accessToken.value = null;
        role.value = null;
        isProfileCompleted.value = false;
        isHighContrast.value = false;
        fontSize.value = 'medium';

        localStorage.clear();

        // 테마 초기화
        applyTheme(false, 'medium');
    };

    const applyTheme = (highContrast, fSize) => {
        const html = document.documentElement;
        if (highContrast) {
            html.classList.add('high-contrast');
        } else {
            html.classList.remove('high-contrast');
        }
        html.setAttribute('data-font-size', fSize);
    };

    return {
        accessToken,
        role,
        isProfileCompleted,
        isHighContrast,
        fontSize,
        setLoginInfo,
        logout,
        applyTheme
    };
});