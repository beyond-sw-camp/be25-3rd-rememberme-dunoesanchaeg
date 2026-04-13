<template>
  <div class="space-y-6 px-1 pb-10">
    <section class="rounded-[--radius-xl] bg-brand-blue p-6 shadow-sm">
      <div class="flex flex-col gap-4">
        <h2 class="text-center text-3xl font-black text-brand-green">트로피 현황</h2>

        <div class="w-full">
          <div
            v-if="loading"
            class="flex min-h-32 items-center justify-center rounded-[--radius-xl] bg-surface px-4 text-center text-text-muted"
          >
            트로피 정보를 불러오는 중입니다.
          </div>

          <div
            v-else-if="acquiredTrophies.length === 0"
            class="flex min-h-32 items-center justify-center rounded-[--radius-xl] bg-surface px-4 text-center text-text-muted"
          >
            획득한 트로피가 없습니다.
          </div>

          <template v-else>
            <div class="grid grid-cols-5 gap-2 pb-2 sm:gap-3">
              <article
                v-for="trophy in acquiredTrophies"
                :key="trophy.trophyId"
                class="flex aspect-square min-w-0 items-center justify-center overflow-hidden rounded-[--radius-xl] p-1 sm:p-2"
              >
                <img
                  v-if="trophy.image"
                  :src="trophy.image"
                  :alt="trophy.displayName"
                  class="max-h-full max-w-full object-contain"
                />

                <div
                  v-else
                  class="line-clamp-3 text-center text-[10px] font-semibold text-text-default sm:text-xs"
                >
                  {{ trophy.displayName }}
                </div>
              </article>
            </div>
          </template>
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

// 트로피 이미지 매핑
const trophyImageByCount = {
  10: trophy10DaysImage,
  20: trophy20DaysImage,
  30: trophy30DaysImage,
  40: trophy40DaysImage,
  50: trophy50DaysImage
};

// 화면에 그리기 좋게 데이터 가공 (역순 정렬 및 이미지 찾기)
const acquiredTrophies = computed(() => {
  return trophies.value
    .slice()
    .reverse() // 백엔드에서 최신순(50->10)으로 오므로, 10->50 순서로 화면에 그리기 위해 뒤집음
    .map(trophy => {
      const match = String(trophy.trophyName || '').match(/(10|20|30|40|50)/);
      const threshold = match ? Number(match[1]) : null;

      return {
        ...trophy,
        displayName: trophy.trophyName || '이름 없는 트로피',
        image: threshold ? trophyImageByCount[threshold] : ''
      };
    });
});

// API 호출
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