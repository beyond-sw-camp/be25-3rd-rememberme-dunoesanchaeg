<template>
  <Transition name="dialog-fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-8 py-10 flex flex-col items-center justify-center transform transition-all border border-white w-full max-w-[320px]">
        <div class="size-24 bg-green-50 rounded-full flex items-center justify-center mb-6 border-2 border-green-100">
          <van-icon name="success" size="4.5rem" class="text-brand-green font-bold" />
        </div>
        <span class="text-[1.3rem] font-black text-[#1B2B3B] text-center leading-[1.5]">
          <slot></slot>
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false
  }
});
</script>

<style scoped>
.dialog-fade-enter-active,
.dialog-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
