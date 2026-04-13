import { computed, onUnmounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import {
    startOpenQuestion,
    completeOpenQuestion,
    exitOpenQuestion,
} from '@/api/openQuestion';

// PREVIEW_MODE = true (화면 테스트)
// PREVIEW_MODE = false (백엔드 연동)
const PREVIEW_MODE = false;
const ENTRY_KEY = 'openQuestionEntry';

export function useOpenQuestion() {
    const router = useRouter();

    const isLoading = ref(true);
    const isSubmitting = ref(false);
    const errorMessage = ref('');

    const dailyQuestionLogId = ref(null);
    const questionId = ref(null);
    const questionText = ref('');
    const status = ref('');

    const answerText = ref('');
    const seconds = ref(0);

    // 명시적 이탈 시 라우트 가드가 다시 개입하지 않도록 막는 플래그
    const isLeavingByAction = ref(false);

    let timerId = null;

    const canComplete = computed(() => seconds.value >= 10);

    const formattedTime = computed(() => {
        const minutes = Math.floor(seconds.value / 60);
        const remainSeconds = seconds.value % 60;
        return `${String(minutes).padStart(2, '0')}:${String(remainSeconds).padStart(2, '0')}`;
    });

    const startTimer = () => {
        stopTimer();
        timerId = window.setInterval(() => {
            seconds.value += 1;
        }, 1000);
    };

    const stopTimer = () => {
        if (timerId !== null) {
            clearInterval(timerId);
            timerId = null;
        }
    };

    const resetState = () => {
        isLoading.value = true;
        isSubmitting.value = false;
        errorMessage.value = '';
        dailyQuestionLogId.value = null;
        questionId.value = null;
        questionText.value = '';
        status.value = '';
        answerText.value = '';
        seconds.value = 0;
    };

    const validateEntry = () => {
        const entry = sessionStorage.getItem(ENTRY_KEY);

        if (entry !== 'allowed') {
            alert('홈 화면의 [시작하기 ▸] 버튼을 통해 이용할 수 있습니다.');
            router.replace('/');
            return false;
        }

        sessionStorage.removeItem(ENTRY_KEY);
        return true;
    };

    const initializePage = async () => {
        resetState();

        try {
            if (PREVIEW_MODE) {
                // 화면 테스트용 더미데이터
                dailyQuestionLogId.value = 1;
                questionId.value = 1;
                questionText.value = '오늘 가장 기억에 남는 일은 무엇인가요?';
                status.value = 'STARTED';
            } else {
                // 실제 백엔드 연동
                const data = await startOpenQuestion();

                dailyQuestionLogId.value = data.dailyQuestionLogId;
                questionId.value = data.questionId;
                questionText.value = data.questionText;
                status.value = data.status;
            }

            startTimer();
        } catch (error) {
            console.error('개방형질문 시작 실패:', error);
            errorMessage.value =
                error?.response?.data?.message ||
                '잠시 후 다시 시도해주세요.';
        } finally {
            isLoading.value = false;
        }
    };

    const performExit = async () => {
        stopTimer();

        if (!PREVIEW_MODE && dailyQuestionLogId.value) {
            await exitOpenQuestion(dailyQuestionLogId.value);
        }
    };

    // 명시적 이탈 상황
    const handleExit = async () => {
        if (isSubmitting.value) return;

        const confirmed = window.confirm('지금 나가면 오늘은 다시 참여할 수 없습니다.\n그래도 나가시겠습니까? 😭 ');
        if (!confirmed) return;

        isSubmitting.value = true;
        stopTimer();

        try {
            await performExit();
            isLeavingByAction.value = true;
            alert('개방형질문이 종료되었습니다.');
            router.replace('/');
        } catch (error) {
            console.error('개방형질문 이탈 실패:', error);
            startTimer();
            alert(
                error?.response?.data?.message ||
                '잠시 후 다시 시도해주세요.'
            );
        } finally {
            isSubmitting.value = false;
        }
    };

    const handleComplete = async () => {
        if (isSubmitting.value) return;

        if (seconds.value < 10) {
            alert('10초 이상 생각한 후 완료할 수 있습니다.');
            return;
        }

        isSubmitting.value = true;
        stopTimer();

        try {
            if (!PREVIEW_MODE) {
                await completeOpenQuestion(dailyQuestionLogId.value, seconds.value);
            }

            isLeavingByAction.value = true;
            alert('개방형질문이 완료되었습니다.');
            router.replace('/');
        } catch (error) {
            console.error('개방형질문 완료 실패:', error);
            startTimer();
            alert(
                error?.response?.data?.message ||
                '잠시 후 다시 시도해주세요.'
            );
        } finally {
            isSubmitting.value = false;
        }
    };

    // 비명시적 이탈 상황 시 타이머 정리
    onUnmounted(() => {
        stopTimer();
    });

    return {
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
        handleExit,
    };
}