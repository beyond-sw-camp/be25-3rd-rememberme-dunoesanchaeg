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
import { Loading as VanLoading } from 'vant';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

onMounted(async () => {
  const code = route.query.code;

  if (code) {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/kakao-auth`, {
        code: code
      });
      console.log("백엔드 전체 응답:", response.data);

      const token = response.data.data.accessToken;

      if (token) {
        localStorage.setItem('token', token);

        router.replace({ name: 'Home' });
      }
    } catch (error) {
      console.error("로그인 처리 실패:", error);
      router.replace({ name: 'Login' });
    }
  }
});
</script>

<style scoped>

</style>