import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const userRole = ref<string | null>(null);
    /* 🎯 프로필 완료 상태를 반응형으로 관리 */
    const isProfileCompleted = ref<boolean>(localStorage.getItem('isProfileCompleted') === 'true');

    const setLoginInfo = (token: string, role: string, completed: boolean) => {
        accessToken.value = token;
        userRole.value = role;
        isProfileCompleted.value = completed;

        // 지속성을 위해 로컬스토리지 동기화 (새로고침 대비)
        localStorage.setItem('isProfileCompleted', String(completed));
    };

    const logout = () => {
        accessToken.value = null;
        userRole.value = null;
        isProfileCompleted.value = false;
        localStorage.clear();
    };

    return { accessToken, userRole, isProfileCompleted, setLoginInfo, logout };
});