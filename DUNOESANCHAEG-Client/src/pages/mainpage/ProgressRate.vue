<template>
    <section>
        <div v-if="isLoading" class="flex flex-col justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green mb-4"></div>
            <p class="text-[var(--color-text-sub)]">루틴을 불러오고 있어요...</p>
        </div>

        <div v-else-if="errorMessage" class="bg-red-50 p-6 rounded-2xl text-center">
            <p class="text-red-500 font-medium mb-3">{{ errorMessage }}</p>
            <button @click="fetchHomeData" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">
                다시 시도
            </button>
        </div>

        <template v-else>
            <section class="bg-[var(--color-surface)] p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)] border-2 border-[var(--color-border)]">
                <div class="flex justify-between items-center">
                    <p class="routine_progress text-2xl font-semibold text-[var(--color-text-main)]">오늘의 루틴 진행률</p>
                    <p class="text-2xl font-bold text-brand-green">{{ animatedProgress }}%</p>
                </div>

                <div class="w-full pt-6 pb-4">
                    <div class="w-full h-10 bg-[var(--color-surface-variant)] rounded-full overflow-hidden">
                        <div class="h-full bg-brand-green rounded-full transition-all duration-100 ease-out"
                            :style="{ width: animatedProgress + '%' }"></div>
                    </div>
                </div>

                <div class="fighting_message">
                    {{ message }}
                </div>
            </section>
        </template>
    </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    isLoading: Boolean,
    progress: Number,
    message: String,
    errorMessage: String
});

defineEmits(['retry']);

const animatedProgress = ref(0);

const animateValue = (start, end, duration) => {
    if (start === end) {
        animatedProgress.value = end;
        return;
    }
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        let progress = Math.min((timestamp - startTimestamp) / duration, 1);
        // ease-out cubic 효과
        const easeOut = 1 - Math.pow(1 - progress, 3);
        animatedProgress.value = Math.floor(easeOut * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
        } else {
            animatedProgress.value = end;
        }
    };
    window.requestAnimationFrame(step);
};

watch(() => props.progress, (newVal) => {
    animateValue(animatedProgress.value, newVal, 1200);
});

onMounted(() => {
    if (props.progress > 0) {
        animateValue(0, props.progress, 1200);
    }
});
</script>

<style scoped>
.routine_progress{
    font-size: calc(var(--van-font-size-lg) * var(--font-scale)* 1.3);
}

.fighting_message {
    display: flex;
    justify-content: center;
    text-align: center;
    font-size: calc(var(--van-font-size-lg) * var(--font-scale));
    font-weight: 600; /* font-semibold */
    color: var(--color-text-sub); /* text-zinc-600 */
    letter-spacing: -0.025em; /* tracking-tighter */
    word-break: keep-all; /* break-keep */
    white-space: pre-line; /* whitespace-pre-line */
}
</style>