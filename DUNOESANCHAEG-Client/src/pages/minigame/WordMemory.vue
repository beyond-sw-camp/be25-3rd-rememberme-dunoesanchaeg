<template>
  <div class="min-h-screen bg-gray-50 p-6 space-y-6 pb-24">
    <div class="flex justify-between items-end">
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
      class="rounded-full overflow-hidden"
    />

    <div class="text-center space-y-2 py-2">
  <h2 class="text-2xl font-bold text-gray-900 min-h-[3rem]"> <transition name="slide-up" mode="out-in">
      <span :key="isMemorizing" class="block"> {{ isMemorizing ? '나타나는 단어 순서를\n기억하세요' : '기억하신 순서대로\n단어를 선택해 주세요' }}
      </span>
    </transition>
  </h2>
  <p class="text-gray-400 font-medium">
    {{ isMemorizing ? '단어가 하나씩 나타납니다.' : '기억하신 순서대로 단어를 터치하세요.' }}
  </p>
</div>

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

    <div v-if="!isMemorizing" class="fixed bottom-10 left-0 w-full px-6">
      <button 
        @click="checkAnswer"
        :disabled="currentProblem.userSelection.length < 3"
        class="w-full py-4 rounded-2xl font-bold text-xl text-white transition-all shadow-lg"
        :class="currentProblem.userSelection.length < 3 ? 'bg-gray-300' : 'bg-brand-green active:scale-95 shadow-green-900/20'"
      >
        제출하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 1. 설정 데이터
const TOTAL_ROUNDS = 3;
const WORD_DISPLAY_TIME = 3; // 단어 하나당 보여줄 시간 (초)
const WORD_COUNT = 3;        // 기억할 단어 수
const MEMORY_TIME = WORD_DISPLAY_TIME * WORD_COUNT; // 총 암기 시간 자동 계산 (예: 9초)
const SELECT_TIME = 15;      // 선택 단계 제한 시간

// 2. 상태 관리
const currentRound = ref(1);
const correctCount = ref(0);
const timeLeft = ref(0); 
const isGameOver = ref(false);
const isMemorizing = ref(true); 
let timerInterval = null;
let wordSequenceTimeout = null; 

// 3. 문제 데이터
const displayList = ref([
  { text: '사과', icon: '🍎' },
  { text: '나무', icon: '🌲' },
  { text: '강아지', icon: '🐶' }
]);

// 화면에 실제로 보여줄 단어 배열 (빈 배열로 시작)
const shownWords = ref([]); 

const currentProblem = reactive({
  displayWords: ['사과', '나무', '강아지'], // 정답 순서
  userSelection: []                      // 유저 클릭 순서
});

const gameResults = ref([]);

// --- 로직 함수 ---

// 단어를 차례대로 shownWords에 넣어주는 로직
const startWordDisplaySequence = () => {
  shownWords.value = []; // 시작 전 초기화
  
  displayList.value.forEach((word, index) => {
    // 각 단어마다 시간차를 두고 실행
    wordSequenceTimeout = setTimeout(() => {
      // 암기 단계가 끝났으면 실행 안 함
      if (!isMemorizing.value) return; 
      
      shownWords.value.push(word);
      
      // 마지막 단어까지 다 보여줬다면
      if (shownWords.value.length === WORD_COUNT) {
        // 별도의 처리 없이 메인 타이머가 끝나길 기다림
      }
    }, index * WORD_DISPLAY_TIME * 1000); 
  });
};

// 메인 게임 타이머 (카운트다운)
const startTimer = (time) => {
  stopTimer();
  timeLeft.value = time;
  timerInterval = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--;
    } else {
      // 시간 초과 시 자동 처리
      isMemorizing.value ? startSelectionPhase() : checkAnswer();
    }
  }, 1000);
};

const stopTimer = () => {
  if (timerInterval) clearInterval(timerInterval);
  if (wordSequenceTimeout) clearTimeout(wordSequenceTimeout); 
};

// 암기 단계 종료 -> 선택 단계 시작
const startSelectionPhase = () => {
  isMemorizing.value = false;
  stopTimer(); 
  
  // 1. 카드 배열 초기화(UI도 지워짐)
  shownWords.value = []; 
  
  // 2. 카드 섞기
  setTimeout(() => {
    const shuffled = [...displayList.value].sort(() => Math.random() - 0.5);
    shownWords.value = shuffled; 
    
    // 3. 카드가 나타난 시점부터 선택 타이머 시작
    startTimer(SELECT_TIME); 
  }, 400);
};

// 카드 클릭 핸들러 
const handleWordClick = (wordText) => {
  if (isMemorizing.value) return;

  const index = currentProblem.userSelection.indexOf(wordText);
  if (index > -1) {
    currentProblem.userSelection.splice(index, 1);
  } else if (currentProblem.userSelection.length < 3) {
    currentProblem.userSelection.push(wordText);
  }
};

// 카드 스타일 및 선택 순서 헬퍼
const getSelectionOrder = (wordText) => currentProblem.userSelection.indexOf(wordText) + 1;

const getCardStyle = (wordText) => {
  if (isMemorizing.value) return 'bg-white border-transparent';
  return currentProblem.userSelection.includes(wordText)
    ? 'border-brand-green bg-green-50'
    : 'border-white bg-white active:bg-gray-100';
};

// 채점 및 다음 단계 
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
    isGameOver.value = true;
    stopTimer();
    console.log("=== 게임 최종 결과 ===");
    console.log("총 맞힌 개수:", correctCount.value);
    console.log("상세 라운드 기록:", gameResults.value);
    
    alert(`게임 종료! 맞힌 개수: ${correctCount.value} / ${TOTAL_ROUNDS}`);
    router.push('/'); 
  }
};

const resetRound = () => {
  isMemorizing.value = true;
  currentProblem.userSelection = [];
  // TODO: 다음 라운드 데이터 세팅 로직 필요(더미 데이터 추가 시)
  
  shownWords.value = []; // 화면 초기화
  startTimer(MEMORY_TIME); // 전체 카운트다운 시작
  startWordDisplaySequence(); 
};

// 라이프사이클
onMounted(() => {
  startTimer(MEMORY_TIME);
  startWordDisplaySequence(); 
});
onUnmounted(() => stopTimer());
</script>

<style scoped>
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