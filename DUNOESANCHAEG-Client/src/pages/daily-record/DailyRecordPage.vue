<template>
    <div class="daily-record-page">
        <div class="page-inner">
            <template v-if="!isSubmitted">
                <div class="page-header">
                    <button class="exit-btn" type="button" @click="goHome" aria-label="홈으로 돌아가기">
                        <van-icon name="arrow-left" size="18" />
                    </button>
                </div>

                <h1 class="page-title">하루 기록</h1>
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
                        placeholder="예시) 오늘은 산책가 좋아서 기분이 좋았어요."
                    />

                    <RecordSection
                        title="어제 잘 주무셨나요?"
                        :required="true"
                        v-model:selectedLevel="form.sleepLevel"
                        v-model:memo="form.sleepMemo"
                        placeholder="예시) 중간중간 몇 번 깼지만 괜찮았어요."
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
            </template>

            <template v-else>
                <div class="complete-wrap">
                    <div class="complete-icon">😊</div>
                    <h1 class="complete-title">하루기록 등록이 완료되었습니다</h1>
                    <p class="complete-subtitle">
                        오늘의 하루를 잘 기록했어요.<br />
                        다음 루틴도 이어서 수행해보세요.
                    </p>

                    <div class="complete-button-group">
                        <button class="home-btn" @click="goHome">
                            홈화면으로 가기
                        </button>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import RecordSection from '@/components/daily-record/RecordSection.vue';

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
const isSubmitted = ref(false);

const handleSubmit = () => {
    alert('오늘의 하루기록을 저장하시겠습니까?');

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

    console.log('현재 form 상태:', JSON.parse(JSON.stringify(form)));
    isSubmitted.value = true;
};

const goHome = () => {
    router.push('/');
};
</script>

<style scoped>
.daily-record-page {
    --daily-record-error-bg: #fef2f2;
    --daily-record-error-border: #fecaca;
    --daily-record-error-text: #b91c1c;
    min-height: 100vh;
    background: var(--color-brand-bg);
    padding: 24px 16px 40px;
}

.page-inner {
    max-width: 760px;
    margin: 0 auto;
    padding: 28px 24px 32px;
    background: var(--color-brand-blue);
    border: 1px solid var(--color-surface-variant);
    border-radius: var(--radius-card);
    box-shadow: 0 8px 24px rgba(17, 24, 39, 0.06);
}

.page-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
}

.exit-btn {
    width: 40px;
    height: 40px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--color-surface-variant);
    border-radius: 9999px;
    background: var(--color-surface);
    color: var(--color-text-sub);
    font-size: var(--text-sm);
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(17, 24, 39, 0.04);
}

.page-title {
    margin: 0;
    font-size: var(--text-3xl);
    font-weight: 800;
    color: var(--color-brand-green);
    line-height: var(--text-3xl--line-height);
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
    color: #ffffff;
    font-size: var(--text-lg);
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 10px 18px rgba(45, 122, 54, 0.2);
}

.home-btn {
    width: 220px;
    height: 52px;
    border: none;
    border-radius: 16px;
    background: var(--color-brand-green);
    color: #ffffff;
    font-size: var(--text-base);
    font-weight: 700;
    cursor: pointer;
    margin-top: 28px;
    box-shadow: 0 10px 18px rgba(45, 122, 54, 0.2);
}

.complete-wrap {
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
}

.complete-icon {
    font-size: var(--text-6xl);
    margin-bottom: 18px;
}

.complete-title {
    margin: 0;
    font-size: var(--text-2xl);
    font-weight: 800;
    color: var(--color-brand-green);
    line-height: var(--text-2xl--line-height);
}

.complete-subtitle {
    margin: 12px 0 0;
    font-size: var(--text-base);
    color: var(--color-text-muted);
    line-height: var(--text-base--line-height);
}

@media (max-width: 640px) {
    .page-inner {
        padding: 24px 16px 28px;
        border-radius: 1.5rem;
    }

    .page-title {
        font-size: var(--text-2xl);
        line-height: var(--text-2xl--line-height);
    }
}
</style>
