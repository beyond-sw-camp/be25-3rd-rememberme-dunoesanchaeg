<template>
  <div class="space-y-8 px-5 pb-24 min-h-screen bg-brand-white">

    <header class="pt-2">
      <span class="text-3xl font-extrabold text-brand-green">두뇌산책</span>
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
import { useHome } from '@/composables/useHome';
import HomeHeader from '@/pages/mainpage/HomeHeader.vue';

import ProgressRate from './mainpage/ProgressRate.vue';
import TodayRoutines from './mainpage/TodayRoutines.vue';

import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
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

onMounted(() => {
  initializeHome();
})

watch(
  () => route.path,
  () => {
    initializeHome();
  }
);
</script>

<style scoped>
</style>