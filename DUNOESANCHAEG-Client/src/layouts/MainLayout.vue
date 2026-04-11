<template>
  <div class="min-h-dvh bg-brand-bg pb-18">
    <main class="p-5">
      <router-view />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from "../components/BottomNav.vue";
</script>