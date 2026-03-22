<template>
  <van-tabbar v-model="active" active-color="#1B391E" inactive-color="#A8B5AA" route border>
    <van-tabbar-item replace to="/" icon="wap-home-o">홈</van-tabbar-item>
    <van-tabbar-item replace to="/statistics" icon="bar-chart-o">통계</van-tabbar-item>
    <van-tabbar-item replace to="/profile" icon="user-o">프로필</van-tabbar-item>
    <van-tabbar-item replace to="/notice" icon="notes-o">공지사항</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';

const active = ref(0);
</script>

<style scoped>
.van-tabbar {
  border-radius: 20px 20px 0 0;
  overflow: hidden;
  height: 65px;
}
</style>