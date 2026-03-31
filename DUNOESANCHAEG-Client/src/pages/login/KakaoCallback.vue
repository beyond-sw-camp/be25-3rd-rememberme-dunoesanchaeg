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
import axios from 'axios';
import { getRoleFromToken } from '../../utils/jwtUtils'; // 🎯 직접 만든 유틸리티 임포트

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code;

  if (code) {
    try {
      // 1. 카카오 인증 코드를 백엔드로 전송
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/kakao-auth`, {
        code: code
      });

      // 🎯 백엔드 응답 데이터 추출 (이 시점에 데이터가 생성됩니다)
      const loginData = response.data.data;
      const token = loginData.accessToken;
      const isProfileCompleted = loginData.isProfileCompleted;

      if (token) {
        // 2. 로컬 스토리지에 토큰 저장
        localStorage.setItem('token', token);

        // 3. 🎯 토큰에서 직접 Role 추출하여 저장
        const role = getRoleFromToken(token);
        if(role){
          localStorage.setItem('userRole', role);
          localStorage.setItem('isProfileCompleted', String(isProfileCompleted));
        }else {
          console.error("role 정보 가져오기 실패");
        }

        // 4. 권한 및 프로필 상태에 따른 페이지 리다이렉트 (우선순위 중요!)
        if (role === 'WITHDRAWN') {
          // 탈퇴 상태라면 무조건 복구 페이지로
          showToast('탈퇴 신청 계정입니다. 복구를 진행해주세요.');
          router.replace({ name: 'AccountRecovery' });
        } else if (!isProfileCompleted) {
          // 탈퇴가 아니고 프로필이 미완성이라면
          showToast('추가 정보 입력이 필요합니다.');
          router.replace({ name: 'ProfileComplete' });
        } else {
          // 모든 조건을 통과한 일반 유저
          showToast('반갑습니다!');
          router.replace({ name: 'Home' });
        }
      }
    } catch (error) {
      console.error("로그인 처리 실패:", error);
      showToast('로그인에 실패했습니다.');
      router.replace({ name: 'Login' });
    }
  }
});
</script>

<style scoped>

</style>