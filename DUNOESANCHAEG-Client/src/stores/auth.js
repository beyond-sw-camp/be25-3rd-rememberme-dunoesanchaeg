import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * 사용자 인증 및 권한 상태를 관리하는 스토어
 */
export const useAuthStore = defineStore('auth', () => {
    // 1. 상태 변수 (반응형 데이터)
    // AccessToken과 Role은 보안을 위해 메모리(Pinia)에만 유지합니다.
    const accessToken = ref(null);
    const userRole = ref(null);

    // 프로필 완료 여부는 새로고침 시에도 유지되도록 로컬스토리지에서 가져옵니다.
    const isProfileCompleted = ref(localStorage.getItem('isProfileCompleted') === 'true');

    /**
     * 로그인 성공 시 유저 정보를 한 번에 업데이트하는 함수
     * @param {string} token - JWT 액세스 토큰
     * @param {string} role - 유저 권한 (USER, WITHDRAWN 등)
     * @param {boolean} completed - 프로필 작성 완료 여부
     */
    const setLoginInfo = (token, role, completed) => {
        accessToken.value = token;
        userRole.value = role;
        isProfileCompleted.value = completed;

        // 새로고침 시 가드 체크를 위해 로컬스토리지에 저장
        localStorage.setItem('isProfileCompleted', String(completed));
    };

    /**
     * 로그아웃 시 모든 상태와 저장된 데이터를 초기화하는 함수
     */
    const logout = () => {
        accessToken.value = null;
        userRole.value = null;
        isProfileCompleted.value = false;

        // 로컬스토리지의 모든 데이터 삭제 (토큰, 설정 등)
        localStorage.clear();
    };

    return {
        accessToken,
        userRole,
        isProfileCompleted,
        setLoginInfo,
        logout
    };
});