<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-[--color-brand-bg] p-6 text-center"
  >
    <div class="mb-16">
      <h1
        class="text-4xl font-black text-[--color-brand-green] mb-3 track-tight"
      >
        두뇌산책
      </h1>
      <p class="text-gray-600 text-base font-medium">
        기억을 잇고, 건강을 걷다
      </p>
    </div>

    <div class="w-full flex justify-center items-center">
      <a
        href="#"
        @click.prevent="handleKakaoLogin"
        class="transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <img
          src="@/assets/image/kakao_login_medium_narrow.png"
          alt="카카오 로그인"
          class="block sm:hidden w-auto h-12"
        />

        <img
          src="@/assets/image/kakao_login_medium_wide.png"
          alt="카카오 로그인"
          class="hidden sm:block md:hidden w-auto h-12"
        />

        <img
          src="@/assets/image/kakao_login_large_narrow.png"
          alt="카카오 로그인"
          class="hidden md:block lg:hidden w-auto h-14"
        />

        <img
          src="@/assets/image/kakao_login_large_wide.png"
          alt="카카오 로그인"
          class="hidden lg:block w-auto h-16"
        />
      </a>
    </div>

    <div class="absolute bottom-10 text-xs text-gray-400">
      © 2026 Brainwalk Inc. All rights reserved.
    </div>
  </div>
</template>

<script setup>
// 카카오 로그인 핸들러
const handleKakaoLogin = () => {
  // .env 파일에 설정해둔 값을 가져옵니다.
  const clientId = import.meta.env.VITE_KAKAO_CLIENT_ID;
  const redirectUri = import.meta.env.VITE_KAKAO_REDIRECT_URI;

  // 필수 값이 없으면 경고 (개발자용)
  if (!clientId || !redirectUri) {
    console.error(
      ".env 파일에 VITE_KAKAO_CLIENT_ID 또는 VITE_KAKAO_REDIRECT_URI가 설정되지 않았습니다.",
    );
    alert("로그인 설정 오류가 발생했습니다.");
    return;
  }

  // 카카오 인증 페이지로 이동 (인가 코드 요청)
  location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`;
};
</script>

<style scoped>
/* 필요한 경우 컴포넌트 전용 스타일 추가 */
</style>
