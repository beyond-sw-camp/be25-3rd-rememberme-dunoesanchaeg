<template>
  <div
    class="min-h-screen bg-[--color-brand-bg] flex items-center justify-center p-6"
  >
    <section
      class="w-full max-w-sm bg-white p-10 rounded-[--radius-xl] shadow-sm border border-gray-50 flex flex-col items-center text-center space-y-12"
    >
      <div class="space-y-2">
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
            반가워요
          </p>
          <p class="text-gray-700 font-medium">
            건강한 두뇌를 위해<br />
            간편하게 시작해보세요.
          </p>
        </div>

        <a
          href="#"
          @click.prevent="loginWithKakao"
          class="w-full flex justify-center active:scale-[0.98] transition-all"
        >
          <img
            src="../assets/image/kakao_login_medium_narrow.png"
            alt="카카오 로그인"
            class="h-12 w-auto shadow-md rounded-xl"
          />
        </a>
      </div>

      <footer class="pt-6 w-full space-y-4 border-t border-gray-100">
        <p class="text-xs text-gray-400 font-bold">로그인에 문제가 있나요?</p>
        <div
          class="flex justify-center items-center gap-4 text-xs text-gray-400 font-bold"
        >
          <button class="hover:text-brand-green">고객센터 문의</button>
          <span class="text-gray-200">|</span>
          <button class="hover:text-brand-green">도움말</button>
        </div>
      </footer>
    </section>
  </div>
</template>

<script setup>
const loginWithKakao = () => {
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  if (!clientId || !redirectUri) {
    alert("환경 변수 설정이 필요합니다!");
    return;
  }

  //location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};
</script>
