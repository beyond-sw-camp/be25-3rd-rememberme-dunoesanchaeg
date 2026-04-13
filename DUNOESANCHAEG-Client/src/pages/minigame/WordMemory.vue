<template>
  <div class="min-h-dvh bg-gray-50 flex flex-col">
    <van-nav-bar
      title="단어 연상 게임"
      left-arrow
      @click-left="goBack"
      fixed
      placeholder
      safe-area-inset-top
      class="shadow-sm font-bold bg-gray-50 z-50"
    />

    <div class="p-6 flex flex-col space-y-6 flex-1 relative">
      <div class="flex justify-between items-end shrink-0">
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
      :percentage="(timeLeft / (isMemorizing ? MEMORY_TIME : SELECT_TIME)) * 100" 
      pivot-text="" 
      color="#1B391E" 
      track-color="#E5E7EB"
      stroke-width="8"
      class="rounded-full overflow-hidden shrink-0"
    />

    <div class="text-center space-y-2 py-2 shrink-0">
      <h2 class="text-2xl font-bold text-gray-900 min-h-[3rem]">
        <transition name="slide-up" mode="out-in">
          <span :key="isMemorizing" class="block whitespace-pre-line">
            {{ isMemorizing ? '나타나는 단어 순서를\n기억하세요' : '기억하신 순서대로\n단어를 선택해 주세요' }}
          </span>
        </transition>
      </h2>
    </div>

    <div class="flex-1">
      <TransitionGroup 
        name="card-list" 
        tag="div" 
        class="grid grid-cols-1 gap-4"
      >
        <div 
          v-for="(word) in shownWords" 
          :key="word.text"
          @click="handleWordClick(word.text)"
          :class="[
            'relative p-8 rounded-[24px] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 shadow-sm cursor-pointer',
            getCardStyle(word.text)
          ]"
        >
          <div class="size-16 bg-gray-50 rounded-full flex items-center justify-center text-4xl">
            {{ word.icon }}
          </div>
          <span class="text-3xl font-bold text-brand-green">{{ word.text }}</span>

          <div 
            v-if="!isMemorizing && getSelectionOrder(word.text) > 0"
            class="absolute top-4 right-4 size-8 bg-brand-green text-white rounded-full flex items-center justify-center font-bold shadow-md"
          >
            {{ getSelectionOrder(word.text) }}
          </div>
        </div>
      </TransitionGroup>
    </div>

    <div v-if="!isMemorizing" class="pt-4 pb-6 shrink-0">
      <button 
        @click="checkAnswer"
        :disabled="currentProblem.userSelection.length < currentProblem.displayWords.length"
        class="w-full py-4 rounded-2xl font-bold text-xl !text-white transition-all shadow-lg"
        :class="currentProblem.userSelection.length < currentProblem.displayWords.length ? 'bg-gray-300' : 'bg-brand-green active:scale-95 shadow-green-900/20'"
      >
        제출하기
      </button>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter, onBeforeRouteLeave } from 'vue-router';
import { useTimer } from '../../composables/useTimer.js';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

// 1. 설정 데이터
const TOTAL_ROUNDS = 3;
const WORD_DISPLAY_TIME = 3; 
const WORD_COUNT = 3;        
const MEMORY_TIME = WORD_DISPLAY_TIME * WORD_COUNT; 
const SELECT_TIME = 15;      

// [확장] 마스터 단어 데이터 풀
const MASTER_WORD_POOL = [
  { text: '사과', icon: '🍎' }, { text: '나무', icon: '🌲' }, { text: '강아지', icon: '🐶' },
  { text: '우주선', icon: '🚀' }, { text: '피자', icon: '🍕' }, { text: '축구공', icon: '⚽' },
  { text: '고양이', icon: '🐱' }, { text: '자동차', icon: '🚗' }, { text: '무지개', icon: '🌈' },
  { text: '컴퓨터', icon: '💻' }, { text: '기타', icon: '🎸' }, { text: '아이스크림', icon: '🍦' },
  { text: '카메라', icon: '📷' }, { text: '비행기', icon: '✈️' }, { text: '선물', icon: '🎁' },
  { text: '물고기', icon: '🐟' }, { text: '모자', icon: '🧢' }, { text: '전화기', icon: '📞' },
  { text: '책', icon: '📚' }, { text: '시계', icon: '⏰' }
];

// 2. 상태 관리
const currentRound = ref(1);
const correctCount = ref(0);
const isGameOver = ref(false);
const isMemorizing = ref(true); 
let wordSequenceTimeout = []; // 여러 타임아웃 관리를 위해 배열로 변경

const {
  timeLeft,
  startTimer: baseStartTimer,
  stopTimer: baseStopTimer,
  pauseTimer
} = useTimer(0, () => {
  isMemorizing.value ? startSelectionPhase() : checkAnswer();
});

// 3. 문제 데이터 (매 라운드 동적으로 할당됨)
const displayList = ref([]);
const shownWords = ref([]); 

const currentProblem = reactive({
  displayWords: [], 
  userSelection: [] 
});

const gameResults = ref([]);


onBeforeRouteLeave((to, from) => {
  // 게임이 종료되지 않은 상태에서 페이지를 떠나려 할 때
  if (!isGameOver.value) {
    // 1. 타이머 일시 정지
    pauseTimer();

    // 2. 사용자 확인
    const confirmLeave = window.confirm(
      "게임이 아직 진행 중입니다!\n지금 나가시면 진행 데이터가 초기화됩니다. 정말 나가시겠습니까?"
    );

    if (confirmLeave) {
      // 나가는 것에 동의하면 이동 허용 (true 반환)
      return true;
    } else {
      // 취소하면 이동 차단 (false 반환)하고 타이머 재개
      resumeTimer(timeLeft.value);
      return false;
    }
  }

  // 게임 종료 상태라면 이동 허용
  return true;
});

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// 새로운 문제 생성
const generateNewQuestion = () => {
  // 1. 전체 풀에서 랜덤하게 섞고 WORD_COUNT만큼 추출
  const randomSet = shuffle(MASTER_WORD_POOL).slice(0, WORD_COUNT);
  
  // 2. 현재 라운드 데이터 세팅
  displayList.value = randomSet;
  currentProblem.displayWords = randomSet.map(item => item.text);
  currentProblem.userSelection = [];
};

const startWordDisplaySequence = () => {
  shownWords.value = [];
  wordSequenceTimeout.forEach(t => clearTimeout(t)); // 기존 타임아웃 청소
  wordSequenceTimeout = [];

  displayList.value.forEach((word, index) => {
    const timeout = setTimeout(() => {
      if (!isMemorizing.value) return; 
      shownWords.value.push(word);
    }, index * WORD_DISPLAY_TIME * 1000);
    wordSequenceTimeout.push(timeout);
  });
};

const startTimer = (time) => {
  stopTimer();
  baseStartTimer(time);
};

const resumeTimer = (remainingTime) => {
  baseStartTimer(remainingTime);
};

const stopTimer = () => {
  baseStopTimer();
  wordSequenceTimeout.forEach(t => clearTimeout(t)); 
};

const startSelectionPhase = () => {
  isMemorizing.value = false;
  stopTimer(); 
  shownWords.value = []; 
  
  setTimeout(() => {
    // 유저가 선택할 때는 단어 순서를 섞어서 보여줌
    shownWords.value = shuffle(displayList.value); 
    startTimer(SELECT_TIME); 
  }, 400);
};

const handleWordClick = (wordText) => {
  if (isMemorizing.value) return;

  const index = currentProblem.userSelection.indexOf(wordText);
  if (index > -1) {
    currentProblem.userSelection.splice(index, 1);
  } else if (currentProblem.userSelection.length < WORD_COUNT) {
    currentProblem.userSelection.push(wordText);
  }
};

const getSelectionOrder = (wordText) => currentProblem.userSelection.indexOf(wordText) + 1;

const getCardStyle = (wordText) => {
  if (isMemorizing.value) return 'bg-white border-transparent';
  return currentProblem.userSelection.includes(wordText)
    ? 'border-brand-green bg-green-50'
    : 'border-white bg-white active:bg-gray-100';
};

const checkAnswer = () => {
  const isCorrect = JSON.stringify(currentProblem.displayWords) === 
                    JSON.stringify(currentProblem.userSelection);

  gameResults.value.push({
    round: currentRound.value,
    isCorrect,
    timeSpent: (isMemorizing.value ? MEMORY_TIME : SELECT_TIME) - timeLeft.value
  });

  if (isCorrect) correctCount.value++;
  nextStep();
};

const nextStep = () => {
  if (currentRound.value < TOTAL_ROUNDS) {
    currentRound.value++;
    resetRound();
  } else {
    // 모든 라운드 종료 시 이탈 방지 가드를 통과시키기 위해 true 설정
    isGameOver.value = true; 
    stopTimer();
    alert(`게임 종료! 맞힌 개수: ${correctCount.value} / ${TOTAL_ROUNDS}`);
    router.push('/'); 
  }
};

const resetRound = () => {
  isMemorizing.value = true;
  generateNewQuestion(); // 매 라운드마다 새로운 문제 생성
  shownWords.value = []; 
  startTimer(MEMORY_TIME); 
  startWordDisplaySequence(); 
};

onMounted(() => {
  generateNewQuestion(); // 첫 시작 시 문제 생성
  startTimer(MEMORY_TIME);
  startWordDisplaySequence(); 
});

onUnmounted(() => stopTimer());
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
  background-color: #f9fafb; /* bg-gray-50 */
}
:deep(.van-nav-bar::after) {
  border-bottom-width: 0 !important;
}

.card-list-enter-active,
.card-list-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-list-leave-to {
  opacity: 0;
  transform: scale(0.95);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}
.slide-up-enter-from { opacity: 0; transform: translateY(10px); }
.slide-up-leave-to { opacity: 0; transform: translateY(-10px); }
</style>