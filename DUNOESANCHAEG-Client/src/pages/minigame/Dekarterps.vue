<template>
  <div class="min-h-screen bg-brand-bg p-6 flex flex-col relative pb-24">

    <div class="flex justify-between items-end shrink-0 mt-8 mb-3">
      <div>
        <span class="text-brand-green font-black text-3xl">{{ currentRound }}</span>
        <span class="text-gray-400 font-bold text-lg"> / {{ TOTAL_ROUNDS }}</span>
      </div>
      <div class="text-right">
        <div class="flex items-center gap-2 text-brand-green font-bold">
          <span class="text-2xl">{{ timeLeft }}</span>초 남음
          <van-icon name="stopwatch" size="22" />
        </div>
      </div>
    </div>

    <van-progress 
      :percentage="(timeLeft / TIME_LIMIT) * 100" 
      pivot-text="" 
      color="#1B391E" 
      track-color="#E5E7EB"
      stroke-width="8"
      class="rounded-full overflow-hidden shrink-0 mb-6"
    />

    <div class="flex flex-col w-full mb-auto shrink-0 relative">
      <Transition name="fade" mode="out-in" appear>
        <div :key="currentRound" class="w-full flex flex-col shrink-0 relative">

          <div class="bg-[#184825] rounded-[28px] py-6 flex flex-col items-center justify-center mb-4 shadow-md text-white">
            <span class="text-sm font-bold opacity-90 mb-2">미션</span>
            <span class="text-[2.5rem] font-black tracking-tight">{{ currentProblem.missionText }}</span>
          </div>
          
          <div class="bg-gradient-to-br from-white to-green-50 rounded-[32px] shadow-sm py-8 sm:py-12 min-h-[140px] sm:min-h-[180px] flex flex-col justify-center items-center mb-6 shrink-0 border border-white transition-all overflow-visible px-4 w-full box-border">
            <span class="text-gray-500 font-bold mb-4">상대의 손</span>
            <div class="size-20 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border border-gray-50">
              <img :src="getImgUrl(currentProblem.opponentImg)" class="w-12 h-12 object-contain" alt="상대방 손" />
            </div>
            <span class="text-[#1B2B3B] font-black text-2xl">{{ currentProblem.opponentText }}</span>
          </div>

          <div class="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
            <div v-for="choice in choices" :key="choice.id"
                 @click="selectAnswer(choice.id)"
                 class="bg-white rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] py-3 sm:py-4 flex flex-col items-center justify-center cursor-pointer transition-all border-[3px]"
                 :class="selectedAnswer === choice.id ? 'border-brand-green text-brand-green scale-[0.98]' : 'border-transparent active:scale-[0.98] active:bg-gray-50'" >
                 <img :src="getImgUrl(choice.id)" class="w-12 h-12 sm:w-14 sm:h-14 object-contain mb-1" alt="내 선택지" />
                 <span class="text-lg sm:text-xl font-black" :class="selectedAnswer === choice.id ? 'text-brand-green' : 'text-[#1B2B3B]'">
                   {{ choice.name }}
                 </span>
            </div>
          </div>

        </div>
      </Transition>
    </div>
    
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useTimer } from '../../composables/useTimer.js';
import problemsData from '../../data/rps_problems.json';

import imgRock from '../../assets/rps/rock.png';
import imgScissors from '../../assets/rps/scissors.png';
import imgPaper from '../../assets/rps/paper.png';

const imgMap = {
  rock: imgRock,
  scissors: imgScissors,
  paper: imgPaper
};

const getImgUrl = (key) => imgMap[key];

const router = useRouter();

const TOTAL_ROUNDS = 3;
const TIME_LIMIT = 15;

const currentRound = ref(1);
const correctCount = ref(0);
const isGameOver = ref(false);
const selectedAnswer = ref(null);

const problems = ref([]);
const choices = [
  { id: 'scissors', name: '가위' },
  { id: 'rock', name: '바위' },
  { id: 'paper', name: '보' }
];

const { timeLeft, startTimer, stopTimer, pauseTimer } = useTimer(TIME_LIMIT, () => handleRoundEnd(false));

const generateProblems = () => {
    problems.value = [];
    for (let i = 0; i < TOTAL_ROUNDS; i++) {
        const randIndex = Math.floor(Math.random() * problemsData.length);
        problems.value.push(problemsData[randIndex]);
    }
};

const currentProblem = computed(() => problems.value[currentRound.value - 1] || {});

const selectAnswer = (choiceId) => {
    if (selectedAnswer.value !== null) return;
    selectedAnswer.value = choiceId;
    stopTimer();
    
    const isCorrect = choiceId === currentProblem.value.correctAnswer;
    if (isCorrect) correctCount.value++;
    
    setTimeout(() => {
        handleRoundEnd(isCorrect);
    }, 1000);
};

const handleRoundEnd = (isCorrect) => {
    selectedAnswer.value = null;
    if (currentRound.value < TOTAL_ROUNDS) {
        currentRound.value++;
        startTimer(TIME_LIMIT);
    } else {
        isGameOver.value = true;
        stopTimer();
        alert(`게임 종료! 맞힌 개수: ${correctCount.value} / ${TOTAL_ROUNDS}`);
        router.push('/');
    }
};

onBeforeRouteLeave((to, from) => {
  if (!isGameOver.value) {
    pauseTimer();
    const confirmLeave = window.confirm("게임이 진행 중입니다.\n정말 나가시겠습니까?");
    if (!confirmLeave) {
        startTimer(timeLeft.value);
        return false;
    }
  }
  return true;
});

onMounted(() => {
    generateProblems();
    startTimer(TIME_LIMIT);
});

onUnmounted(() => {
    stopTimer();
});
</script>

<style scoped>
:deep(.van-progress__pivot) {
    display: none;
}
:deep(.van-progress) {
    border: 1px solid rgba(0,0,0,0.02);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>