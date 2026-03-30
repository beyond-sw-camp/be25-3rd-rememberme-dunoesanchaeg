<template>
  <van-tabbar 
    v-model="active" 
    active-color="#1B391E" 
    inactive-color="#A8B5AA" 
    route 
    border
    class="rounded-t-[20px] overflow-hidden h-[65px] shadow-[0_-5px_15px_rgba(0,0,0,0.1)]"
    safe-area-inset-bottom
  >
    <van-tabbar-item replace :to="{ name: 'Home' }" icon="wap-home-o">홈</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Statistics' }" icon="bar-chart-o">통계</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Profile' }" icon="user-o">프로필</van-tabbar-item>
    <van-tabbar-item replace :to="{ name: 'Notice' }" icon="notes-o">공지사항</van-tabbar-item>
  </van-tabbar>
</template>

<script setup>
import { ref } from 'vue';
const active = ref(0);
</script>