<template>
  <div class="space-y-8 px-5 pb-24 min-h-screen bg-brand-white">

    <header class="pt-2">
      <span class="text-3xl font-extrabold text-brand-green">두뇌산책</span>
    </header>

<!-- // 추가 할 말 할 말 !!!!!!  -->
<section class="flex justify-between items-center">
  <div class="py-2">
    <h2 class="text-2xl font-bold text-zinc-800">
      반가워요, <span class="text-brand-green">{{ userName }}</span> 님!
    </h2>
    <p class="text-zinc-500 font-medium">오늘도 건강하게 산책해볼까요? ☀️</p>
  </div>

  <div class="text-xl font-semibold text-zinc-400 mt-1">
    {{ formattedDate }}
  </div>
</section>
<!-- // 추가 할 말 할 말 !!!!!! -->



    <div v-if="isLoading" class="flex flex-col justify-center items-center py-20">
      <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green mb-4"></div>
      <p class="text-zinc-500">루틴을 불러오고 있어요...</p>
    </div>

    <div v-else-if="errorMessage" class="bg-red-50 p-6 rounded-2xl text-center">
      <p class="text-red-500 font-medium mb-3">{{ errorMessage }}</p>
      <button @click="fetchHomeData" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">
        다시 시도
      </button>
    </div>

    <template v-else>
      <section class="bg-white p-6 rounded-2xl shadow-md">
        <div class="flex justify-between items-center">
          <p class="text-2xl font-semibold text-zinc-800">오늘의 루틴 진행률</p>
          <p class="text-2xl font-bold text-brand-green">{{ progress }}%</p>
        </div>

        <div class="w-full pt-6 pb-4">
          <div class="w-full h-10 bg-zinc-200 rounded-full overflow-hidden">
            <div class="h-full bg-brand-green rounded-full transition-all duration-700"
              :style="{ width: progress + '%' }"></div>
          </div>
        </div>

        <div class="flex justify-center text-l font-semibold text-zinc-600">
          {{ message }}
        </div>
      </section>

      <div class="flex justify-between items-end px-1 pt-4">
        <h3 class="text-2xl font-bold text-zinc-800">오늘의 루틴</h3>
        <span class="text-l text-zinc-400">
          {{ games.length }}개 중
          <span class="text-zinc-800 font-semibold">
            {{games.filter(g => g.isCompleted).length}}개
          </span> 완료
        </span>
      </div>

      <section class="space-y-4">
        <div v-for="(game, i) in games" :key="i"
          class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-4">

          <div class="flex items-center gap-3">
            <div class="size-11 bg-zinc-100 rounded-xl flex items-center justify-center text-lg">
              {{ game.icon }}
            </div>
            <div>
              <h4 class="text-base font-bold text-zinc-800">{{ game.title }}</h4>
              <p class="text-zinc-400 text-sm">{{ game.desc }}</p>
            </div>
          </div>

          <router-link v-if="!game.isCompleted" :to="{ name: game.link }">
            <button class="start-button">
              시작하기
            </button>
          </router-link>

          <button v-else class="completed-button">
            완료됨
          </button>
        </div>
      </section>
    </template>

  </div>
</template>



<script setup>
import { useHome } from '@/composables/useHome';

const {
  // 추가 할 말 할 말 
  userName,
  formattedDate,
// 추가 할 말 할 말 
  isLoading,
  errorMessage,
  progress,
  message,
  games,
  initializeHome
} = useHome();
</script>



<style scoped>
.start-button {
  width: 100%;
  padding-top: 0.75rem;    /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 0.75rem;  /* rounded-xl */
  font-weight: 600;        /* font-semibold */
  cursor: pointer;
  border: none;           /* 버튼 기본 테두리 제거 */
  
  /* 배경색: 전역 변수 사용 */
  background-color: var(--color-brand-green);
  /* 글자색: 하얀색 (시작하기 버튼) */
  color: #ffffff; 
}

.completed-button{
  width: 100%;
  padding-top: 0.75rem;    /* py-3 */
  padding-bottom: 0.75rem;
  border-radius: 0.75rem;  /* rounded-xl */
  font-weight: 600;        /* font-semibold */
  cursor: default;
  border: none;           /* 버튼 기본 테두리 제거 */

  background-color: #e4e4e7; /* zinc-200의 실제 색상값 */
  color: #71717a; /* 글자색도 꼭 같이 넣어주세요! */
}

</style>