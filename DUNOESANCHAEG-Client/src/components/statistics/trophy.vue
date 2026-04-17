<template>
  <div class="space-y-6 px-1 pb-10">
    <section
      class="p-6 overflow-hidden rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-surface,#ffffff)] shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
      <div class="flex flex-col gap-4">
        <div class="w-full">
          <div v-if="loading"
            class="flex min-h-32 items-center justify-center rounded-3xl bg-surface px-4 text-center text-text-muted">
            트로피 정보를 불러오는 중입니다.
          </div>

          <div v-else-if="acquiredTrophies.length === 0"
            class="flex min-h-32 items-center justify-center rounded-3xl bg-surface px-4 text-center text-text-muted">
            획득한 트로피가 없습니다.
          </div>

          <div v-else class="relative group trophy-slider-container">
            <button @click="scrollLeft"
  class="absolute -left-5 top-1/2 z-30 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-200 active:bg-gray-200/50 active:scale-90 rounded-full text-lg text-text-default hover:text-brand-green outline-none border-none bg-transparent"
>
  &lt;
</button>

<button @click="scrollRight"
  class="absolute -right-5 top-1/2 z-30 -translate-y-1/2 w-10 h-10 flex items-center justify-center transition-all duration-200 active:bg-gray-200/50 active:scale-90 rounded-full text-lg text-text-default hover:text-brand-green outline-none border-none bg-transparent"
>
  &gt;
</button>

            <div ref="scrollContainer"
              class="flex gap-4 overflow-x-auto px-6 pb-2 scroll-smooth snap-x snap-mandatory no-scrollbar">
              <article v-for="trophy in acquiredTrophies" :key="trophy.trophyId"
                class="flex-shrink-0 w-28 snap-center flex flex-col items-center">
                <div class="relative w-20 h-20">
                  <img v-if="trophy.image" :src="trophy.image" :alt="trophy.displayName"
                    class="w-full h-full object-contain" />
                </div>
                <div class="mt-2 text-center text-[13px] font-semibold text-brand-green whitespace-nowrap">
                  {{ trophy.caption }}
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { showToast } from 'vant';
import instance from '@/api/instance';

import trophy10DaysImage from '@/assets/trophy/trophy-10days.png';
import trophy20DaysImage from '@/assets/trophy/trophy-20days.png';
import trophy30DaysImage from '@/assets/trophy/trophy-30days.png';
import trophy40DaysImage from '@/assets/trophy/trophy-40days.png';
import trophy50DaysImage from '@/assets/trophy/trophy-50days.png';

const trophies = ref([]);
const loading = ref(false);
const scrollContainer = ref(null);

const trophyImageByCount = {
  10: trophy10DaysImage,
  20: trophy20DaysImage,
  30: trophy30DaysImage,
  40: trophy40DaysImage,
  50: trophy50DaysImage,
};

const trophyCaptionByCount = {
  10: '루틴 10일 달성',
  20: '루틴 20일 달성',
  30: '루틴 30일 달성',
  40: '루틴 40일 달성',
  50: '루틴 50일 달성',
};

const acquiredTrophies = computed(() => {
  return trophies.value
    .slice()
    .reverse()
    .map((trophy) => {
      const match = String(trophy.trophyName || '').match(/(10|20|30|40|50)/);
      const threshold = match ? Number(match[1]) : null;

      return {
        ...trophy,
        displayName: trophy.trophyName || '이름 없는 트로피',
        image: threshold ? trophyImageByCount[threshold] : '',
        caption: threshold
          ? trophyCaptionByCount[threshold]
          : trophy.trophyName || '이름 없는 트로피',
      };
    });
});

const scrollLeft = () => {
  scrollContainer.value?.scrollBy({ left: -140, behavior: 'smooth' });
};

const scrollRight = () => {
  scrollContainer.value?.scrollBy({ left: 140, behavior: 'smooth' });
};

const fetchTrophies = async () => {
  loading.value = true;
  try {
    const response = await instance.get('/trophies');
    trophies.value = response.data?.data?.trophy_list || [];
  } catch (error) {
    console.error('트로피 조회 실패:', error);
    showToast('트로피 정보를 불러오지 못했습니다.');
    trophies.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchTrophies);
</script>

<style scoped>
/* 스크롤바 숨기기 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.trophy-slider-container::before,
.trophy-slider-container::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 40px;
  z-index: 10;
  pointer-events: none;
  /* 하드웨어 가속으로 선 생김 방지 */
  transform: translateZ(0);
  backface-visibility: hidden;
}

.trophy-slider-container::before {
  left: -2px;
  background: linear-gradient(to right, var(--color-surface, #ffffff) 10%, transparent);
}

.trophy-slider-container::after {
  right: -2px;
  background: linear-gradient(to left, var(--color-surface, #ffffff) 10%, rgba(255, 255, 255, 0));
}

/* 서브픽셀 렌더링 보정 */
.trophy-slider-container {
  transform: translate3d(0, 0, 0);
}
</style>