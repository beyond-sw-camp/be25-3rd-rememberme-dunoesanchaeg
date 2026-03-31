<!-- 레이아웃이 필요 없는 페이지는 meta: { hideLayout: true }를 추가 -->
<template>
  <template v-if="route.meta.hideLayout">
    <router-view />
  </template>

  <MainLayout v-else>
    <router-view />
  </MainLayout>
</template>

<script setup>
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';

const route = useRoute(); // 🎯 현재 페이지 정보를 가져옵니다.
</script>

<style>
body {
  margin: 0;
  padding: 0;
  font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif;
  background-color: #F7F7F7; /* 두뇌산책 기본 배경색 */
}
</style>