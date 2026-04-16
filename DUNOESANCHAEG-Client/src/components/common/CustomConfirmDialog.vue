<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click.self="$emit('cancel')">
      <div class="modal-card">
        <div class="modal-body">
          <div class="icon">
            <van-icon name="warning-o" color="#f59e0b" />
          </div>
          <div class="text-content">
            <slot></slot>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-close" @click="$emit('cancel')">아니오</button>
          <button class="btn-confirm" @click="$emit('confirm')">예</button>
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
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); display: flex; justify-content: center; align-items: center; z-index: 9999;
  padding: 20px;
}
.modal-card {
  background: white; border-radius: 24px; width: 100%; max-width: 320px; overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideUp 0.3s ease-out;
}
.modal-body { padding: 32px 24px; text-align: center; }
.icon { font-size: 50px; margin-bottom: 16px; }
.text-content { font-size: 1.25rem; font-weight: 800; color: #18181b; line-height: 1.5; }
.modal-footer { display: flex; border-top: 1px solid #f4f4f5; gap: 1px; background: #f4f4f5; }
.modal-footer button { flex: 1; padding: 16px; border: none; font-size: 1.25rem; font-weight: 600; cursor: pointer; transition: transform 0.1s ease, background-color 0.1s ease; }
.btn-close { background: white; color: #a1a1aa; border-radius: 0 0 0 24px; }
.btn-close:active { background: #f0f0f0; transform: scale(0.95); }
.btn-confirm { background: #f59e0b; color: var(--color-button-text); border-radius: 0 0 24px 0; }
.btn-confirm:active { background: #d97706; transform: scale(0.95); }

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
