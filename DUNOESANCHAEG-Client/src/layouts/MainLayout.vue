<template>
  <div class="min-h-dvh bg-brand-bg relative w-full h-full">
    <main class="p-5 pb-20">
      <slot />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from "../components/BottomNav.vue";
</script>