<template>
    <section class="flex justify-between items-center">
        <div class="py-2">
            <h2 class="text-2xl font-bold text-zinc-800">
                반가워요, <span class="text-brand-green">{{ authStore.username }}</span> 님!
            </h2>
            <p class="text-zinc-500 font-medium">오늘도 건강하게 산책해볼까요? ☀️</p>
        </div>

        <div class="text-xl font-semibold text-zinc-400 mt-1">
            {{ formattedDate }}
        </div>
    </section>
</template>

<script setup>

</script>

<style scoped></style>