<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-28">

    <header class="flex items-center gap-3 mb-10">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-10 h-auto" />
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
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings'; //1. 세팅 스토어 임포트
import { showConfirmDialog, showToast } from 'vant';
import logoGreen from '@/assets/image/logo_profile.png';
import profileDefault from '@/assets/image/profile_default.png';

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore(); // 2. 스토어 사용 선언

// 유저 정보 및 설정 상태
const userInfo = ref({ nickname: '', email: '', profileImage: '' });
const viewMode = ref('MEDIUM');
const contrastMode = ref(false);
const gameReminder = ref(true);
const dailyRoutine = ref(true);

/**
 * 데이터 로드 후 전역 스타일 초기화
 */
const fetchUserData = async () => {
  try {
    const response = await instance.get('/members/me');
    const result = response.data.data;

    if (result) {
      userInfo.value = result;
      // DB에서 가져온 값을 로컬 ref에 담기
      viewMode.value = result.viewMode || 'MEDIUM';
      contrastMode.value = result.contrastMode || false;
      gameReminder.value = result.gameReminder !== false;
      dailyRoutine.value = result.dailyRoutine !== false;

      // ✅ 3. 가져온 즉시 CSS 엔진(Store) 가동
      // DB에는 대문자(LARGE)로 저장되어 있을 수 있으므로 소문자로 변환해 넘깁니다.
      settingsStore.initSettings(viewMode.value.toLowerCase(), contrastMode.value);
    }
  } catch (error) {
    console.error("유저 정보 로드 실패:", error);
  }
};

/**
 * 서버에 설정 저장
 */
const updateMemberSettings = async () => {
  try {
    await instance.patch('/members/me', {
      nickname: userInfo.value.nickname,
      profileImage: userInfo.value.profileImage,
      viewMode: viewMode.value, // DB에는 대문자 유지 가능
      contrastMode: contrastMode.value,
      gameReminder: gameReminder.value,
      dailyRoutine: dailyRoutine.value
    });
    console.log("설정 자동 저장 완료");
  } catch (error) {
    showToast('설정 저장 중 오류가 발생했습니다.');
  }
};

/**
 * 4. 감시자(Watch): UI 변경 시 스토어 반영 + 서버 저장
 */
// 글자 크기 변경 시
watch(viewMode, (newVal) => {
  // CSS(Store)에는 소문자로 전달하여 main.css와 매칭시킵니다.
  settingsStore.setFontSize(newVal.toLowerCase());
  updateMemberSettings();
});

// 고대비 모드 변경 시
watch(contrastMode, (newVal) => {
  settingsStore.setHighContrast(newVal);
  updateMemberSettings();
});

// 알림 설정 변경 시 (서버만 저장)
watch([gameReminder, dailyRoutine], () => {
  updateMemberSettings();
});

/* --- 로그아웃/탈퇴 로직 기존과 동일 --- */
const handleLogout = async () => { /* ... */ };
const handleWithdraw = () => { /* ... */ };

onMounted(() => {
  fetchUserData();
});
</script>

<style scoped>
/* 1. 프로필 상단 카드 설정 */
.profile-card {
  /* 하드코딩된 색상을 변수화하여 고대비 모드에 대응합니다. */
  --van-cell-background: var(--color-brand-blue);
  --van-cell-group-inset-radius: 2rem;
}

.van-cell-group--inset {
  --van-cell-group-inset-radius: 1.5rem;
}

/* 2. 셀렉트 박스 (크게 보기 선택창) */
.view-mode-select {
  background-color: var(--color-brand-blue); /* 배경색도 테마를 따르게 변경 */
  color: var(--color-text-main);
  border: 1px solid #ddd;
  outline: none;
  /* 픽셀 대신 rem 사용 */
  padding: 0.5rem 1rem;
  font-size: 1.125rem; /* 약 18px */
}

.view-mode-select:focus {
  border-color: var(--color-brand-green);
}

/* 3. 푸터 영역 (로그아웃, 탈퇴) */
.profile-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
  /* 80px -> 5rem, 60px -> 3.75rem */
  margin-top: 5rem;
  margin-bottom: 3.75rem;
}

/* 4. 로그아웃 버튼 */
.btn-logout {
  display: flex;
  align-items: center;
  gap: 0.5rem; /* 8px -> 0.5rem */

  /* 20px -> 1.25rem (글자 크기를 키우면 이 수치에 배율이 곱해집니다) */
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text-sub); /* 고대비 모드 대응 색상 */
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout .material-symbols-outlined {
  /* 아이콘도 글자와 함께 커져야 합니다. 24px -> 1.5rem */
  font-size: 1.5rem;
}

.btn-logout:hover {
  color: var(--color-brand-green);
}

/* 5. 회원 탈퇴 버튼 */
.btn-withdraw {
  /* 40px -> 2.5rem */
  margin-top: 2.5rem;
  /* 14px -> 0.875rem */
  font-size: 0.875rem;
  font-weight: 500;
  color: #fca5a5; /* 탈퇴는 보통 연한 빨강 유지 */
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
</style>