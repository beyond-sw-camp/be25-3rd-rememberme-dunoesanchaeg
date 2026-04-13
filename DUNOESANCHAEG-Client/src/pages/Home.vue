<template>
  <div class="space-y-8 px-5 pb-24 min-h-screen bg-brand-white">

    <header class="pt-2">
      <span class="text-3xl font-extrabold text-brand-green">두뇌산책</span>
    </header>

    <!-- // 추가 할 말 할 말 !!!!!!  -->
    <!-- // 사용자 인사, 날짜 컴포넌트 -->
    <HomeHeader :userName="userName" :formattedDate="formattedDate" />

    <!-- // 진행률 표시 컴포넌트 -->
    <ProgressRate :isLoading="isLoading" :progress="progress" :message="message" :errorMessage="errorMessage"
      @retry="initializeHome" />

    <!-- // 루틴들 컴포넌트  -->
    <TodayRoutines :missions="missions" />


    <!-- 개방형질문 기능 구현 -->
    <div class="bg-brand-blue p-6 rounded-[--radius-xl] shadow-sm border border-surface-variant flex flex-col gap-4">
      <div class="flex justify-between items-start">
        <div class="size-12 bg-surface-variant rounded-2xl flex items-center justify-center text-2xl">
          ❓
        </div>
      </div>
      <div>
        <h4 class="text-xl font-bold text-text-main">개방형질문</h4>
        <p class="text-text-muted text-sm font-medium">
          마음에 떠오르는 이야기를 편하게 적어보세요!
        </p>
      </div>
      <button type="button" @click="goToOpenQuestion"
        class="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
        <span class="text-white">시작하기</span>
        <van-icon name="play" class="ml-1 text-white" />
      </button>
    </div>

    <div v-for="(game, i) in games" :key="i"
      class="bg-brand-blue p-6 rounded-[--radius-xl] shadow-sm border border-surface-variant flex flex-col gap-4">
      <div class="flex justify-between items-start">
        <div class="size-12 bg-surface-variant rounded-2xl flex items-center justify-center text-2xl">
          {{ game.icon }}
        </div>
      </div>
      <div>
        <h4 class="text-xl font-bold text-text-main">{{ game.title }}</h4>
        <p class="text-text-muted text-sm font-medium">{{ game.desc }}</p>
      </div>
      <router-link :to="{ name: game.link }">
        <button
          class="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all">
          <span class="text-white">시작하기</span>
          <van-icon name="play" class="ml-1 text-white" />
        </button>
      </router-link>
    </div>

    <div class="bg-brand-green p-8 rounded-[--radius-xl] text-white relative overflow-hidden">
      <van-tag color="rgba(255,255,255,0.2)" class="mb-4 px-3 py-1">전문가 팁</van-tag>
      <h4 class="text-2xl font-bold leading-tight mb-4">매일 15분,<br />뇌가 건강해지는 시간</h4>
      <p class="text-white/80 text-sm leading-relaxed mb-2">꾸준한 활동은 인지 건강을 지키는 가장 강력한 도구입니다.</p>
      <div class="absolute -bottom-4 -right-4 size-24 bg-surface/10 rounded-full blur-2xl"></div>
    </div>
  </div>
</template>



<script setup>
import { useHome } from '@/composables/useHome';

import ProgressRate from './mainpage/ProgressRate.vue';
import TodayRoutines from './mainpage/TodayRoutines.vue';
import HomeHeader from './mainpage/HomeHeader.vue';

import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

import { useRouter } from 'vue-router';

const router = useRouter();

const goToOpenQuestion = () => {
  sessionStorage.setItem('openQuestionEntry', 'allowed');
  router.push('/open-question');
};


const {
  // 추가 할 말 할 말 
  userName,
  formattedDate,
  // 추가 할 말 할 말 
  isLoading,
  errorMessage,
  progress,
  message,
  missions,
  initializeHome
} = useHome();

onMounted(() => {
  initializeHome();
})

watch(
  () => route.path,
  () => {
    initializeHome();
  }
);

const games = [
  { icon: '⚙️', title: '미니게임 - 단어 연상', desc: '기억력 향상 게임', link: 'GameWordmemory' },
  { icon: '🧮', title: '미니게임 - 간단 연산', desc: '뇌의 회전 속도를 높여보세요', link: 'GameArithmetic' },
  { icon: '✌️', title: '미니게임 - 데카르트 가위바위보', desc: '뇌의 억제 능력과 적응력을 극대화하세요!', link: 'GameDekarterps' },
];
</script>

<style scoped></style>