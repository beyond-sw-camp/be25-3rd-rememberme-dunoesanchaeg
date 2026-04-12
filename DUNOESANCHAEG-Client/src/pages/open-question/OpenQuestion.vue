<template>
  <div class="min-h-screen bg-brand-bg px-6 py-8 pb-safe">
    <div class="w-full">
      <div class="mb-8 flex items-start justify-between gap-4">
        <div>
          <p class="text-sm font-bold text-brand-green">두뇌산책</p>
          <h1 class="text-3xl font-black text-brand-green tracking-tight mt-2">
            개방형질문
          </h1>
          <p class="text-base text-gray-600 font-medium mt-2">
            질문을 읽고 충분히 생각해보세요.
          </p>
        </div>

        <div class="shrink-0 rounded-2xl bg-white border border-gray-200 px-4 py-3 shadow-sm text-right min-w-[110px]">
          <p class="text-xs font-bold text-gray-400">소요 시간</p>
          <p class="text-2xl font-black text-brand-green mt-1">
            {{ formattedTime }}
          </p>
        </div>
      </div>

      <div
          v-if="isLoading"
          class="w-full rounded-[--radius-card] border border-gray-100 bg-white px-6 py-10 shadow-sm"
      >
        <p class="text-base text-gray-500 font-medium">
          페이지를 준비하고 있어요! 😊
        </p>
      </div>

      <div
          v-else-if="errorMessage"
          class="w-full rounded-[--radius-card] border border-red-100 bg-red-50 px-6 py-6 space-y-4"
      >
        <p class="text-xl font-bold text-red-600">질문 정보를 불러오지 못했습니다.</p>
        <p class="text-sm text-red-400 whitespace-pre-line">
          {{ errorMessage }}
        </p>

        <button
            type="button"
            @click="initializePage"
            class="w-full h-12 rounded-2xl bg-brand-green text-white! font-bold hover:opacity-90 active:scale-[0.98] transition-all"
        >
          다시 시도
        </button>
      </div>

      <template v-else>
        <div class="space-y-6">
          <div
              class="w-full rounded-[--radius-card] border border-gray-100 bg-white px-6 py-8 shadow-sm"
          >
            <p class="text-3xl font-bold text-gray-800 leading-relaxed break-keep">
              {{ questionText }}
            </p>
          </div>

          <div
              class="w-full rounded-[--radius-card] border border-gray-100 bg-white px-6 py-6 shadow-sm"
          >
            <div class="flex items-center justify-between mb-3">
              <p class="text-lg font-bold text-gray-600 flex items-center gap-1">
                답변 입력 <span class="text-base">📝</span>
              </p>
              <p class="text-xs text-gray-400">{{ answerText.length }}/300</p>
            </div>

            <textarea
                v-model="answerText"
                maxlength="300"
                rows="6"
                placeholder="떠오르는 생각을 편하게 적어보세요 ^^"
                class="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />

            <p class="mt-2 text-xs text-orange-700 font-medium">
              * 입력한 내용은 저장되지 않습니다.
            </p>
          </div>

          <div class="space-y-4">
            <button
                type="button"
                :disabled="isSubmitting || !canComplete"
                @click="handleComplete"
                class="w-full h-14 rounded-2xl bg-brand-green text-white! font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {{ isSubmitting ? '처리 중...' : '완료하기' }}
            </button>

            <button
                type="button"
                :disabled="isSubmitting"
                @click="handleExit"
                class="w-full h-14 rounded-2xl bg-gray-100 text-gray-700 font-bold hover:bg-gray-200 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              나가기
            </button>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { onBeforeRouteLeave } from 'vue-router';
import { useOpenQuestion } from '@/composables/useOpenQuestion'

const {
  isLoading,
  isSubmitting,
  errorMessage,
  questionText,
  answerText,
  formattedTime,
  canComplete,
  isLeavingByAction,
  validateEntry,
  initializePage,
  performExit,
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

  const confirmed = window.confirm(
      '지금 나가면 오늘은 다시 참여할 수 없습니다.\n그래도 나가시겠습니까? 😭'
  );

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

<style scoped></style>