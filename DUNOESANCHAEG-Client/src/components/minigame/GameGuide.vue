<template>
  <div class="absolute inset-0 z-[60] bg-brand-bg flex flex-col pb-safe">
    <div class="flex justify-end items-center p-4 pt-6">
      <button @click="$emit('exit')" class="w-10 h-10 flex items-center justify-center bg-surface-variant rounded-full text-text-sub active:bg-gray-200 transition-colors shadow-sm">
        <van-icon name="cross" size="1.25rem" class="font-bold" />
      </button>
    </div>

    <div class="flex-1 flex flex-col items-center justify-center px-6 text-center -mt-8">
      <div class="size-24 bg-brand-blue rounded-[28px] flex items-center justify-center mb-6 shadow-sm border border-white">
        <van-icon :name="iconName" class="text-brand-green" size="4rem" />
      </div>
      
      <h1 class="text-[2.2rem] font-black text-text-main mb-8 leading-tight tracking-tight">{{ title }}</h1>
      
      <div class="bg-surface w-full p-6 py-8 rounded-[32px] shadow-[0_8px_32px_rgba(45,122,54,0.06)] border border-white flex flex-col items-center">
        <div class="bg-brand-green/10 text-brand-green px-4 py-1.5 rounded-full text-sm font-extrabold mb-5 inline-flex items-center gap-1.5">
          <van-icon name="info-o" size="14" class="font-bold"/>
          게임 방법
        </div>
        <p class="text-lg text-text-main font-medium break-keep leading-[1.6]" v-html="description"></p>
      </div>
    </div>

    <div class="p-6 pt-2">
      <button @click="$emit('start')" class="w-full py-4 bg-brand-green text-[var(--color-button-text)]! rounded-[0.875rem] !font-bold !text-xl flex items-center justify-center shadow-[0_8px_24px_rgba(45,122,54,0.3)] active:scale-[0.98] transition-all">
        게임 시작하기
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  iconName: {
    type: String,
    default: 'play-circle-o'
  }
});

defineEmits(['start', 'exit']);
</script>
