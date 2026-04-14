// src/store/auth.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useSettingsStore } from './settings';

export const useAuthStore = defineStore('auth', () => {
    // 초기값 로드 (새로고침 시에도 상태 유지)
    const accessToken = ref(localStorage.getItem('accessToken') || null);
    const role = ref(localStorage.getItem('role') || null);
    const username = ref(localStorage.getItem('username') || null);
    const isProfileCompleted = ref(localStorage.getItem('isProfileCompleted') === 'true');
    const isHighContrast = ref(localStorage.getItem('isHighContrast') === 'true');
    const fontSize = ref(localStorage.getItem('fontSize') || 'medium'); //

    // 고대비, 폰트 세팅
    const settings = useSettingsStore();


    settings.initSettings(fontSize.value, isHighContrast.value);


    // 로그인 정보 저장 (KakaoCallback 등에서 호출)
    const setLoginInfo = (data) => {
        accessToken.value = data.accessToken;
        role.value = data.role;
        username.value = data.username;
        isProfileCompleted.value = !!data.isProfileCompleted;
        isHighContrast.value = !!data.isHighContrast ?? false;
        fontSize.value = data.fontSize ?? 'medium';

        // 라우터 가드 및 API 인스턴스가 참조할 수 있도록 로컬 스토리지 동기화
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('role', data.role);
        localStorage.setItem('username', data.username || '');
        localStorage.setItem('isProfileCompleted', String(data.isProfileCompleted));
        localStorage.setItem('isHighContrast', String(data.isHighContrast));
        localStorage.setItem('fontSize', data.fontSize);

        // 즉시 UI 적용
        settings.initSettings(data.fontSize, data.isHighContrast);
    };

    // 로그아웃 처리
    const logout = () => {
        accessToken.value = null;
        role.value = null;
        username.value = null;
        isProfileCompleted.value = false;
        isHighContrast.value = false;
        fontSize.value = 'medium';

        settings.initSettings(fontSize.value, isHighContrast.value);

        localStorage.clear();

    };

    // 로그인 유도 모달 상태 
    const isLoginModalVisible = ref(false);

    const openLoginModal = () => { isLoginModalVisible.value = true; };
    const closeLoginModal = () => { isLoginModalVisible.value = false; };

    return {
        accessToken,
        role,
        username,
        isProfileCompleted,
        isHighContrast,
        fontSize,
        isLoginModalVisible,
        setLoginInfo,
        logout,
        openLoginModal,
        closeLoginModal
    };
});