<template>
    <section>
        <div v-if="isLoading" class="flex flex-col justify-center items-center py-20">
            <div class="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-green mb-4"></div>
            <p class="text-zinc-500">루틴을 불러오고 있어요...</p>
        </div>

        <div v-else-if="errorMessage" class="bg-red-50 p-6 rounded-2xl text-center">
            <p class="text-red-500 font-medium mb-3">{{ errorMessage }}</p>
            <button @click="fetchHomeData" class="bg-red-100 text-red-600 px-4 py-2 rounded-lg text-sm font-bold">
                다시 시도
            </button>
        </div>

        <template v-else>
            <section class="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
                <div class="flex justify-between items-center">
                    <p class="routine_progress text-2xl font-semibold text-zinc-800">오늘의 루틴 진행률</p>
                    <p class="text-2xl font-bold text-brand-green">{{ progress }}%</p>
                </div>

                <div class="w-full pt-6 pb-4">
                    <div class="w-full h-10 bg-zinc-200 rounded-full overflow-hidden">
                        <div class="h-full bg-brand-green rounded-full transition-all duration-700"
                            :style="{ width: progress + '%' }"></div>
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
const props = defineProps({
    isLoading: Boolean,
    progress: Number,
    message: String,
    errorMessage: String
});

defineEmits(['retry']);
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
    color: #52525b; /* text-zinc-600 */
    letter-spacing: -0.025em; /* tracking-tighter */
    word-break: keep-all; /* break-keep */
    white-space: pre-line; /* whitespace-pre-line */
}
</style>