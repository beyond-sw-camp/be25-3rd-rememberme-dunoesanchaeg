<template>
  <van-tabbar
      v-model="active"
      :active-color="'var(--tabbar-active)'"
      :inactive-color="'var(--tabbar-inactive)'"
      route
      :border="false"
      class="tabbar-custom shadow-[0_-5px_15px_rgba(0,0,0,0.1)]"
      safe-area-inset-bottom
  >
    <van-tabbar-item replace :to="{ name: 'Home' }" icon="wap-home-o">홈</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Statistics' }" icon="bar-chart-o">통계</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Profile' }" icon="user-o">프로필</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Notice' }" icon="notes-o">공지사항</van-tabbar-item>
  </van-tabbar>
</template>

<style scoped>
.tabbar-custom {
  /* 변수를 사용하여 배경과 높이 조절 */
  background-color: var(--tabbar-bg) !important;
  height: 65px;
  border-top: 1px solid var(--tabbar-border);
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

/* 고대비 모드일 때 그림자가 가독성을 해치므로 제거 */
html[data-high-contrast="true"] .tabbar-custom {
  box-shadow: none !important;
}
</style>

<script setup>
import { ref } from 'vue';
const active = ref(0);
</script>