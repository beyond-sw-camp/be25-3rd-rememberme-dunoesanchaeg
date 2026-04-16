<template>
  <van-nav-bar
    :title="title"
    left-arrow
    @click-left="handleBack"
    fixed
    placeholder
    safe-area-inset-top
    class="app-nav-bar shadow-sm font-bold bg-brand-bg z-50"
  />
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['back']);

const router = useRouter();

const handleBack = () => {
  emit('back');
  router.go(-1);
};
</script>

<style scoped>
:deep(.van-nav-bar__title) {
  font-family: "Pretendard", sans-serif;
  font-weight: 800;
  font-size: 1.2rem;
  color: var(--color-brand-green);
}
:deep(.van-nav-bar .van-icon) {
  color: var(--color-brand-green);
  font-weight: 900;
  font-size: 1.25rem;
}
:deep(.van-nav-bar) {
  background-color: var(--color-brand-bg);
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}
:deep(.van-nav-bar::after) {
  border-bottom-width: 0 !important;
}
</style>
