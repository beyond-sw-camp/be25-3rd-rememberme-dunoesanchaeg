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

const route = useRoute();
</script>

<style>
</style>