<template>
    <section class="mb-6">
        <div class="text-left text-xl font-semibold text-zinc-400">
                {{ formattedDate }}
        </div>
        <div class="py-1">
            <h2 class="text-2xl font-bold text-zinc-800">
                반가워요, <span class="text-brand-green">{{ username }}</span> 님!
            </h2>
            <p class="text-zinc-500 font-SemiBold">오늘도 건강하게 산책해볼까요? ☀️</p>
        </div>
    </section>
</template>

<script setup>
// 부모 컴포넌트로부터 데이터를 받기 위해 defineProps를 정의합니다.
defineProps({
  username: {
    type: String,
    default: ''
  },
  formattedDate: {
    type: String,
    default: ''
  }
});
</script>

<style scoped></style>