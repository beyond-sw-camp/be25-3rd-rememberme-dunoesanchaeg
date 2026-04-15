<template>
  <div class="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 text-center">
    <div class="space-y-6">
      <van-loading size="32px" vertical color="#2D7A36" text-size="16px" class="font-bold">
        로그인 처리 중...
      </van-loading>
      <p class="text-gray-500 text-sm font-medium leading-relaxed">
        카카오 인증을 확인하고 있습니다.<br />
        잠시 후 두뇌산책 홈으로 이동합니다.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading as VanLoading, showToast } from 'vant';
import { onMounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AxiosError } from 'axios';
import instance from '@/api/instance.js';
import { useAuthStore } from '@/store/auth.js';
import { getRoleFromToken } from '@/utils/jwtUtils.js';

interface ApiErrorResponse {
  status: number;
  message: string;
  data: null;
}

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  const code = route.query.code;
  if (!code) {
    await router.replace({ name: 'Login' });
    return;
  }

  console.log("카카오 인가 코드 확인됨");

  authStore.logout(); // Pinia 스토어 및 localStorage 초기화
  delete instance.defaults.headers.common['Authorization']; // Axios 글로벌 헤더 초기화

  try {
    // 1. 백엔드에 인가 코드 전달 및 토큰 발급 요청
    const response = await instance.post('/auth/kakao-auth', { code });
    const loginData = response.data.data; //

    if (!loginData || !loginData.accessToken) {
      throw new Error("서버 응답에 토큰이 포함되어 있지 않습니다.");
    }

    const {
      accessToken,
      name: username,
      isProfileCompleted,
      isHighContrast,
      fontSize
    } = loginData;

    const role = getRoleFromToken(accessToken);
    console.log("획득된 역할(Role):", role);

    if (role) {
      // 스토어와 로컬 스토리지를 즉시 업데이트
      // setLoginInfo 내부에서 localStorage.setItem이 실행
      authStore.setLoginInfo({
        accessToken: accessToken,
        role: role,
        username: username,
        isProfileCompleted: isProfileCompleted,
        isHighContrast: isHighContrast,
        fontSize: fontSize
      });

      // 로컬 스토리지에 한 번 더 저장
      localStorage.setItem('accessToken', accessToken);

      await nextTick();

      // 2. 분기 처리 및 이동
      if (role === 'WITHDRAWN') {
        showToast('탈퇴 신청 계정입니다.');
        await router.replace({ name: 'AccountRecovery' });
      } else if (!isProfileCompleted) {
        showToast('추가 정보 입력이 필요합니다.');
        await router.replace({ name: 'ProfileComplete' });
      } else {
        showToast('반갑습니다!');
        await router.replace({ name: 'Home' });
      }
    } else {
      throw new Error("유효하지 않은 토큰 역할입니다.");
    }
  } catch (error) {
    console.error("로그인 처리 실패:", error);
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const errorMessage = axiosError.response?.data?.message || '로그인 중 오류가 발생했습니다.';
    showToast(errorMessage);
    await router.replace({ name: 'Login' });
  }
});
</script>