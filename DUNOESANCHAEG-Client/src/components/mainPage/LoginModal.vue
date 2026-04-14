<template>
  <Transition name="fade">
    <div v-if="authStore.isLoginModalVisible" class="modal-overlay" @click.self="authStore.closeLoginModal">
      <div class="modal-card">
        <div class="modal-body">
          <div class="icon">🔐</div>
          <h3>로그인이 필요해요</h3>
          <p>이 서비스는 로그인을 해야<br>이용할 수 있습니다.</p>
        </div>
        <div class="modal-footer">
          <button class="btn-close" @click="authStore.closeLoginModal">취소</button>
          <button class="btn-login" @click="handleLoginGo">로그인하기</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'vue-router';

const authStore = useAuthStore();
const router = useRouter();

const handleLoginGo = () => {
  authStore.closeLoginModal();
  router.push({ name: 'Login' });
};
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
.icon { font-size: 40px; margin-bottom: 16px; }
h3 { font-size: 1.25rem; font-weight: 800; color: #18181b; margin-bottom: 8px; }
p { color: #71717a; line-height: 1.5; font-size: 0.95rem; }
.modal-footer { display: flex; border-top: 1px solid #f4f4f5; }
.modal-footer button { flex: 1; padding: 16px; border: none; font-size: 1rem; font-weight: 600; cursor: pointer; }
.btn-close { background: white; color: #a1a1aa; }
.btn-login { background: #2ba156; color: white; } /* 두뇌산책 그린 컬러 */

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}
.fade-enter-active, .fade-leave-active { transition: opacity 0.2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>