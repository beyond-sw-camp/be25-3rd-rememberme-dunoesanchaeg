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
            <section class="bg-white p-6 rounded-2xl shadow-md">
                <div class="flex justify-between items-center">
                    <p class="text-2xl font-semibold text-zinc-800">오늘의 루틴 진행률</p>
                    <p class="text-2xl font-bold text-brand-green">{{ progress }}%</p>
                </div>

                <div class="w-full pt-6 pb-4">
                    <div class="w-full h-10 bg-zinc-200 rounded-full overflow-hidden">
                        <div class="h-full bg-brand-green rounded-full transition-all duration-700"
                            :style="{ width: progress + '%' }"></div>
                    </div>
                </div>

                <div class="flex justify-center text-l font-semibold text-zinc-600">
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

<style scoped></style>