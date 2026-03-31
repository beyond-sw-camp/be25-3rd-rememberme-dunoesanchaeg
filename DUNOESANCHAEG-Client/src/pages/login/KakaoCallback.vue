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
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { AxiosError } from 'axios'; // 🎯 Axios 에러 타입 임포트
import instance from '@/api/instance';
import { useAuthStore } from '@/stores/auth';
import { getRoleFromToken } from '@/utils/jwtUtils';

/* 🎯 백엔드 공통 응답 규격 정의 (JwtFilter.java 참고) */
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

  if (code) {
    try {
      const response = await instance.post('/auth/kakao-auth', { code });
      const loginData = response.data.data;
      const token = loginData.accessToken;
      const isCompleted = loginData.isProfileCompleted; //

      if (token) {
        const role = getRoleFromToken(token);

        if (role) {
          /* 🎯 스토어에 모든 로그인 정보 통합 저장 */
          authStore.setLoginInfo(token, role, isCompleted);

          // 권한 및 상태에 따른 분기 (우선순위: 탈퇴 > 프로필 미완료 > 홈)
          if (role === 'WITHDRAWN') {
            showToast('탈퇴 신청 계정입니다. 복구를 진행해주세요.');
            router.replace({ name: 'AccountRecovery' });
          } else if (!authStore.isProfileCompleted) {
            showToast('추가 정보 입력이 필요합니다.');
            router.replace({ name: 'ProfileComplete' });
          } else {
            showToast('반갑습니다!');
            router.replace({ name: 'Home' });
          }
        }
      }
    } catch (error) {
      /* 🎯 에러 타입 구체화 (any 제거) */
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message || '로그인 중 오류가 발생했습니다.';

      console.error("로그인 에러:", errorMessage);
      showToast(errorMessage);
      router.replace({ name: 'Login' });
    }
  }
});
</script>