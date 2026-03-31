<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-28">

    <header class="flex items-center gap-3 mb-10">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-20 h-auto" />
      <h1 class="text-3xl font-black text-brand-green tracking-tight">두뇌산책</h1>
    </header>

    <van-cell-group inset class="mb-10 profile-card shadow-lg">
      <van-cell center class="py-10 bg-transparent">
        <template #icon>
          <van-image round :src="profileDefault" class="w-24 h-24 mr-6 border-4 border-white shadow-md" />
        </template>
        <template #title>
          <div class="text-3xl font-extrabold text-gray-950 mb-1">
            {{ userInfo.nickname || '가져오는 중...' }} 님
          </div>
        </template>
        <template #label>
          <div class="text-xl font-medium text-gray-400">
            {{ userInfo.email || '연결 중...' }}
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <section class="mt-16 mb-10">
      <div class="text-lg font-bold text-gray-600 mb-4 px-3">회원 관리</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="회원 정보 수정" is-link size="large" icon="edit" to="/profile/edit" class="py-5" />
      </van-cell-group>
    </section>

    <section class="mb-10">
      <div class="text-lg font-bold text-gray-600 mb-4 px-3">화면 설정</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="크게 보기" size="large" class="py-5">
          <template #value>
            <select v-model="viewMode" class="view-mode-select px-4 py-2 border rounded-full text-lg font-bold">
              <option value="SMALL">작게</option>
              <option value="MEDIUM">중간</option>
              <option value="LARGE">크게</option>
            </select>
          </template>
        </van-cell>
        <van-cell title="고대비 모드" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="contrastMode" size="28px" active-color="#2D7A36" />
          </template>
        </van-cell>
      </van-cell-group>
    </section>

    <section class="mb-10">
      <div class="text-lg font-bold text-gray-600 mb-4 px-3">알림 설정</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="게임 리마인더" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="gameReminder" size="28px" active-color="#2D7A36" />
          </template>
        </van-cell>
        <van-cell title="일일 루틴 알림" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="dailyRoutine" size="28px" active-color="#2D7A36" />
          </template>
        </van-cell>
      </van-cell-group>
    </section>

    <footer class="profile-footer">
      <button
          @click="handleLogout"
          type="button"
          class="btn-logout"
      >
        <span class="material-symbols-outlined">logout</span>
        로그아웃
      </button>

      <button
          @click="handleWithdraw"
          type="button"
          class="btn-withdraw"
      >
        회원 탈퇴
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showConfirmDialog, showToast } from 'vant';
import logoGreen from '../../assets/image/logo_profile.png';
import profileDefault from '../../assets/image/profile_default.png';

const router = useRouter();

// 유저 정보 상태
const userInfo = ref({ nickname: '', email: '' });
const viewMode = ref('MEDIUM');
const contrastMode = ref(false);
const gameReminder = ref(true);
const dailyRoutine = ref(true);

/**
 * 1. 내 정보 조회 API 연동 (@GetMapping("/me"))
 */
const fetchUserData = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return;

    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const result = response.data;
    if (result && result.data) {
      userInfo.value = result.data;
      if (result.message.includes("탈퇴한 회원")) {
        showToast(result.message);
      }
    }
  } catch (error) {
    console.error("유저 정보 로드 실패:", error);
  }
};


const handleLogout = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(`${import.meta.env.VITE_API_BASE_URL}/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });

    localStorage.removeItem('token');
    showToast('안전하게 로그아웃되었습니다.');
    router.replace('/login');
  } catch (error) {
    console.error("로그아웃 과정 중 오류:", error);
    localStorage.removeItem('token');
    router.replace('/login');
  }
};


const handleWithdraw = () => {
  showConfirmDialog({
    title: '정말 탈퇴하시겠습니까?',
    message: '탈퇴 후 30일 이내에는 다시 복구하실 수 있습니다.',
    confirmButtonText: '탈퇴하기',
    confirmButtonColor: '#ee0a24',
    cancelButtonText: '취소',
  }).then(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/members/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.data.status === 200) {
        showToast(response.data.message);
        localStorage.removeItem('token');
        router.replace('/login');
      }
    } catch (error) {
      showToast('탈퇴 처리 중 오류가 발생했습니다.');
    }
  }).catch(() => { /* 취소 시 무시 */ });
};

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
.profile-card {
  --van-cell-background: #E8F2FF;
  --van-cell-group-inset-radius: 2rem;
}
.van-cell-group--inset {
  --van-cell-group-inset-radius: 1.5rem;
}
.view-mode-select {
  background-color: #f1f3f5;
  border-color: #ddd;
  outline: none;
}
.view-mode-select:focus {
  border-color: #2D7A36;
}
.profile-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 80px;
  margin-bottom: 60px;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 20px;
  font-weight: 700;
  color: #9ca3af;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: color 0.2s;
}

.btn-logout .material-symbols-outlined {
  font-size: 24px;
}

.btn-logout:hover {
  color: #4b5563;
}

.btn-withdraw {
  margin-top: 40px;
  font-size: 14px;
  font-weight: 500;
  color: #fca5a5;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.btn-withdraw:hover {
  color: #ef4444 !important;
  font-weight: 700;
}

.profile-card {
  --van-cell-background: #E8F2FF;
  --van-cell-group-inset-radius: 2rem;
}
</style>