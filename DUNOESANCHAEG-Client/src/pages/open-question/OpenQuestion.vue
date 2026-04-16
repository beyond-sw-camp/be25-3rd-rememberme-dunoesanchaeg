<template>
  <div class="min-h-screen bg-brand-bg pb-safe">
    <AppNavBar title="개방형질문" />

    <div class="w-full px-6 pb-8">

      <div
          v-if="isLoading"
          class="w-full rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-10 shadow-sm mt-4"
      >
        <p class="text-base text-[var(--color-text-main)] font-medium">
          페이지를 준비하고 있어요! 😊
        </p>
      </div>

      <div
          v-else-if="errorMessage"
          class="w-full rounded-3xl border border-red-100 bg-red-50 px-6 py-6 space-y-4 mt-4"
      >
        <p class="text-xl font-bold text-red-600">질문 정보를 불러오지 못했습니다.</p>
        <p class="text-sm text-red-400 whitespace-pre-line">
          {{ errorMessage }}
        </p>

        <button
            type="button"
            @click="initializePage"
            class="w-full h-12 rounded-2xl bg-brand-green text-[var(--color-button-text)]! font-bold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          다시 시도
        </button>
      </div>

      <Transition name="fade" mode="out-in" appear>
        <div v-if="!isLoading && !errorMessage" :key="questionText" class="space-y-5 mt-4">

          <div class="question-card">
            <div class="question-label">
              <span class="question-label-icon">💭</span>
              <span>오늘의 질문</span>
            </div>
            <p class="question-text">
              {{ questionText }}
            </p>
            <p class="question-hint">질문을 읽고 충분히 생각해보세요.</p>
          </div>

          <div class="answer-card">
            <div class="flex items-center justify-between mb-3">
              <p class="text-lg font-bold text-[var(--color-text-main)] flex items-center gap-1.5">
                <span class="text-base">📝</span> 나의 답변
              </p>
              <p class="text-xs font-medium text-[var(--color-text-muted)] bg-[var(--color-surface-variant)] rounded-full px-2.5 py-1">{{ answerText.length }}/300</p>
            </div>

            <textarea
                v-model="answerText"
                maxlength="300"
                rows="5"
                placeholder="떠오르는 생각을 편하게 적어보세요 ^^"
                class="w-full resize-none rounded-2xl border border-[var(--color-surface-variant)] bg-[var(--color-surface-variant)] px-4 py-4 text-base text-[var(--color-text-main)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-all"
            />

            <p class="mt-3 text-sm text-[var(--color-text-sub)] font-medium flex items-start gap-1">
              <span class="shrink-0">💡</span>
              <span>입력한 내용은 저장되지 않습니다. 기억을 상기시키는 것을 목표로 기록해보세요!</span>
            </p>
          </div>

          <!-- 버튼 영역 -->
          <div class="space-y-3 pt-1">
            <button
                type="button"
                :disabled="isSubmitting || !canComplete"
                @click="handleComplete"
                class="w-full h-14 rounded-2xl font-bold shadow-md transition-all disabled:cursor-not-allowed disabled:active:scale-100"
                :class="canComplete
                  ? 'bg-brand-green text-[var(--color-button-text)]! hover:opacity-90 active:scale-[0.98]'
                  : 'bg-[var(--color-surface-variant)] text-[var(--color-text-muted)]!'"
            >
              <template v-if="isSubmitting">처리 중...</template>
              <template v-else-if="!canComplete">{{ remainingCountdown }}초 후 제출 가능</template>
              <template v-else>완료하기</template>
            </button>

            <button
                type="button"
                :disabled="isSubmitting"
                @click="handleExit"
                class="w-full h-14 rounded-2xl bg-[var(--color-surface-variant)] text-[var(--color-text-muted)] font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              나가기
            </button>
          </div>
        </div>
      </Transition>
    </div>

    <CustomConfirmDialog
      :show="showExitConfirm"
      @confirm="handleConfirmExit"
      @cancel="handleCancelExit"
    >
      지금 나가면 오늘은<br/>다시 참여할 수 없습니다.<br/>정말 나가시겠습니까? 😭
    </CustomConfirmDialog>

    <CustomErrorDialog :show="showErrorDialog">
      {{ errorDialogMessage }}
    </CustomErrorDialog>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router';
import AppNavBar from '@/components/common/AppNavBar.vue';
import CustomConfirmDialog from '@/components/common/CustomConfirmDialog.vue';
import CustomErrorDialog from '@/components/common/CustomErrorDialog.vue';
import { useOpenQuestion } from '@/composables/useOpenQuestion'

const {
  isLoading,
  isSubmitting,
  errorMessage,
  questionText,
  answerText,
  canComplete,
  remainingCountdown,
  isLeavingByAction,
  showExitConfirm,
  showErrorDialog,
  errorDialogMessage,
  validateEntry,
  initializePage,
  performExit,
  requestExitConfirm,
  handleConfirmExit,
  handleCancelExit,
  handleComplete,
  handleExit
} = useOpenQuestion();

onMounted(() => {
  if (!validateEntry()) return
  initializePage()
});

onBeforeRouteLeave(async (to, from, next) => {
  const hasStarted = !isLoading.value && !!questionText.value;

  // 질문 시작 전, 처리 중, 명시적 이탈 등의 상황
  if (!hasStarted || isSubmitting.value || isLeavingByAction.value) {
    next();
    return;
  }

  const confirmed = await requestExitConfirm();

  if (!confirmed) {
    next(false);
    return;
  }

  try {
    await performExit();
    next();
  } catch (error) {
    console.error('라우트 이동 중 개방형질문 이탈 실패:', error);
    next(false);
  }
});
</script>

<style scoped>
.question-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 24px;
  padding: 28px 24px 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}

.question-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: calc(1.2rem * var(--font-scale));
  font-weight: 800;
  color: var(--color-brand-green);
  background: rgba(27, 57, 30, 0.08);
  border-radius: 999px;
  padding: 5px 14px;
  margin-bottom: 20px;
}

.question-label-icon {
  font-size: calc(1.15rem * var(--font-scale));
}

.question-text {
  font-size: calc(1.75rem * var(--font-scale));
  font-weight: 800;
  color: var(--color-text-main);
  line-height: 1.55;
  word-break: keep-all;
  letter-spacing: -0.02em;
}

.question-hint {
  margin-top: 18px;
  font-size: var(--text-lg);
  color: var(--color-text-muted);
  font-weight: 500;
}

.answer-card {
  background: var(--color-surface);
  border: 2px solid var(--color-border);
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
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