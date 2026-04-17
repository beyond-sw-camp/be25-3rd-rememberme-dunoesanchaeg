<template>
  <div class="statistics-page">
    <div class="mb-6">
      <h1 class="text-3xl font-extrabold text-brand-green">
        통계
      </h1>
    </div>

    <StatisticsCalendar class="mb-8" />

    <div class="mb-4 px-1">
      <h2 class="text-2xl font-bold text-text-main">최근 7회차 종합 통계</h2>
    </div>
    <CognitiveTrendChart class="mb-8" />

    <div class="mb-4 px-1">
      <h2 class="text-2xl font-bold text-text-main">트로피 현황</h2>
    </div>

    <trophy/>

  </div>
</template>

<script setup>
import StatisticsCalendar from '@/components/statistics/StatisticsCalendar.vue';
import CognitiveTrendChart from '@/components/statistics/CognitiveTrendChart.vue';
import trophy from '@/components/statistics/Trophy.vue';
</script>

<style scoped>
</style>
