<template>
  <div class="min-h-dvh bg-brand-bg relative w-full h-full mb-4">
    <main class="p-7 pb-20">
      <slot />
    </main>
    <BottomNav />

    <LoginModal/>
  </div>
</template>

<script setup>
import BottomNav from "../components/common/BottomNav.vue";
</script>