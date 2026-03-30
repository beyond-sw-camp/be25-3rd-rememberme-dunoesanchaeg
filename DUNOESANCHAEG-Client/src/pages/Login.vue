<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-[--color-brand-bg] p-6">
    <div class="text-center mb-10">
      <h1 class="text-3xl font-bold text-[--color-brand-green] mb-2">Brainwalk</h1>
      <p class="text-gray-600">두뇌 건강을 위한 산책을 시작하세요</p>
    </div>

    <van-button 
      block 
      round
      class="!bg-[#FEE500] !border-none !text-[#3C1E1E] font-bold h-14"
      @click="loginWithKakao"
    >
      <div class="flex items-center justify-center gap-2">
        <span class="text-lg">카카오로 로그인</span>
      </div>
    </van-button>
  </div>
</template>

<script setup>
const loginWithKakao = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;
  
  // 카카오 인증 페이지로 이동
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};
</script>