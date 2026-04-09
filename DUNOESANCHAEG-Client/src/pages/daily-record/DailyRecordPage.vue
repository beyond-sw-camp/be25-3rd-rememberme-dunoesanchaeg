<template>
    <div class="daily-record-page">
        <div class="page-inner">
            <template v-if="!isSubmitted">
                <div class="page-header">
                    <button class="exit-btn" @click="goHome">나가기</button>
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
            placeholder="예시) 오늘은 날씨가 좋아서 기분도 좋았어요."
            />

            <RecordSection
            title="잠은 잘 주무셨나요?"
            :required="true"
            v-model:selectedLevel="form.sleepLevel"
            v-model:memo="form.sleepMemo"
            placeholder="예시) 중간에 한 번 깨긴 했지만 괜찮았어요."
            />

            <RecordSection
            title="식사는 잘 챙겨드셨나요?"
            :required="true"
            v-model:selectedLevel="form.mealLevel"
            v-model:memo="form.mealMemo"
            placeholder="예시) 아침은 못 먹고 점심, 저녁은 잘 먹었어요."
            />

            <RecordSection
            title="몸을 움직이는 활동은 어떠셨나요?"
            v-model:selectedLevel="form.exerciseLevel"
            v-model:memo="form.exerciseMemo"
            placeholder="예시) 산책을 조금 했어요."
            />

            <RecordSection
            title="다른 사람들과의 만남이나 활동은 어떠셨나요?"
            v-model:selectedLevel="form.socialLevel"
            v-model:memo="form.socialMemo"
            placeholder="예시) 가족과 통화해서 기분이 좋았어요."
            />
        </div>

        <button class="submit-btn" @click="handleSubmit">
            저장하기
        </button>
    </template>

    <template v-else>
        <div class="complete-wrap">
            <div class="complete-icon">✅</div>
            <h1 class="complete-title">하루기록 등록이 완료되었습니다!</h1>
            <p class="complete-subtitle">
                오늘의 하루를 잘 기록했어요.<br />
                남은 루틴도 이어서 수행해보세요.
            </p>

            <div class="complete-button-group">
                <button class="primary-btn" @click="goHome">
                남은 루틴 수행하러 가기
                </button>
                <button class="secondary-btn" @click="goHome">
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
    min-height: 100vh;
    background: #f3f7fb;
    padding: 24px 16px 40px;
    }

    .page-inner {
    max-width: 760px;
    margin: 0 auto;
    }

    .page-header {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 16px;
    }

    .exit-btn {
    min-width: 88px;
    height: 42px;
    border: 1px solid #cbd5e1;
    border-radius: 12px;
    background: #ffffff;
    color: #334155;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    }

    .page-title {
    margin: 0;
    font-size: 32px;
    font-weight: 800;
    color: #2D7A36;
    }

    .page-subtitle {
    margin: 8px 0 20px;
    font-size: 16px;
    color: #6b7280;
    }

    .error-message {
    margin: 0 0 16px;
    padding: 14px 16px;
    border-radius: 14px;
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    font-size: 15px;
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
    background: #18860c;
    color: #fff;
    font-size: 17px;
    font-weight: 800;
    cursor: pointer;
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
    font-size: 56px;
    margin-bottom: 18px;
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
    font-size: 56px;
    margin-bottom: 18px;
    }
</style>