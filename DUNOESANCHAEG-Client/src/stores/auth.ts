import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
    const accessToken = ref<string | null>(null);
    const userRole = ref<string | null>(null);
    const isProfileCompleted = ref<boolean>(localStorage.getItem('isProfileCompleted') === 'true');

    const setLoginInfo = (token: string, role: string, completed: boolean) => {
        accessToken.value = token;
        userRole.value = role;
        isProfileCompleted.value = completed;
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