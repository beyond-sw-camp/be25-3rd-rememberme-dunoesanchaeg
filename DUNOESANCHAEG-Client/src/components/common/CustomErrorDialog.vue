<template>
  <Transition name="dialog-fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6 pointer-events-none">
      <div class="bg-white/90 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-8 py-10 flex flex-col items-center justify-center transform transition-all border border-white w-full max-w-[320px]">
        <div class="size-24 bg-rose-50 rounded-full flex items-center justify-center mb-6 border-2 border-rose-100">
          <van-icon name="cross" size="4.5rem" class="text-rose-400 font-bold" />
        </div>
        <span class="text-[1.3rem] font-black text-[#1B2B3B] text-center leading-[1.5]">
          <slot>
            에러가 발생했습니다.<br/>다시 시도해주세요.
          </slot>
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
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
  opacity: 0;
  transform: translateY(10px) scale(0.95);
}
</style>
