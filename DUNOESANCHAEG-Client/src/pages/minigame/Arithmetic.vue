<template>
  <div class="min-h-dvh bg-brand-bg flex flex-col relative pb-24">

    <GameGuide
      v-if="!isGameStarted"
      title="사칙연산"
      description="표시되는 사칙연산 식을 보고<br/>올바른 정답을 빠르게 선택하세요."
      icon-name="orders-o"
      @start="startGame"
      @exit="goBack"
    />

    <template v-else>
      <AppNavBar title="사칙연산" />

    <div class="p-6 flex flex-col flex-1 relative">
      <div class="flex justify-between items-end shrink-0 mt-2 mb-3">
        <div>
          <span class="text-brand-green font-black text-3xl">{{
            currentRound
          }}</span>
          <span class="text-gray-400 font-bold text-lg">
            / {{ TOTAL_ROUNDS }}</span
          >
        </div>
        <div class="text-right">
          <div class="flex items-center gap-2 text-brand-green font-bold">
            <span class="text-2xl">{{ timeLeft }}</span
            >초 남음
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
        class="rounded-full overflow-hidden shrink-0 mb-3"
      />

      <div class="text-center space-y-1 py-1 shrink-0 mb-2">
        <h2 class="text-2xl font-bold text-gray-900 leading-[1.3] my-3">
          다음 수식을 계산하고<br />정답을 골라주세요
        </h2>
      </div>

      <div class="flex flex-col w-full mb-auto shrink-0 relative">
        <Transition name="fade" mode="out-in" appear>
          <div
            :key="currentRound"
            class="w-full flex flex-col shrink-0 relative"
          >
            <div
              class="bg-white from-white to-green-50 rounded-[32px] shadow-sm py-16 sm:py-20 min-h-[160px] sm:min-h-[200px] flex justify-center items-center mb-6 shrink-0 border border-white transition-all overflow-visible px-2 sm:px-6 w-full box-border"
            >
              <div
                class="text-[2.5rem] min-[360px]:text-[3rem] sm:text-6xl font-black text-[#1B2B3B] flex flex-row items-center justify-center leading-none whitespace-nowrap text-center"
              >
                <span>{{ currentProblem.a }}</span>
                <span class="mx-1.5 sm:mx-4">{{ currentProblem.op }}</span>
                <span>{{ currentProblem.b }}</span>
                <span class="mx-1.5 sm:mx-4">=</span>
                <span
                  class="text-brand-green font-black text-[2.75rem] min-[360px]:text-[3.25rem] sm:text-[4rem]"
                  >?</span
                >
              </div>
            </div>

            <div class="grid grid-cols-2 gap-4 shrink-0">
              <div
                v-for="(choice, index) in currentProblem.options"
                :key="index"
                @click="selectAnswer(choice)"
                class="bg-white rounded-[32px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] py-6 flex flex-col items-center justify-center cursor-pointer transition-all border-[3px]"
                :class="getChoiceClass(choice)"
              >
                <span
                  class="text-slate-500 font-bold mb-2 text-sm transition-colors"
                  :class="
                    isWrongFlash && selectedAnswer === choice
                      ? 'text-rose-400'
                      : ''
                  "
                  >보기{{ index + 1 }}</span
                >
                <span
                  class="text-4xl sm:text-5xl font-black transition-colors"
                  :class="getTextColor(choice)"
                  >{{ choice }}</span
                >
              </div>
            </div>
          </div>
        </Transition>
      </div>
      </div>
    
    <CustomErrorDialog :show="isWrongFlash">
      틀렸습니다!<br/>다시 한번<br/>곰곰히 생각해보세요 🤔
    </CustomErrorDialog>

    <CustomSuccessDialog :show="isCorrectFlash">
      정답입니다!<br/>아주 잘하셨어요 👏
    </CustomSuccessDialog>

    <CustomConfirmDialog 
      :show="showExitConfirm" 
      @confirm="handleConfirmExit" 
      @cancel="handleCancelExit" 
    >
      게임이 아직 진행 중입니다!<br />지금 나가시면 진행 데이터가<br />모두 초기화됩니다.<br />정말 나가시겠습니까?
    </CustomConfirmDialog>

    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useTimer } from "../../composables/useTimer.js";
import GameGuide from "../../components/minigame/GameGuide.vue";
import AppNavBar from "../../components/common/AppNavBar.vue";
import CustomErrorDialog from "../../components/common/CustomErrorDialog.vue";
import CustomSuccessDialog from "../../components/common/CustomSuccessDialog.vue";
import CustomConfirmDialog from "../../components/common/CustomConfirmDialog.vue";
import { saveCognitiveGameResult } from '../../api/minigame.js';

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const TOTAL_ROUNDS = 3;
const TIME_LIMIT = 15;

const currentRound = ref(1);
const correctCount = ref(0);
const wrongCount = ref(0);
const timeoutCount = ref(0);
const gameStartTime = ref(0);
const isGameOver = ref(false);
const isGameStarted = ref(false);
const selectedAnswer = ref(null);
const isWrongFlash = ref(false);
const isCorrectFlash = ref(false);
const showExitConfirm = ref(false);
let resolveRouteLeave = null;

const startGame = () => {
    isGameStarted.value = true;
    gameStartTime.value = Date.now();
    generateProblems();
    startTimer(TIME_LIMIT);
};

const handleTimeoutPhase = () => {
  timeoutCount.value++;
  handleRoundEnd(false);
};

const { timeLeft, startTimer, stopTimer } = useTimer(TIME_LIMIT, () =>
  handleTimeoutPhase(),
);

const problems = ref([]);

const generateProblems = () => {
  problems.value = [];
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const isAdd = Math.random() > 0.5;
    let a, b, answer;

    if (isAdd) {
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 10) + 5;
      answer = a + b;
    } else {
      a = Math.floor(Math.random() * 20) + 20;
      b = Math.floor(Math.random() * 10) + 5;
      answer = a - b;
    }

    const optionsSet = new Set([answer]);
    while (optionsSet.size < 4) {
      const offset = Math.floor(Math.random() * 9) - 4;
      if (offset !== 0 && answer + offset > 0) {
        optionsSet.add(answer + offset);
      }
    }

    const options = Array.from(optionsSet).sort((x, y) => x - y);

    problems.value.push({
      a,
      b,
      op: isAdd ? "+" : "-",
      answer,
      options,
    });
  }
};

const currentProblem = computed(
  () =>
    problems.value[currentRound.value - 1] || {
      a: 0,
      b: 0,
      op: "+",
      answer: 0,
      options: [],
    },
);

const getChoiceClass = (choice) => {
  if (selectedAnswer.value === choice) {
    if (isWrongFlash.value) {
      return "border-rose-300 bg-rose-50 scale-[0.98]";
    }
    return "border-brand-green text-brand-green scale-[0.98]";
  }
  return "border-transparent active:scale-[0.98] active:bg-gray-50";
};

const getTextColor = (choice) => {
  if (selectedAnswer.value === choice) {
    if (isWrongFlash.value) return "text-rose-400";
    return "text-brand-green";
  }
  return "text-[#1B2B3B]";
};

const selectAnswer = (choice) => {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = choice;
  stopTimer();

  const isCorrect = choice === currentProblem.value.answer;
  if (isCorrect) {
    correctCount.value++;
    isCorrectFlash.value = true;
    setTimeout(() => {
      isCorrectFlash.value = false;
      handleRoundEnd(true);
    }, 1200);
  } else {
    isWrongFlash.value = true;
    wrongCount.value++;

    setTimeout(() => {
      isWrongFlash.value = false;
      selectedAnswer.value = null;
      startTimer(timeLeft.value);
    }, 1500);
  }
};

const handleRoundEnd = (isCorrect) => {
  selectedAnswer.value = null;
  if (currentRound.value < TOTAL_ROUNDS) {
    currentRound.value++;
    startTimer(TIME_LIMIT);
  } else {
    isGameOver.value = true;
    stopTimer();

    const totalPlayedTime = Math.floor(
      (Date.now() - gameStartTime.value) / 1000,
    );
    const payload = {
      gameType: "ARITHMETIC",
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      timeoutCount: timeoutCount.value,
      totalTryCount: correctCount.value + wrongCount.value + timeoutCount.value,
      totalPlayedTime: totalPlayedTime,
    };

    saveCognitiveGameResult(payload)
      .then(() => {
      })
      .catch((err) => {
        console.error("게임 결과 저장 중 오류가 발생했습니다:", err);
      })
      .finally(() => {
        // TODO : 결과 출력 모달 추가
        router.push("/");
      });
  }
};

onBeforeRouteLeave(async (to, from) => {
  if (!isGameStarted.value) return true;
  if (!isGameOver.value) {
    const { pauseTimer, resumeTimer } = useTimer(); 
    stopTimer();
    showExitConfirm.value = true;

    const canLeave = await new Promise((resolve) => {
      resolveRouteLeave = resolve;
    });

    showExitConfirm.value = false;
    if (!canLeave) {
      startTimer(timeLeft.value);
    }
    return canLeave;
  }
  return true;
});

const handleConfirmExit = () => {
  if (resolveRouteLeave) resolveRouteLeave(true);
};

const handleCancelExit = () => {
  if (resolveRouteLeave) resolveRouteLeave(false);
};

onMounted(() => {
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
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.fade-enter-active,
.fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
