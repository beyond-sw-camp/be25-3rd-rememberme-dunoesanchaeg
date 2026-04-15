<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay pointer-events-none">
      <div class="modal-card">
        <div class="modal-body">
          <div class="icon">
            <van-icon name="success" color="#2ba156" />
          </div>
          <div class="text-content">
            <slot></slot>
          </div>
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
</script>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: transparent; display: flex; justify-content: center; align-items: center; z-index: 9999;
  padding: 20px;
}
.pointer-events-none { pointer-events: none; }
.modal-card {
  background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(8px); border-radius: 24px; width: 100%; max-width: 320px; overflow: hidden;
  box-shadow: 0 10px 25px rgba(0,0,0,0.1); animation: slideUp 0.3s ease-out;
}
.modal-body { padding: 40px 24px; text-align: center; }
.icon { font-size: 50px; margin-bottom: 16px; }
.text-content { font-size: 1.25rem; font-weight: 800; color: #18181b; line-height: 1.5; }

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
