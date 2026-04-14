<template>
  <div class="bg-surface rounded-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
    <van-tabs v-model:active="activeTab" color="var(--color-brand-green)" title-active-color="var(--color-brand-green)" swipeable @change="onTabChange">
      <van-tab name="WORD_MEMORY" title="단어 연상" />
      <van-tab name="ARITHMETIC" title="사칙연산" />
      <van-tab name="DESCARTES_RPS" title="데카르트" />
    </van-tabs>

    <div class="mt-5 p-4 bg-brand-blue rounded-2xl flex items-center sm:items-center justify-center gap-2">
      <div class="bg-brand-green text-surface w-6 h-6 rounded-full flex-shrink-0 flex justify-center items-center text-sm shadow-md font-bold">i</div>
      <p class="text-brand-green font-extrabold text-base leading-snug break-keep text-left">
        이 게임은 <span class="text-text-main underline decoration-brand-green decoration-4 underline-offset-4 break-keep">{{ cognitiveSkillMap[activeTab] }}</span> 발달에 도움을 줍니다.
      </p>
    </div>

    <div class="mt-6 relative w-full h-64">
      <Line :data="computedChartData" :options="chartOptions" />
    </div>

    <div v-if="currentStatItem" class="mt-4 grid grid-cols-2 gap-4 text-center text-sm font-semibold text-text-sub">
      <div class="bg-surface-variant p-3 rounded-xl border border-gray-100">
        <div class="text-text-muted mb-1 text-xs">총 플레이 횟수</div>
        <div class="text-lg text-text-main font-bold">{{ currentStatItem.play_count }}회</div>
      </div>
      <div class="bg-surface-variant p-3 rounded-xl border border-gray-100">
        <div class="text-text-muted mb-1 text-xs">최근 정답률</div>
        <div class="text-lg text-brand-green font-extrabold">{{ currentStatItem.accuracy }}%</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { Line } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Filler
} from 'chart.js';

import instance from '@/api/instance';

ChartJS.register(Title, Tooltip, Legend, LineElement, PointElement, CategoryScale, LinearScale, Filler);

const cognitiveSkillMap = {
  WORD_MEMORY: '기억력',
  ARITHMETIC: '계산력',
  DESCARTES_RPS: '판단력'
};

const activeTab = ref('WORD_MEMORY');

const apiResponseData = ref(null);

const currentStatItem = computed(() => {
  if (!apiResponseData.value || !apiResponseData.value.stats) return null;
  return apiResponseData.value.stats.find(s => s.game_type === activeTab.value) || null;
});

const trendHistory = ref([]);

const updateChartData = () => {
  if (currentStatItem.value && currentStatItem.value.scores) {
    trendHistory.value = currentStatItem.value.scores;
  } else {
    trendHistory.value = [];
  }
};

onMounted(async () => {
  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    const response = await instance.get('/statistics/games/weekly-types', {
      params: { targetDate: formattedDate }
    });
    if (response.data && response.data.code === 200) {
      apiResponseData.value = response.data.data;
    }
  } catch (error) {
    console.error("차트 통계 데이터를 불러오는 데 실패했습니다:", error);
  } finally {
    updateChartData();
  }
});

const onTabChange = () => {
  updateChartData();
};

// Chart.js 기본 데이터 설정
const computedChartData = computed(() => {
  const brandGreen = '#2D7A36';
  
  return {
    labels: ['1회차', '2회차', '3회차', '4회차', '5회차', '6회차', '7회차'],
    datasets: [
      {
        label: '정답률 (%)',
        data: trendHistory.value,
        borderColor: brandGreen,
        backgroundColor: 'rgba(45, 122, 54, 0.15)', // 
        borderWidth: 3,
        pointBackgroundColor: '#ffffff',
        pointBorderColor: brandGreen,
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
        tension: 0.4,
        clip: false 
      }
    ]
  };
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  animation: {
    duration: 1000,
    easing: 'easeOutQuart'
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFont: { family: 'Pretendard', size: 14, weight: 'bold' },
      bodyFont: { family: 'Pretendard', size: 13 },
      padding: 10,
      cornerRadius: 10,
      displayColors: false,
      callbacks: {
        label: function(context) {
          const acc = context.parsed.y;
          return `정답률: ${acc}%`;
        }
      }
    }
  },
  scales: {
    y: {
      min: 0,
      max: 100,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
        drawBorder: false
      },
      ticks: {
        font: { family: 'Pretendard', size: 12, weight: 'bold' },
        color: '#9ca3af',
        stepSize: 20
      }
    },
    x: {
      grid: {
        display: false
      },
      ticks: {
        font: { family: 'Pretendard', size: 12, weight: 'bold' },
        color: '#9ca3af'
      }
    }
  }
};
</script>

<style scoped>
</style>