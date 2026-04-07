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
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
const authStore = useAuthStore();

onMounted(() => {
  authStore.applyTheme(authStore.isHighContrast, authStore.fontSize);
});

watch(
    () => [authStore.isHighContrast, authStore.fontSize],
    ([newContrast, newSize]) => {
      authStore.applyTheme(newContrast, newSize);
    }
);

</script>

<style>
</style>