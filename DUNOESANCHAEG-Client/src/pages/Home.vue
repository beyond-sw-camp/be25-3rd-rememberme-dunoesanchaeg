<template>
  <div class="space-y-8 px-5 pb-24 min-h-screen bg-brand-white">

    <header class="pt-2">
      <span class="text-3xl font-extrabold text-brand-green">두뇌산책</span>
    </header>

    <h1 @click="showConfetti"></h1>

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

// 1. 인스턴스를 하나만 생성 (메모리 효율)
const confetti = new JSConfetti();

function showConfetti() {
  confetti.addConfetti({
    // confettiColors: ['#ff0000', '#00ff00', '#0000ff'], // 브랜드 컬러에 맞게 조정 가능
    // confettiColors: ['#27D16A', '#DAEDFF'], // 초록, 배경색
    confettiColors: ['#2F7431', '#8ED35D', '#FFD700'], // 초록, 연두, 금색
    confettiNumber: 250, // 너무 많으면 렉 걸리니 적절히 조절 (기본값 150)
    confettiRadius: 6,
  });
}

// 2. 진행률이 100이 되었을 때만 감지해서 실행
watch(progress, (newProgress) => {
  if (newProgress === 100) {
    showConfetti();
  }
});

onMounted(() => {
  initializeHome();
})

watch(
  () => route.path,
  () => {
    initializeHome();
  }
);

onBeforeUnmount(() => {
  const canvas = document.getElementById('confetti-canvas');
  if (canvas) canvas.remove();
});

</script>

<style scoped>
</style>