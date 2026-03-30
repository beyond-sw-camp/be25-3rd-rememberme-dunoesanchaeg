<template>
  <div class="min-h-screen bg-brand-bg">
    <main class="p-5">
      <router-view />
    </main>
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from "../components/BottomNav.vue";
</script>