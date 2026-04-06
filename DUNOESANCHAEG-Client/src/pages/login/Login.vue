<template>
  <div class="min-h-screen bg-brand-bg flex items-center justify-center p-6 text-center pb-safe">
    <section class="w-full max-w-sm bg-white p-10 rounded-[--radius-card] shadow-lg border border-gray-100 flex flex-col items-center space-y-12">

      <div class="space-y-4">
        <img
            :src="logoImage"
            alt="두뇌산책 로고"
            class="w-20 h-auto mx-auto mb-6"
        />

        <h1 class="text-3xl font-black text-brand-green tracking-tight">
          두뇌산책
        </h1>
        <p class="text-gray-500 text-sm font-medium">
          기억을 잇고, 건강을 걷다
        </p>
      </div>

      <div class="space-y-8 w-full">
        <div class="space-y-2">
          <p class="text-xl font-bold text-brand-green leading-tight">
            반가워요!
          </p>
          <p class="text-gray-700 font-medium">
            건강한 두뇌를 위해<br />
            간편하게 시작해보세요.
          </p>
        </div>

        <a
            href="#"
            @click.prevent="loginWithKakao"
            class="block hover:opacity-90 active:scale-[0.98] transition-all mx-auto"
        >
          <img
              :src="kakaoLoginBtnImage"
              alt="카카오 로그인"
              class="w-auto h-12 mx-auto shadow-md rounded-xl"
          />
        </a>
      </div>

      <footer class="pt-6 w-full border-t border-gray-100">
        <p class="text-xs text-gray-400 font-bold mb-4">로그인에 문제가 있나요?</p>
        <div class="flex justify-center items-center gap-4 text-xs text-gray-400 font-bold">
          <a href="#" class="hover:text-brand-green">고객센터 문의</a>
          <span class="text-gray-200">|</span>
          <a href="#" class="hover:text-brand-green">도움말</a>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup lang="ts">
import logoImage from '../../assets/image/logo_green.png';
import kakaoLoginBtnImage from '../../assets/image/kakao_login_medium_narrow.png';

const loginWithKakao = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    console.error("Kakao Login Error: 환경 변수가 누락되었습니다.");
    alert("로그인 설정을 확인해주세요 (.env)");
    return;
  }

  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};
</script>

<style scoped>

</style>