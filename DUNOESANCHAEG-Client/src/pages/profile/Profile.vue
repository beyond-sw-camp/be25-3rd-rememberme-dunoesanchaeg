<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-28">

    <header class="flex items-center gap-3 mb-10">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-10 h-auto" />
      <h1 class="text-3xl font-black text-[var(--color-brand-green)] tracking-tight">두뇌산책</h1>
    </header>

    <van-cell-group inset class="mb-10 profile-card shadow-lg">
      <van-cell center class="py-10 bg-transparent">
        <template #icon>
          <van-image round :src="profileDefault" class="w-24 h-24 mr-6 border-4 border-white shadow-md" />
        </template>
        <template #title>
          <div class="text-3xl font-extrabold text-[var(--color-text-main)] mb-1">
            {{ userInfo.nickname || '가져오는 중...' }} 님
          </div>
        </template>
        <template #label>
          <div class="text-xl font-medium text-[var(--color-text-sub)]">
            {{ userInfo.email || '연결 중...' }}
          </div>
        </template>
      </van-cell>
    </van-cell-group>

    <section class="mt-16 mb-10">
      <div class="text-lg font-bold text-[var(--color-text-main)] opacity-70 mb-4 px-3">회원 관리</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="회원 정보 수정" is-link size="large" icon="edit" to="/profile/edit" class="py-5" />
      </van-cell-group>
    </section>

    <section class="mb-10">
      <div class="text-lg font-bold text-[var(--color-text-main)] opacity-70 mb-4 px-3">화면 설정</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="크게 보기" size="large" class="py-5">
          <template #value>
            <select v-model="fontSize" class="view-mode-select">
              <option value="SMALL">작게</option>
              <option value="MEDIUM">중간</option>
              <option value="LARGE">크게</option>
            </select>
          </template>
        </van-cell>

        <van-cell title="고대비 모드" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="contrastMode" size="28px" :active-color="'var(--color-brand-green)'" />
          </template>
        </van-cell>
      </van-cell-group>
    </section>

    <section class="mb-10">
      <div class="text-lg font-bold text-[var(--color-text-main)] opacity-70 mb-4 px-3">알림 설정</div>
      <van-cell-group inset class="shadow-sm">
        <van-cell title="게임 리마인더" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="gameReminder" size="28px" :active-color="'var(--color-brand-green)'" />
          </template>
        </van-cell>
        <van-cell title="일일 루틴 알림" size="large" class="py-5">
          <template #right-icon>
            <van-switch v-model="dailyRoutine" size="28px" :active-color="'var(--color-brand-green)'" />
          </template>
        </van-cell>
      </van-cell-group>
    </section>

    <footer class="profile-footer">
      <button @click="handleLogout" type="button" class="btn-logout">
        <span class="material-symbols-outlined">logout</span>
        로그아웃
      </button>
      <button @click="handleWithdraw" type="button" class="btn-withdraw">
        회원 탈퇴
      </button>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings';
import { showConfirmDialog, showToast } from 'vant';

import logoGreen from '@/assets/image/logo_profile.png';
import profileDefault from '@/assets/image/profile_default.png';

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const userInfo = ref({ nickname: '', email: '', profileImage: '' });
const fontSize = ref('MEDIUM');
const contrastMode = ref(false); // 로컬 UI용
const gameReminder = ref(true);
const dailyRoutine = ref(true);

/**
 * 데이터 로드
 */
// Profile.vue 수정 제안
const fetchUserData = async () => {
  try {
    const response = await instance.get('/members/me');
    const result = response.data.data;
    if (result) {
      userInfo.value = {
        // 🎯 백엔드 Member 도메인이나 DTO의 필드명(nickname 또는 name)을 확인하세요.
        nickname: result.name || result.nickname || '이름 없음',
        email: result.email,
        profileImage: result.profileImage || profileDefault
      };
      fontSize.value = result.fontSize || 'MEDIUM';

      // 🎯 고대비 모드도 서버 데이터(isHighContrast)를 반영해야 합니다.
      contrastMode.value = result.isHighContrast;
      settingsStore.initSettings(fontSize.value.toLowerCase(), result.isHighContrast);
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);

    // 🎯 서버에서 사용자 정보를 찾을 수 없다고 하면(404) 강제 로그아웃
    if (error.response?.status === 404) {
      showToast('세션이 만료되었거나 사용자 정보를 찾을 수 없습니다.');

      // 로컬 스토리지 청소 및 상태 초기화
      localStorage.clear();
      authStore.logout();

      // 로그인 페이지로 이동
      router.replace('/login');
    }
  }
};

/**
 * 서버 저장 (isHighContrast 제외)
 */
const updateMemberSettings = async () => {
  try {
    await instance.patch('/members/me', {
      fontSize: fontSize.value, // "SMALL", "MEDIUM", "LARGE"
      gameReminder: gameReminder.value,
      dailyRoutine: dailyRoutine.value,
      isHighContrast: contrastMode.value
    });
  } catch (error) {
    console.error("설정 저장 실패:", error);
  }
};

// 폰트 변경 감시
watch(fontSize, (newVal) => {
  settingsStore.setFontSize(newVal.toLowerCase());
  updateMemberSettings();
});

// 고대비 변경 감시
watch(contrastMode, (newVal) => {
  settingsStore.setHighContrast(newVal); // Store의 함수 호출
  updateMemberSettings(); // 서버에도 저장
});

watch([gameReminder, dailyRoutine], () => {
  updateMemberSettings();
});

/**
 * 로그아웃
 */
const handleLogout = async () => {
  showConfirmDialog({
    title: '로그아웃',
    message: '정말 로그아웃 하시겠습니까?',
  }).then(async () => {
    await authStore.logout();
    router.push('/login');
    showToast('로그아웃 되었습니다.');
  }).catch(() => {});
};

/**
 * 회원 탈퇴
 */
const handleWithdraw = () => {
  showConfirmDialog({
    title: '회원 탈퇴',
    message: '탈퇴 시 모든 데이터가 삭제됩니다. 계속하시겠습니까?',
    confirmButtonColor: '#ef4444',
  }).then(async () => {
    try {
      await instance.delete('/members/me');
      await authStore.logout();
      showToast('탈퇴가 완료되었습니다.');
      router.push('/login');
    } catch (error) {
      showToast('처리 중 오류가 발생했습니다.');
    }
  }).catch(() => {});
};

onMounted(fetchUserData);
</script>

<style scoped>
.profile-card {
  --van-cell-background: var(--color-brand-blue);
  --van-cell-group-inset-radius: 2rem;
}

.view-mode-select {
  background-color: var(--color-brand-blue);
  color: var(--color-text-main);
  border: 1px solid var(--color-text-sub);
  outline: none;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
}

.profile-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 5rem;
  margin-bottom: 3.75rem;
}

.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-sub);
  background: transparent;
  border: none;
  cursor: pointer;
}

.btn-withdraw {
  margin-top: 2.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #fca5a5;
  background: transparent;
  border: none;
  cursor: pointer;
}
</style>