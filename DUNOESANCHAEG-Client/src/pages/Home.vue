<template>
  <div class="space-y-8 px-5 pb-24 min-h-screen bg-brand-white">

    <header class="pt-2">
      <span class="text-3xl font-extrabold text-brand-green">두뇌산책</span>
    </header>

    <!-- // 추가 할 말 할 말 !!!!!!  -->
    <!-- // 사용자 인사, 날짜 컴포넌트 -->
    <HomeHeader :userName="userName" 
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
import HomeHeader from './mainpage/HomeHeader.vue';
import ProgressRate from './mainpage/ProgressRate.vue';
import TodayRoutines from './mainpage/TodayRoutines.vue';

import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// 페이지(경로)가 바뀔 때마다(홈으로 돌아올 때마다) 데이터를 다시 불러옵니다.
watch(
  () => route.path,
  () => {
    initializeHome();
  }
);

const {
  // 추가 할 말 할 말 
  userName,
  formattedDate,
  // 추가 할 말 할 말 
  isLoading,
  errorMessage,
  progress,
  message,
  missions,
  initializeHome
} = useHome();
</script>

<style scoped>
</style>