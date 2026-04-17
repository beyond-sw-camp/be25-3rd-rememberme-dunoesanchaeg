<template>
  <div class="min-h-dvh bg-gray-50 flex flex-col relative">
    <GameGuide
      v-if="!isGameStarted"
      title="단어 기억"
      description="처음에 보여드리는 단어의 순서를<br/>기억해서 순서대로 선택하세요."
      icon-name="apps-o"
      @start="startGame"
      @exit="goBack"
    />

    <template v-else>
      <AppNavBar title="단어 연상 게임" />

      <div class="p-6 flex flex-col space-y-4 flex-1 relative">
        <div class="flex justify-between items-end shrink-0">
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
          :percentage="
            (timeLeft / (isMemorizing ? MEMORY_TIME : SELECT_TIME)) * 100
          "
          pivot-text=""
          color="#1B391E"
          track-color="#E5E7EB"
          stroke-width="8"
          class="rounded-full overflow-hidden shrink-0"
        />

        <div class="text-center py-1 shrink-0">
          <h2 class="text-2xl font-bold text-gray-900 min-h-[3rem]">
            <transition name="slide-up" mode="out-in">
              <span :key="isMemorizing" class="block whitespace-pre-line">
                {{
                  isMemorizing
                    ? "나타나는 단어 순서를\n기억하세요"
                    : "기억하신 순서대로\n단어를 선택해 주세요"
                }}
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
              v-for="word in shownWords"
              :key="word.text"
              @click="handleWordClick(word.text)"
              :class="[
                'relative p-6 rounded-[24px] border-2 transition-all duration-300 flex flex-col items-center justify-center gap-3 shadow-sm cursor-pointer',
                getCardStyle(word.text),
              ]"
            >
              <div
                class="size-12 bg-gray-50 rounded-full flex items-center justify-center text-4xl"
              >
                {{ word.icon }}
              </div>
              <span
                class="text-xl font-bold transition-colors"
                :class="getTextColor(word.text)"
                >{{ word.text }}</span
              >

              <div
                v-if="!isMemorizing && getSelectionOrder(word.text) > 0"
                class="absolute top-4 right-4 size-8 bg-brand-green text-[var(--color-button-text)] rounded-full flex items-center justify-center font-bold shadow-md"
              >
                {{ getSelectionOrder(word.text) }}
              </div>
            </div>
          </TransitionGroup>
        </div>

        <div v-if="!isMemorizing" class="pt-2 pb-6 shrink-0">
          <button
            @click="checkAnswer"
            :disabled="
              currentProblem.userSelection.length <
              currentProblem.displayWords.length
            "
            class="w-full py-4 rounded-2xl font-bold text-xl !text-[var(--color-button-text)] transition-all shadow-lg"
            :class="
              currentProblem.userSelection.length <
              currentProblem.displayWords.length
                ? 'bg-gray-300'
                : 'bg-brand-green active:scale-95 shadow-green-900/20'
            "
          >
            제출하기
          </button>
        </div>
      </div>

      <CustomErrorDialog :show="isWrongFlash">
        틀렸습니다!<br />다시 한번<br />곰곰이 생각해보세요 🤔
      </CustomErrorDialog>

      <CustomSuccessDialog :show="isCorrectFlash">
        정답입니다!<br />아주 잘하셨어요 👏
      </CustomSuccessDialog>

      <CustomConfirmDialog
        :show="showExitConfirm"
        @confirm="handleConfirmExit"
        @cancel="handleCancelExit"
      >
        게임이 아직 진행 중입니다!<br />지금 나가시면 진행 데이터가<br />모두
        초기화됩니다.<br />정말 나가시겠습니까?
      </CustomConfirmDialog>
    </template>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useTimer } from "../../composables/useTimer.js";
import CustomErrorDialog from "../../components/common/CustomErrorDialog.vue";
import CustomSuccessDialog from "../../components/common/CustomSuccessDialog.vue";
import CustomConfirmDialog from "../../components/common/CustomConfirmDialog.vue";
import GameGuide from "../../components/minigame/GameGuide.vue";
import AppNavBar from "../../components/common/AppNavBar.vue";
import { saveCognitiveGameResult } from "../../api/minigame.js";
import MASTER_WORD_POOL from "../../data/word_memory_data.json";

const router = useRouter();

const goBack = () => {
  router.go(-1);
};

const TOTAL_ROUNDS = 3;
const WORD_DISPLAY_TIME = 3;
const WORD_COUNT = 3;
const MEMORY_TIME = WORD_DISPLAY_TIME * WORD_COUNT;
const SELECT_TIME = 15;

const currentRound = ref(1);
const correctCount = ref(0);
const wrongCount = ref(0);
const timeoutCount = ref(0);
const gameStartTime = ref(0);
const isGameOver = ref(false);
const isGameStarted = ref(false);
const isMemorizing = ref(true);
const isWrongFlash = ref(false);
const isCorrectFlash = ref(false);
const showExitConfirm = ref(false);
let resolveRouteLeave = null;
let wordSequenceTimeout = [];

const startGame = () => {
  isGameStarted.value = true;
  gameStartTime.value = Date.now();
  generateNewQuestion();
  startTimer(MEMORY_TIME);
  startWordDisplaySequence();
};

const handleTimeoutPhase = () => {
  timeoutCount.value++;
  nextStep();
};

const {
  timeLeft,
  startTimer: baseStartTimer,
  stopTimer: baseStopTimer,
  pauseTimer,
} = useTimer(0, () => {
  isMemorizing.value ? startSelectionPhase() : handleTimeoutPhase();
});

const displayList = ref([]);
const shownWords = ref([]);

const currentProblem = reactive({
  displayWords: [],
  userSelection: [],
});

const gameResults = ref([]);

onBeforeRouteLeave(async (to, from) => {
  if (!isGameStarted.value) return true;

  if (!isGameOver.value) {
    pauseTimer();
    showExitConfirm.value = true;

    const canLeave = await new Promise((resolve) => {
      resolveRouteLeave = resolve;
    });

    showExitConfirm.value = false;

    if (!canLeave) {
      resumeTimer(timeLeft.value);
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

const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const generateNewQuestion = () => {
  const randomSet = shuffle(MASTER_WORD_POOL).slice(0, WORD_COUNT);

  displayList.value = randomSet;
  currentProblem.displayWords = randomSet.map((item) => item.text);
  currentProblem.userSelection = [];
};

const startWordDisplaySequence = () => {
  shownWords.value = [];
  wordSequenceTimeout.forEach((t) => clearTimeout(t));
  wordSequenceTimeout = [];

  displayList.value.forEach((word, index) => {
    const timeout = setTimeout(
      () => {
        if (!isMemorizing.value) return;
        shownWords.value.push(word);
      },
      index * WORD_DISPLAY_TIME * 1000,
    );
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
  wordSequenceTimeout.forEach((t) => clearTimeout(t));
};

const startSelectionPhase = () => {
  isMemorizing.value = false;
  stopTimer();
  shownWords.value = [];

  setTimeout(() => {
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

const getSelectionOrder = (wordText) =>
  currentProblem.userSelection.indexOf(wordText) + 1;

const getCardStyle = (wordText) => {
  if (isMemorizing.value) return "bg-white border-transparent";
  if (currentProblem.userSelection.includes(wordText)) {
    if (isWrongFlash.value) {
      return "border-rose-300 bg-rose-50";
    }
    return "border-brand-green bg-green-50";
  }
  return "border-white bg-white active:bg-gray-100";
};

const getTextColor = (wordText) => {
  if (isMemorizing.value) return "text-[#1B2B3B]";
  if (currentProblem.userSelection.includes(wordText)) {
    if (isWrongFlash.value) return "text-rose-400";
    return "text-brand-green";
  }
  return "text-[#1B2B3B]";
};

const checkAnswer = () => {
  const isCorrect =
    JSON.stringify(currentProblem.displayWords) ===
    JSON.stringify(currentProblem.userSelection);

  if (isCorrect) {
    gameResults.value.push({
      round: currentRound.value,
      isCorrect,
      timeSpent:
        (isMemorizing.value ? MEMORY_TIME : SELECT_TIME) - timeLeft.value,
    });
    correctCount.value++;
    isCorrectFlash.value = true;
    setTimeout(() => {
      isCorrectFlash.value = false;
      nextStep();
    }, 1200);
  } else {
    isWrongFlash.value = true;
    wrongCount.value++;

    setTimeout(() => {
      isWrongFlash.value = false;
      currentProblem.userSelection = [];
    }, 1500);
  }
};

const nextStep = () => {
  if (currentRound.value < TOTAL_ROUNDS) {
    currentRound.value++;
    resetRound();
  } else {
    isGameOver.value = true;
    stopTimer();

    const totalPlayedTime = Math.floor(
      (Date.now() - gameStartTime.value) / 1000,
    );
    const payload = {
      gameType: "WORD_MEMORY",
      correctCount: correctCount.value,
      wrongCount: wrongCount.value,
      timeoutCount: timeoutCount.value,
      totalTryCount: correctCount.value + wrongCount.value,
      totalPlayedTime: totalPlayedTime,
    };

    saveCognitiveGameResult(payload)
      .then(() => {
        // 결과 저장 성공
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

const resetRound = () => {
  isMemorizing.value = true;
  generateNewQuestion();
  shownWords.value = [];
  startTimer(MEMORY_TIME);
  startWordDisplaySequence();
};

onMounted(() => {
  // 처음 진입 시에는 explanation 스크린 대기
});

onUnmounted(() => stopTimer());
</script>

<style scoped>


.card-list-enter-active,
.card-list-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
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
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
