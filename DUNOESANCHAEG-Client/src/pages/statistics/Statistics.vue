<template>
  <div class="statistics-page">
    <div class="mb-6 px-1">
      <h1 class="text-3xl font-extrabold text-text-main">
        기록 통계 <span class="text-brand-green">📊</span>
      </h1>
      <p class="text-text-sub text-base mt-2 font-medium">나의 꾸준한 노력을 확인해보세요!</p>
    </div>

    <StatisticsCalendar class="mb-8" />

    <div class="mb-4 px-1">
      <h2 class="text-2xl font-bold text-text-main">최근 7회차 종합 통계</h2>
    </div>
    <CognitiveTrendChart />
    
    <div class="h-10"></div>
  </div>
</template>

<script setup>
import StatisticsCalendar from '@/components/statistics/StatisticsCalendar.vue';
import CognitiveTrendChart from '@/components/statistics/CognitiveTrendChart.vue';
</script>

<style scoped>
</style>
