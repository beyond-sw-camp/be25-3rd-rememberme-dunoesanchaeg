@ -0,0 +1,205 @@
<template>
  <div class="min-h-dvh bg-brand-bg flex flex-col">
    <van-nav-bar
      :title="pageTitle"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
      safe-area-inset-top
      class="shadow-sm font-bold"
    />

    <div class="px-5 py-6 flex-1 flex flex-col gap-6" v-if="detailData">
      <section class="flex flex-col items-center bg-surface p-6 rounded-card shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
        <h2 class="text-lg font-extrabold text-text-sub mb-4">일간 종합 달성도</h2>
        <van-circle
          v-model:current-rate="currentRate"
          :rate="detailData.progress_rate"
          :speed="50"
          :stroke-width="80" 
          color="var(--color-brand-green)"
          layer-color="var(--color-surface-variant)"
          size="160px"
        >
          <div class="flex items-center justify-center w-full h-full text-3xl font-extrabold text-brand-green">
            {{ currentRate.toFixed(0) }}%
          </div>
        </van-circle>
      </section>

      <section class="flex flex-col gap-5 pb-8">
        <article class="bg-surface p-5 rounded-card shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <h3 class="text-lg font-extrabold text-text-main mb-3 flex items-center gap-2">
            🎮 게임 기록
          </h3>
          <div v-if="detailData.game_record.is_played" class="flex flex-col gap-3">
            <div class="flex justify-between items-center bg-surface-variant p-3 rounded-2xl border border-gray-100">
              <span class="text-text-sub font-bold text-sm">플레이 시간</span>
              <span class="text-text-main font-extrabold">{{ Math.floor(detailData.game_record.play_time_seconds / 60) }}분 {{ detailData.game_record.play_time_seconds % 60 }}초</span>
            </div>
            <div class="flex justify-between items-center bg-surface-variant p-3 rounded-2xl border border-gray-100">
              <span class="text-text-sub font-bold text-sm">달성 정답 수</span>
              <span class="text-brand-green font-extrabold">{{ detailData.game_record.correct_count }}회</span>
            </div>
          </div>
          <div v-else class="py-6 bg-surface-variant rounded-2xl border border-gray-100 text-center">
            <p class="text-text-muted font-bold">기록이 없습니다</p>
          </div>
        </article>

        <article class="bg-surface p-5 rounded-card shadow-[0_2px_10px_rgba(0,0,0,0.03)]">
          <h3 class="text-lg font-extrabold text-text-main mb-3 flex items-center gap-2">
            💬 오늘의 질문
          </h3>
          <div v-if="detailData.question_record.is_answered" class="p-4 bg-brand-blue rounded-2xl text-center border-2 border-brand-green">
            <p class="text-brand-green font-extrabold text-lg break-keep">답변을 성공적으로 완료하셨습니다 👏</p>
          </div>
          <div v-else class="py-6 bg-surface-variant rounded-2xl border border-gray-100 text-center">
            <p class="text-text-muted font-bold">기록이 없습니다</p>
          </div>
        </article>

        <article class="bg-surface p-5 rounded-card shadow-[0_2px_10px_rgba(0,0,0,0.03)] pb-8">
          <h3 class="text-lg font-extrabold text-text-main mb-3 flex items-center gap-2">
            📝 데일리 컨디션
          </h3>
          <div v-if="detailData.daily_record.is_written" class="flex flex-col gap-3">
            <div class="flex items-center gap-4 bg-surface-variant p-4 rounded-2xl border border-gray-100">
              <div class="text-3xl">{{ getLevelIcon(detailData.daily_record.sleep_level) }}</div>
              <div class="flex-1">
                <p class="text-sm text-text-sub font-bold mb-1">수면</p>
                <p class="text-text-main font-medium break-keep">{{ detailData.daily_record.sleep_memo || getLevelText(detailData.daily_record.sleep_level) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-surface-variant p-4 rounded-2xl border border-gray-100">
              <div class="text-3xl">{{ getLevelIcon(detailData.daily_record.meal_level) }}</div>
              <div class="flex-1">
                <p class="text-sm text-text-sub font-bold mb-1">식사</p>
                <p class="text-text-main font-medium break-keep">{{ detailData.daily_record.meal_memo || getLevelText(detailData.daily_record.meal_level) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-surface-variant p-4 rounded-2xl border border-gray-100">
              <div class="text-3xl">{{ getLevelIcon(detailData.daily_record.mood_level) }}</div>
              <div class="flex-1">
                <p class="text-sm text-text-sub font-bold mb-1">기분</p>
                <p class="text-text-main font-medium break-keep">{{ detailData.daily_record.mood_memo || getLevelText(detailData.daily_record.mood_level) }}</p>
              </div>
            </div>
          </div>
          <div v-else class="py-6 bg-surface-variant rounded-2xl border border-gray-100 text-center">
            <p class="text-text-muted font-bold">기록이 없습니다</p>
          </div>
        </article>
      </section>
      
      <div class="h-[env(safe-area-inset-bottom)]"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import axios from 'axios';

const route = useRoute();
const router = useRouter();

const currentRate = ref(0);
const detailData = ref(null);

const pageTitle = computed(() => {
  const tDate = route.query.date || '기록 상세';
  const parts = tDate.split('-');
  return parts.length === 3 ? `${parts[0]}년 ${parts[1]}월 ${parts[2]}일` : tDate;
});

const goBack = () => {
  router.go(-1);
};

const getLevelIcon = (level) => {
  switch (level) {
    case 'GOOD': return '😊';
    case 'MID': return '😐';
    case 'BAD': return '😔';
    default: return '❓';
  }
};

const getLevelText = (level) => {
  switch (level) {
    case 'GOOD': return '긍정적인 상태입니다';
    case 'MID': return '보통 상태입니다';
    case 'BAD': return '관리가 필요한 상태입니다';
    default: return '알 수 없음';
  }
};

const fetchDailyDetail = async () => {
  const targetDate = route.query.date;
  if (!targetDate) return;

  try {
    // TODO: 백엔드 연동 필요
    // const res = await axios.get(`http://localhost:8080/api/v1/calendar/summary?targetDate=${targetDate}`);
    // detailData.value = res.data.data;
    
    // 목업 데이터 응답 시뮬레이션
    setTimeout(() => {
      detailData.value = {
        "targetDate": targetDate,
        "progress_rate": 66,
        "game_record": { "is_played": true, "play_time_seconds": 120, "correct_count": 8 },
        "question_record": { "is_answered": false },
        "daily_record": {
          "is_written": true,
          "mood_level": "GOOD", "mood_memo": "기분이 매우 좋습니다.",
          "sleep_level": "MID", "sleep_memo": "평범하게 잤어요.",
          "meal_level": "BAD", "meal_memo": "입맛이 없었어요"
        }
      };
    }, 300);

  } catch (error) {
    console.error("데이터 로드 실패:", error);
  }
};

onMounted(() => {
  fetchDailyDetail();
});
</script>

<style scoped>
:deep(.van-nav-bar__title) {
  font-family: 'Pretendard', sans-serif;
  font-weight: 800;
  color: var(--color-brand-green);
}
:deep(.van-nav-bar .van-icon) {
  color: var(--color-brand-green);
  font-weight: 900;
  font-size: 1.25rem;
}
:deep(.van-nav-bar) {
  background-color: var(--color-surface);
  border-bottom: 1px solid var(--color-tabbar-border);
}
</style>