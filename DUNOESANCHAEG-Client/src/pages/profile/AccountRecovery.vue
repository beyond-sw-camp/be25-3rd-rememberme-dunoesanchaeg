<template>
  <div class="min-h-screen bg-brand-bg p-6 flex flex-col justify-center">
    <header class="text-center mb-12">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-24 h-auto mb-6" />
      <h1 class="text-3xl font-black text-gray-800 tracking-tight">반가워요!</h1>
      <p class="text-gray-500 mt-2 text-lg font-medium">다시 만나기를 기다리고 있었어요.</p>
    </header>

    <section class="bg-gray-200 rounded-[2.5rem] p-8 shadow-inner mb-10">
      <div class="text-center space-y-4">
        <p class="text-xl font-bold text-gray-700">계정 복구 안내</p>
        <p class="text-gray-500 leading-relaxed font-medium">
          현재 회원님의 계정은 <span class="text-red-500 font-bold">탈퇴 대기</span> 상태입니다.<br/>
          지금 복구하시면 이전에 사용하던 데이터를<br/>
          <span class="text-brand-green font-black">그대로</span> 다시 사용할 수 있습니다.
        </p>
        <div class="py-2 px-4 bg-white/50 rounded-xl inline-block text-sm text-gray-400">
          * 탈퇴 신청 후 30일이 지나면 복구가 불가능합니다.
        </div>
      </div>
    </section>

    <div class="flex flex-col gap-4 px-2">
      <button
          @click="handleRecovery"
          type="button"
          class="w-full py-5! bg-brand-green! text-white! font-black! text-2xl! rounded-2xl shadow-lg active:scale-95 transition-all border-none cursor-pointer"
      >
        계정 복구하기
      </button>

      <button
          @click="handleLogout"
          type="button"
          class="w-full py-5! bg-gray-400! text-white! font-black! text-2xl! rounded-2xl shadow-lg active:scale-95 transition-all border-none cursor-pointer"
      >
        나중에 하기 (로그아웃)
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth.js';
import { showToast, showLoadingToast, closeToast } from 'vant';
import { getRoleFromToken } from '@/utils/jwtUtils.js';
import logoGreen from '@/assets/image/logo_profile.png';

const router = useRouter();
const authStore = useAuthStore();

// 계정 복구 처리 함수
const handleRecovery = async () => {
  showLoadingToast({ message: '복구 처리 중...', forbidClick: true });

  try {
    // instance를 사용하여 자동으로 토큰 및 기본 URL 처리
    const response = await instance.post('/members/me/recovery', { action: 'RESTORE' });

    if (response.data.code === 200) {
      const recoveryData = response.data.data;
      const newToken = recoveryData.accessToken;
      const isCompleted = recoveryData.isProfileCompleted;
      const newRole = getRoleFromToken(newToken);

      localStorage.setItem('accessToken', newToken);
      authStore.setLoginInfo(newToken, newRole || 'USER', isCompleted);

      closeToast();
      showToast('성공적으로 복구되었습니다. 환영합니다!');

      router.replace({ name: 'Home' });
    }
  } catch (error: any) {
    closeToast();
    console.log("복구 요청 에러 상세:", error.response);

    if (error.response?.status === 403) {
      showToast('이미 복구된 계정입니다. 보안을 위해 다시 로그인해 주세요.');

      localStorage.clear();
      authStore.logout();

      router.replace({ name: 'Login' });
      return;
    }

    const errorMessage = error.response?.data?.message || '복구에 실패했습니다.';
    showToast(errorMessage);
  }
};

const handleLogout = () => {
  localStorage.clear();
  router.replace({ name: 'Login' });
};
</script>