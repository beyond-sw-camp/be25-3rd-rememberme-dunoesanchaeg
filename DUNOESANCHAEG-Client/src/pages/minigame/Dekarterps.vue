<template>
  <div class="min-h-dvh bg-brand-bg flex flex-col relative pb-24">
    <GameGuide
      v-if="!isGameStarted"
      title="판단력 게임"
      description="나의 미션과 상대방의 카드를 보고<br/>이길지, 질지, 비길지 판단하여<br/>알맞은 카드를 선택하세요."
      icon-name="friends-o"
      @start="startGame"
      @exit="goBack"
    />

    <template v-else>
      <AppNavBar title="판단력 게임" />

      <div class="p-6 flex flex-col flex-1 relative">
        <div class="flex justify-between items-end shrink-0 mt-2 mb-3">
          <div>
            <span class="text-brand-green font-black text-3xl">{{
              currentRound
            }}</span>
            <span class="text-text-muted font-bold text-lg">
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
          color="var(--color-brand-green)"
          track-color="var(--color-surface-variant)"
          stroke-width="8"
          class="rounded-full overflow-hidden shrink-0 mb-6"
        />

        <div class=" flex flex-col w-full mb-auto shrink-0 relative">
          <Transition name="fade" mode="out-in" appear>
            <div
              :key="currentRound"
              class="w-full flex flex-col shrink-0 relative"
            >
              <div
                class="bg-brand-bg !border-border rounded-[28px] py-6 flex flex-col items-center justify-center mb-4 shadow-md text-[var(--color-button-text)]"
              >
                <span class="text-xl text-text-main font-bold opacity-90 mb-2">미션</span>
                <span class="text-3xl text-text-main font-black tracking-tight">{{
                  currentProblem.missionText
                }}</span>
              </div>

              <div
                class="bg-surface rounded-[32px] shadow-sm py-8 sm:py-12 min-h-[140px] sm:min-h-[180px] flex flex-col justify-center items-center mt-4 mb-6 shrink-0 border-2 border-border transition-all overflow-visible px-4 w-full box-border"
              >
                <span class="text-text-sub font-bold mb-4 text-2xl">상대의 손</span>
                <div
                  class="size-20 bg-surface-variant rounded-full flex items-center justify-center mb-3 shadow-sm border border-border"
                >
                  <img
                    :src="getImgUrl(currentProblem.opponentImg)"
                    class="w-15 h-15 object-contain"
                    alt="상대방 손"
                  />
                </div>
                <span class="text-text-main font-black text-2xl">{{
                  currentProblem.opponentText
                }}</span>
              </div>

              <div class="grid grid-cols-3 gap-2 sm:gap-3 shrink-0">
                <div
                  v-for="choice in choices"
                  :key="choice.id"
                  @click="selectAnswer(choice.id)"
                  class="bg-surface rounded-[24px] shadow-[0_4px_12px_rgba(0,0,0,0.03)] py-3 sm:py-4 flex flex-col items-center justify-center cursor-pointer transition-all border-[3px]"
                  :class="getChoiceClass(choice.id)"
                >
                  <img
                    :src="getImgUrl(choice.id)"
                    class="w-13 h-13 sm:w-14 sm:h-14 object-contain mb-1 transition-transform"
                    :class="
                      isWrongFlash && selectedAnswer === choice.id
                        ? 'scale-90 opacity-70'
                        : ''
                    "
                    alt="내 선택지"
                  />
                  <span
                    class="text-lg sm:text-xl font-black transition-colors"
                    :class="getTextColor(choice.id)"
                  >
                    {{ choice.name }}
                  </span>
                </div>
              </div>
            </div>
          </Transition>
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
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRouter, onBeforeRouteLeave } from "vue-router";
import { useTimer } from "../../composables/useTimer.js";
import problemsData from "../../data/rps_problems.json";
import CustomErrorDialog from "../../components/common/CustomErrorDialog.vue";
import CustomSuccessDialog from "../../components/common/CustomSuccessDialog.vue";
import CustomConfirmDialog from "../../components/common/CustomConfirmDialog.vue";
import GameGuide from "../../components/minigame/GameGuide.vue";
import AppNavBar from "../../components/common/AppNavBar.vue";
import { saveCognitiveGameResult } from "../../api/minigame.js";

import imgRock from "../../assets/rps/rock.png";
import imgScissors from "../../assets/rps/scissors.png";
import imgPaper from "../../assets/rps/paper.png";

const imgMap = {
  rock: imgRock,
  scissors: imgScissors,
  paper: imgPaper,
};

const getImgUrl = (key) => imgMap[key];

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

const problems = ref([]);
const choices = [
  { id: "scissors", name: "가위" },
  { id: "rock", name: "바위" },
  { id: "paper", name: "보" },
];

const handleTimeoutPhase = () => {
  timeoutCount.value++;
  handleRoundEnd(false);
};

const { timeLeft, startTimer, stopTimer, pauseTimer } = useTimer(
  TIME_LIMIT,
  () => handleTimeoutPhase(),
);

const generateProblems = () => {
  problems.value = [];
  for (let i = 0; i < TOTAL_ROUNDS; i++) {
    const randIndex = Math.floor(Math.random() * problemsData.length);
    problems.value.push(problemsData[randIndex]);
  }
};

const currentProblem = computed(
  () => problems.value[currentRound.value - 1] || {},
);

const getChoiceClass = (choiceId) => {
  if (selectedAnswer.value === choiceId) {
    if (isWrongFlash.value) {
      return "border-error bg-surface scale-[0.98]";
    }
    return "border-brand-green text-brand-green scale-[0.98]";
  }
  return "border-border active:scale-[0.98] active:bg-surface-variant";
};

const getTextColor = (choiceId) => {
  if (selectedAnswer.value === choiceId) {
    if (isWrongFlash.value) return "text-error";
    return "text-brand-green";
  }
  return "text-text-main";
};

const selectAnswer = (choiceId) => {
  if (selectedAnswer.value !== null) return;
  selectedAnswer.value = choiceId;
  stopTimer();

  const isCorrect = choiceId === currentProblem.value.correctAnswer;
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
      gameType: "DESCARTES_RPS",
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
  // 처음 진입 시에는 explanation 스크린 대기
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
