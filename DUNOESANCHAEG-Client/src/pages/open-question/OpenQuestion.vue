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
          질문을 불러오는 중이에요...
        </p>
      </div>

      <div
          v-else-if="errorMessage"
          class="w-full rounded-[--radius-card] border border-red-100 bg-red-50 px-6 py-6 space-y-4"
      >
        <p class="text-base font-bold text-red-500">질문을 불러오지 못했어요</p>
        <p class="text-sm text-red-400 whitespace-pre-line">
          {{ errorMessage }}
        </p>

        <button
            type="button"
            @click="initializePage"
            class="w-full h-12 rounded-2xl bg-brand-green text-white font-bold hover:opacity-90 active:scale-[0.98] transition-all"
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
                placeholder="떠오르는 생각을 편하게 적어보세요 !"
                class="w-full resize-none rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4 text-base text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-green"
            />

            <p class="mt-2 text-xs text-orange-700 font-medium">
              * 답변은 저장되지 않으니 편하게 작성해보세요.
            </p>
          </div>

          <div class="space-y-4">
            <button
                type="button"
                :disabled="isSubmitting || !canComplete"
                @click="handleComplete"
                class="w-full h-14 rounded-2xl bg-brand-green text-white font-bold shadow-md hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
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

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import instance from '@/api/instance'

type StartResponse = {
  dailyQuestionLogId: number
  questionId: number
  questionText: string
  status: string
}

const router = useRouter()

const isLoading = ref(true)
const isSubmitting = ref(false)
const errorMessage = ref('')

const dailyQuestionLogId = ref<number | null>(null)
const questionId = ref<number | null>(null)
const questionText = ref('')
const status = ref('')

const answerText = ref('')

const seconds = ref(0)
let timerId: number | null = null

const canComplete = computed(() => seconds.value >= 10)

const formattedTime = computed(() => {
  const minutes = Math.floor(seconds.value / 60)
  const remainSeconds = seconds.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`
})

const startTimer = () => {
  stopTimer()
  timerId = window.setInterval(() => {
    seconds.value += 1
  }, 1000)
}

const stopTimer = () => {
  if (timerId !== null) {
    clearInterval(timerId)
    timerId = null
  }
}

const resetState = () => {
  seconds.value = 0
  dailyQuestionLogId.value = null
  questionId.value = null
  questionText.value = ''
  status.value = ''
  errorMessage.value = ''
}

// 실제 프론트엔드 구현 코드
// const initializePage = async () => {
//   isLoading.value = true
//   resetState()
//
//   try {
//     const res = await instance.post('/api/v1/open-questions/start')
//     const data: StartResponse = res.data.data
//
//     dailyQuestionLogId.value = data.dailyQuestionLogId
//     questionId.value = data.questionId
//     questionText.value = data.questionText
//     status.value = data.status
//
//     startTimer()
//   } catch (error: any) {
//     console.error('개방형질문 시작 실패:', error)
//     errorMessage.value =
//         error?.response?.data?.message ||
//         '질문을 시작할 수 없어요.\n잠시 후 다시 시도해주세요.'
//   } finally {
//     isLoading.value = false
//   }
// }

// 화면 미리보기 테스트 코드 (삭제 예정)
const initializePage = async () => {
  isLoading.value = false
  errorMessage.value = ''

  dailyQuestionLogId.value = 1
  questionId.value = 1
  questionText.value = '어릴 때 자주 먹던 음식 중 떠오르는 것이 있나요?'
  status.value = 'STARTED'

  startTimer()
}

// 실제 프론트엔드 구현 코드
// const handleComplete = async () => {
//   if (isSubmitting.value) return
//
//   if (!dailyQuestionLogId.value) {
//     alert('질문 정보가 없어요. 다시 시도해주세요.')
//     return
//   }
//
//   if (seconds.value < 10) {
//     alert('10초 이상 생각한 후 완료할 수 있어요.')
//     return
//   }
//
//   isSubmitting.value = true
//   stopTimer()
//
//   try {
//     await instance.patch(`/api/v1/open-questions/${dailyQuestionLogId.value}`, {
//       responseSecond: seconds.value,
//     })
//
//     alert('개방형질문 루틴을 완료했어요.')
//     router.replace('/')
//   } catch (error: any) {
//     console.error('개방형질문 완료 실패:', error)
//     startTimer()
//     alert(
//         error?.response?.data?.message ||
//         '완료 처리에 실패했어요. 다시 시도해주세요.'
//     )
//   } finally {
//     isSubmitting.value = false
//   }
// }

// 화면 미리보기 테스트 코드 (삭제 예정)
const handleComplete = async () => {
  if (isSubmitting.value) return

  if (seconds.value < 10) {
    alert('10초 이상 생각한 후 완료할 수 있어요.')
    return
  }

  isSubmitting.value = true
  stopTimer()

  try {
    alert('개방형질문이 완료되었어요.')
    router.replace('/')
  } catch (error: any) {
    console.error('개방형질문 완료 미리보기 실패:', error)
    startTimer()
    alert('완료 처리에 실패했어요. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

// 실제 프론트엔드 구현 코드
// const handleExit = async () => {
//   if (isSubmitting.value) return
//
//   if (!dailyQuestionLogId.value) {
//     router.back()
//     return
//   }
//
//   const confirmed = window.confirm('지금 나가면 오늘은 다시 시작할 수 없습니다. 그래도 나가시겠습니까?')
//   if (!confirmed) return
//
//   isSubmitting.value = true
//   stopTimer()
//
//   try {
//     await instance.delete(`/api/v1/open-questions/${dailyQuestionLogId.value}`)
//     alert('개방형질문을 종료했어요.')
//     router.replace('/')
//   } catch (error: any) {
//     console.error('개방형질문 이탈 실패:', error)
//     startTimer()
//     alert(
//         error?.response?.data?.message ||
//         '이탈 처리에 실패했어요. 다시 시도해주세요.'
//     )
//   } finally {
//     isSubmitting.value = false
//   }
// }

// 화면 미리보기 테스트 코드 (삭제 예정)
const handleExit = async () => {
  if (isSubmitting.value) return

  const confirmed = window.confirm('정말로 개방형질문을 그만할까요?')
  if (!confirmed) return

  isSubmitting.value = true
  stopTimer()

  try {
    alert('개방형질문을 종료했어요.')
    router.replace('/')
  } catch (error: any) {
    console.error('개방형질문 이탈 미리보기 실패:', error)
    startTimer()
    alert('이탈 처리에 실패했어요. 다시 시도해주세요.')
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  initializePage()
})

onBeforeUnmount(() => {
  stopTimer()
})
</script>

<style scoped></style>