<template>
  <div class="min-h-screen bg-gray-100 pb-20"> <main class="p-5">
      <router-view />
    </main>

    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from '../components/BottomNav.vue';
</script>