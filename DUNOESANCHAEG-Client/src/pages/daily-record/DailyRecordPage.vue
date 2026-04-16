<template>
    <div class="daily-record-page">
        <AppNavBar title="하루 기록" />

        <div class="page-inner">
                <p class="page-subtitle">오늘 하루 상태를 간단하게 기록해보세요.</p>

                <p v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </p>

                <div class="record-list">
                    <RecordSection
                        title="오늘 기분은 어떠셨나요?"
                        :required="true"
                        v-model:selectedLevel="form.moodLevel"
                        v-model:memo="form.moodMemo"
                        placeholder="예시) 오늘은 산책이 즐거워서 기분이 좋았어요."
                    />

                    <RecordSection
                        title="어제 잠은 잘 주무셨나요?"
                        :required="true"
                        v-model:selectedLevel="form.sleepLevel"
                        v-model:memo="form.sleepMemo"
                        placeholder="예시) 중간에 몇 번 깼지만 괜찮았어요."
                    />

                    <RecordSection
                        title="식사는 잘 챙겨드셨어요?"
                        :required="true"
                        v-model:selectedLevel="form.mealLevel"
                        v-model:memo="form.mealMemo"
                        placeholder="예시) 아침은 못 먹고 점심, 저녁은 잘 먹었어요."
                    />

                    <RecordSection
                        title="몸을 움직이거나 활동은 어떠셨나요?"
                        v-model:selectedLevel="form.exerciseLevel"
                        v-model:memo="form.exerciseMemo"
                        placeholder="예시) 산책을 조금 했어요."
                    />

                    <RecordSection
                        title="다른 사람과의 만남이나 소통은 어떠셨나요?"
                        v-model:selectedLevel="form.socialLevel"
                        v-model:memo="form.socialMemo"
                        placeholder="예시) 가족과 통화해서 기분이 좋아졌어요."
                    />
                </div>

                <button class="submit-btn" @click="handleSubmit">
                    저장하기
                </button>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import RecordSection from '@/components/daily-record/RecordSection.vue';
import AppNavBar from '@/components/common/AppNavBar.vue';
import { saveDailyRecord } from '@/api/dailyRecord.js';

const router = useRouter();

const form = reactive({
    moodLevel: '',
    moodMemo: '',
    sleepLevel: '',
    sleepMemo: '',
    mealLevel: '',
    mealMemo: '',
    exerciseLevel: '',
    exerciseMemo: '',
    socialLevel: '',
    socialMemo: '',
});

const errorMessage = ref('');

const handleSubmit = async () => {
    errorMessage.value = '';

    if (!form.moodLevel) {
        errorMessage.value = '기분 항목은 필수로 선택해야 해요.';
        return;
    }

    if (!form.sleepLevel) {
        errorMessage.value = '수면 항목은 필수로 선택해야 해요.';
        return;
    }

    if (!form.mealLevel) {
        errorMessage.value = '식사 항목은 필수로 선택해야 해요.';
        return;
    }

    try {
        await saveDailyRecord({
            moodLevel: form.moodLevel,
            moodMemo: form.moodMemo,
            sleepLevel: form.sleepLevel,
            sleepMemo: form.sleepMemo,
            mealLevel: form.mealLevel,
            mealMemo: form.mealMemo,
            exerciseLevel: form.exerciseLevel || null,
            exerciseMemo: form.exerciseMemo,
            socialLevel: form.socialLevel || null,
            socialMemo: form.socialMemo,
        });

        router.push('/');
    } catch (error) {
        errorMessage.value =
            error.response?.data?.message || '하루 기록 저장 중 오류가 발생했어요.';
    }
};
</script>

<style scoped>
.daily-record-page {
    --daily-record-error-bg: #fef2f2;
    --daily-record-error-border: #fecaca;
    --daily-record-error-text: #b91c1c;
    min-height: 100vh;
    background: var(--color-brand-bg);
    padding: 0 16px 40px;
}

.page-inner {
    max-width: 480px;
    margin: 0 auto;
    padding: 8px 0 0;
}

.page-subtitle {
    margin: 8px 0 20px;
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: var(--text-base--line-height);
}

.error-message {
    margin: 0 0 16px;
    padding: 14px 16px;
    border-radius: 14px;
    background: var(--daily-record-error-bg);
    border: 1px solid var(--daily-record-error-border);
    color: var(--daily-record-error-text);
    font-size: var(--text-sm);
    font-weight: 700;
}

.record-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.submit-btn {
    width: 100%;
    margin-top: 20px;
    min-height: 56px;
    border: none;
    border-radius: 16px;
    background: var(--color-brand-green);
    color: var(--color-button-text);
    font-size: var(--text-lg);
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 10px 18px rgba(45, 122, 54, 0.2);
}



@media (max-width: 640px) {
    .page-inner {
        padding: 8px 0 0;
    }
}
</style>
