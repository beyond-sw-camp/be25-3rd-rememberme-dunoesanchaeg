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
import { useSettingsStore } from '@/store/settings';

const route = useRoute();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

onMounted(() => {
  settingsStore.initSettings(authStore.fontSize, authStore.isHighContrast);
});

watch(
    () => [authStore.isHighContrast, authStore.fontSize],
    ([newContrast, newSize]) => {
      settingsStore.initSettings(newSize, newContrast);
    }
);

</script>

<style>
</style>