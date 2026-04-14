<template>
  <Transition name="dialog-fade">
    <div v-if="show" class="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <div class="absolute inset-0 bg-black/20" @click="$emit('cancel')"></div>
      <div class="relative bg-white/95 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[32px] px-8 py-8 flex flex-col items-center justify-center transform transition-all border border-white w-full max-w-[320px]">
        <div class="size-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 border-2 border-amber-100">
          <van-icon name="warning-o" size="4.5rem" class="text-amber-500 font-bold" />
        </div>
        <span class="text-[1.2rem] font-black text-[#1B2B3B] text-center leading-[1.5] mb-8">
          <slot></slot>
        </span>
        <div class="flex gap-3 w-full">
          <button @click="$emit('cancel')" class="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-bold text-lg active:bg-gray-200 transition-colors">
            아니오
          </button>
          <button @click="$emit('confirm')" class="flex-1 py-4 bg-amber-500 !text-white rounded-2xl font-bold text-lg active:bg-amber-600 transition-colors shadow-[0_4px_12px_rgba(245,158,11,0.2)]">
            예
          </button>
        </div>
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

defineEmits(['confirm', 'cancel']);
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
