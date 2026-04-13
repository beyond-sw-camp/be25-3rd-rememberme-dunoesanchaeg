import { computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useDailyRecordStore } from '@/store/dailyRecord.js';
import { saveDailyRecord } from '@/api/dailyRecord.js';

export function useDailyRecord() {
    const dailyRecordStore = useDailyRecordStore();
    const { form, isSubmitting, lastSavedDate, isRecordFinished } = storeToRefs(dailyRecordStore);

    const requiredFields = ['sleepLevel', 'moodLevel', 'mealLevel'];

    const isValid = computed(() =>
        requiredFields.every((field) => !!form.value[field])
    );

    const validationMessage = computed(() => {
        if (form.value.sleepLevel && form.value.moodLevel && form.value.mealLevel) {
        return '';
        }
        return '수면, 기분, 식사는 꼭 선택해 주세요.';
    });

    const buildPayload = () => ({
        moodLevel: form.value.moodLevel || null,
        moodMemo: form.value.moodMemo?.trim() || '',
        sleepLevel: form.value.sleepLevel || null,
        sleepMemo: form.value.sleepMemo?.trim() || '',
        mealLevel: form.value.mealLevel || null,
        mealMemo: form.value.mealMemo?.trim() || '',
        exerciseLevel: form.value.exerciseLevel || null,
        exerciseMemo: form.value.exerciseMemo?.trim() || '',
        socialLevel: form.value.socialLevel || null,
        socialMemo: form.value.socialMemo?.trim() || '',
    });

    const submitDailyRecord = async () => {
        if (!isValid.value) {
        throw new Error(validationMessage.value);
        }

        dailyRecordStore.setSubmitting(true);

        try {
        const response = await saveDailyRecord(buildPayload());

        dailyRecordStore.setSaveResult({
            recordDate: response?.data?.recordDate ?? null,
            isRecordFinished: response?.data?.isRecordFinished ?? false,
        });

        return response;
        } finally {
        dailyRecordStore.setSubmitting(false);
        }
    };

    return {
        form,
        isSubmitting,
        lastSavedDate,
        isRecordFinished,
        isValid,
        validationMessage,
        submitDailyRecord,
    };
}