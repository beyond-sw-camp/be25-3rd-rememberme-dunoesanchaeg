<template>
  <div class="space-y-8 min-h-screen bg-[var(--color-brand-bg)]">

    <header class="flex items-center gap-3 mb-10">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-10 h-auto" />
      <h1 @click="showConfetti" 
        class="text-3xl font-extrabold text-brand-green tracking-tight">두뇌산책</h1>
    </header>


    <!-- // 사용자 인사, 날짜 컴포넌트 -->
    <HomeHeader :username="username" 
                :formattedDate="formattedDate" />

    <!-- // 진행률 표시 컴포넌트 -->
    <ProgressRate :isLoading="isLoading" 
                  :progress="progress" 
                  :message="message" 
                  :errorMessage="errorMessage"
                  @retry="initializeHome" />

    <!-- // 루틴들 컴포넌트  -->
    <TodayRoutines :missions="missions" />

  </div>
</template>

<script setup>
import logoGreen from '@/assets/image/logo_green1.png';

import { useHome } from '@/composables/useHome';
import HomeHeader from '@/pages/mainpage/HomeHeader.vue';

import ProgressRate from './mainpage/ProgressRate.vue';
import TodayRoutines from './mainpage/TodayRoutines.vue';

import { onBeforeUnmount, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

import JSConfetti from 'js-confetti';

const route = useRoute();

const {
  username,
  formattedDate,
  isLoading,
  errorMessage,
  progress,
  message,
  missions,
  initializeHome
} = useHome();

const confetti = new JSConfetti();

const hasCelebrated = localStorage.getItem('confettiShown');
function showConfetti() {
  confetti.addConfetti({
    // confettiColors: ['#ff0000', '#00ff00', '#0000ff'], // 브랜드 컬러에 맞게 조정 가능
    // confettiColors: ['#27D16A', '#DAEDFF'], // 초록, 배경색
    confettiColors: ['#2F7431', '#8ED35D', '#FFD700'], // 초록, 연두, 금색
    confettiNumber: 250, // 너무 많으면 렉 걸리니 적절히 조절 (기본값 150)
    confettiRadius: 6,
  });
}

watch(
  progress,
  (newProgress) => {
    if (
      newProgress === 100 &&
      !localStorage.getItem('confettiShown')
    ) {
      showConfetti();
      localStorage.setItem('confettiShown', 'true');
    }
  },
  { immediate: true } 
);

onMounted(() => {
  initializeHome();
});

onBeforeUnmount(() => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) canvas.remove();
});
</script>

<style scoped>
</style>