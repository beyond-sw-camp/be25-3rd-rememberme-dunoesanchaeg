<template>
  <div
    v-if="isLoading"
    class="flex flex-col flex-1 min-h-[70vh] justify-center items-center"
  >
    <van-loading type="spinner" color="var(--color-brand-green)" size="48px" />
    <p class="mt-4 text-[var(--color-text-muted)] font-bold">
      정보를 불러오고 있어요 🌱
    </p>
  </div>

  <div v-else class="space-y-8 min-h-screen bg-[var(--color-brand-bg)]">
    <header class="flex items-center mb-8 px-2 pt-2">
      <div 
        @click="showConfetti" 
        class="flex items-center gap-3 cursor-pointer select-none group"
      >
        <van-image 
          :src="logoGreen" 
          alt="두뇌산책 로고" 
          class="w-11 sm:w-12 h-auto transition-transform duration-300 group-active:rotate-12 group-active:scale-90 drop-shadow-sm" 
        />
        <h1 class="text-3xl sm:text-4xl font-black text-brand-green tracking-tight transition-transform group-active:scale-95 origin-left">
          두뇌산책
        </h1>
      </div>
    </header>

    <!-- // 사용자 인사, 날짜 컴포넌트 -->
    <HomeHeader :username="username" :formattedDate="formattedDate" />

    <!-- // 진행률 표시 컴포넌트 -->
    <ProgressRate
      :isLoading="isLoading"
      :progress="progress"
      :message="message"
      :errorMessage="errorMessage"
      @retry="initializeHome"
    />

    <!-- // 루틴들 컴포넌트  -->
    <TodayRoutines :missions="missions" />
  </div>
</template>

<script setup>
import logoGreen from "@/assets/image/logo_green1.png";

import { useHome } from "@/composables/useHome";
import HomeHeader from "@/pages/mainpage/HomeHeader.vue";

import ProgressRate from "./mainpage/ProgressRate.vue";
import TodayRoutines from "./mainpage/TodayRoutines.vue";

import { onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import JSConfetti from "js-confetti";

const route = useRoute();

const {
  username,
  formattedDate,
  isLoading,
  errorMessage,
  progress,
  message,
  missions,
  initializeHome,
} = useHome();

const confetti = new JSConfetti();

function fireConfetti() {
  confetti.addConfetti({
    confettiColors: ["#2F7431", "#8ED35D", "#FFD700"], // 초록, 연두, 금색
    confettiNumber: 250,
    confettiRadius: 6,
  });
}

// 로고 클릭 시: 진행률 100%일 때만 컨페티 발사
function showConfetti() {
  if (progress.value === 100) {
    fireConfetti();
  }
}

watch(
  [progress, isLoading],
  ([newProgress, newIsLoading]) => {
    if (newIsLoading) return;

    if (newProgress === 100) {
      // 아직 컨페티를 안 터뜨렸다면 발사합니다
      if (!localStorage.getItem("confettiShown")) {
        fireConfetti();
        localStorage.setItem("confettiShown", "true");
      }
    } else if (newProgress >= 0 && newProgress < 100) {
      // 100%가 아닐 경우 컨페티 상태를 초기화하여, 100% 달성 시 다시 터지도록 합니다
      localStorage.removeItem("confettiShown");
    }
  },
  { immediate: true },
);

onMounted(() => {
  initializeHome();
});

onBeforeUnmount(() => {
  const canvas = document.getElementById("confetti-canvas");
  if (canvas) canvas.remove();
});
</script>

<style scoped></style>
