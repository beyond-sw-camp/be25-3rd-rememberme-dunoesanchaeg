<template>
  <div class="min-h-screen bg-gray-100 pb-20">
    <main class="p-5">
      <Home />
    </main>
    
    <BottomNav />
  </div>
</template>

<script setup>
import BottomNav from './components/BottomNav.vue';
import Home from './pages/Homepage.vue';
</script>