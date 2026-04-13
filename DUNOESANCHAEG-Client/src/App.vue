<!-- 레이아웃이 필요 없는 페이지는 meta: { hideLayout: true }를 추가 -->
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="transitionName" mode="out-in">
      <div :key="route.meta.hideLayout ? 'no-layout' : 'has-layout'" class="w-full min-h-dvh">
        <component :is="Component" v-if="route.meta.hideLayout" />
        
        <MainLayout v-else>
          <component :is="Component" />
        </MainLayout>
      </div>
    </transition>
  </router-view>
</template>

<script setup>
import { useRoute } from 'vue-router';
import MainLayout from './layouts/MainLayout.vue';
import { useRouteTransition } from '@/composables/useRouteTransition';
import { useThemeSettings } from '@/composables/useThemeSettings';

const route = useRoute();

// 글로벌 테마 및 설정 관찰 로직
useThemeSettings();

// 동적 슬라이드 트랜지션 애니메이션 로직
const { transitionName } = useRouteTransition();
</script>

<style>
</style>