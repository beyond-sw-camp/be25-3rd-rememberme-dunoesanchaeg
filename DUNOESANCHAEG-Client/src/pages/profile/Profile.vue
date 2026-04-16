<template>

  <!-- 헤더 -->
  <header class="text-3xl font-extrabold text-brand-green tracking-tight mb-10">프로필
  </header>

  <div class="profile-page">
    <!-- 프로필 카드 -->
    <div class="profile-card">
      <div class="profile-card-inner">
        <div class="profile-logo-circle">
          <span>{{ userInfo.nickname[0] }}</span>
        </div>

        <div class="profile-info">
          <div class="profile-name">

            {{ userInfo.nickname || '가져오는 중...' }} 님
          </div>
          <div class="profile-email">
            {{ userInfo.email || '연결 중...' }}
          </div>
        </div>
      </div>
    </div>

    <!-- 회원 관리 -->
    <section class="section">
      <div class="section-title">회원 관리</div>
      <div class="menu-card">
        <router-link to="/profile/edit" class="menu-item">
          <span>회원 정보 수정</span>
          <span class="text-2xl">›</span>
        </router-link>
      </div>
    </section>

    <!-- 화면 설정 -->
    <section class="section">
      <div class="section-title">화면 설정</div>

      <div class="menu-card">

        <div class="menu-item">
          <span>크게 보기</span>
          <select v-model="fontSize" class="view-mode-select">
            <option value="SMALL">작게</option>
            <option value="MEDIUM">중간</option>
            <option value="LARGE">크게</option>
          </select>
        </div>

        <div class="menu-item">
          <span>고대비 모드</span>
          <label class="switch">
            <input type="checkbox" v-model="contrastMode" />
            <span class="slider"></span>
          </label>
        </div>

      </div>
    </section>

    <!-- 하단 -->
    <footer class="footer">
      <button @click="handleLogout" class="btn-logout">
        <span class="material-symbols-outlined">logout</span>
        <span>로그아웃</span>
      </button>
    </footer>
    <footer class="footer">
      <button @click="handleWithdraw" class="btn-withdraw">
        회원 탈퇴
      </button>
    </footer>

    <CustomConfirmDialog
      :show="showLogoutDialog"
      @confirm="onLogoutConfirm"
      @cancel="onLogoutCancel"
    >
      정말 로그아웃 하시겠습니까?
    </CustomConfirmDialog>

    <CustomConfirmDialog
      :show="showWithdrawDialog"
      @confirm="onWithdrawConfirm"
      @cancel="onWithdrawCancel"
    >
      탈퇴 시 30일 이내에만<br/>복구 가능합니다.<br/>계속하시겠습니까?
    </CustomConfirmDialog>

    <CustomErrorDialog :show="showErrorDialog">
      {{ errorMessage }}
    </CustomErrorDialog>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance';
import { useAuthStore } from '@/store/auth';
import { useSettingsStore } from '@/store/settings';
import { showToast } from 'vant';

import CustomConfirmDialog from '@/components/common/CustomConfirmDialog.vue';
import CustomErrorDialog from '@/components/common/CustomErrorDialog.vue';

import logoGreen from '@/assets/image/logo_green1.png';
import profileDefault from '@/assets/image/profile_default.png';

const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const userInfo = ref({ nickname: '', email: '', profileImage: '' });
const fontSize = ref('MEDIUM');
const contrastMode = ref(false); // 로컬 UI용
const gameReminder = ref(true);
const dailyRoutine = ref(true);

const showLogoutDialog = ref(false);
const showWithdrawDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref('');

let resolveLogout = null;
let resolveWithdraw = null;

const requestLogoutConfirm = () => new Promise(resolve => {
  resolveLogout = resolve;
  showLogoutDialog.value = true;
});
const onLogoutConfirm = () => { showLogoutDialog.value = false; if (resolveLogout) resolveLogout(true); };
const onLogoutCancel = () => { showLogoutDialog.value = false; if (resolveLogout) resolveLogout(false); };

const requestWithdrawConfirm = () => new Promise(resolve => {
  resolveWithdraw = resolve;
  showWithdrawDialog.value = true;
});
const onWithdrawConfirm = () => { showWithdrawDialog.value = false; if (resolveWithdraw) resolveWithdraw(true); };
const onWithdrawCancel = () => { showWithdrawDialog.value = false; if (resolveWithdraw) resolveWithdraw(false); };

/*
 * 데이터 로드
 */
// Profile.vue 수정 제안
const fetchUserData = async () => {
  try {
    const response = await instance.get('/members/me');
    const result = response.data.data;
    if (result) {
      userInfo.value = {
        nickname: result.name || result.nickname || '이름 없음',
        email: result.email,
        profileImage: result.profileImage || profileDefault
      };
      fontSize.value = result.fontSize || 'MEDIUM';

      contrastMode.value = result.isHighContrast;
      
      authStore.fontSize = fontSize.value.toLowerCase();
      authStore.isHighContrast = result.isHighContrast;
      localStorage.setItem('fontSize', authStore.fontSize);
      localStorage.setItem('isHighContrast', String(authStore.isHighContrast));

      settingsStore.initSettings(fontSize.value.toLowerCase(), result.isHighContrast);
    }
  } catch (error) {
    console.error("데이터 로드 실패:", error);

    if (error.response?.status === 404) {
      showToast('세션이 만료되었거나 사용자 정보를 찾을 수 없습니다.');

      // 로컬 스토리지 청소 및 상태 초기화
      localStorage.clear();
      authStore.logout();

      // 로그인 페이지로 이동
      await router.replace('/login');
    }
  }
};

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

watch(fontSize, (newVal) => {
  const sizeLower = newVal.toLowerCase();
  settingsStore.setFontSize(sizeLower);
  authStore.fontSize = sizeLower;
  localStorage.setItem('fontSize', sizeLower);
  updateMemberSettings();
});

watch(contrastMode, (newVal) => {
  settingsStore.setHighContrast(newVal); // Store의 함수 호출
  authStore.isHighContrast = newVal;
  localStorage.setItem('isHighContrast', String(newVal));
  updateMemberSettings(); // 서버에도 저장
});

watch([gameReminder, dailyRoutine], () => {
  updateMemberSettings();
});

const handleLogout = async () => {
  const confirmed = await requestLogoutConfirm();
  if (!confirmed) return;

  try {
    // 1. 백엔드에 로그아웃 요청 (브라우저의 Refresh Token 쿠키 삭제)
    await instance.post('/auth/logout');
  } catch (error) {
    console.error('서버 로그아웃 처리 중 오류:', error);
    // 서버 오류가 발생하더라도 프론트엔드 데이터는 무조건 지워야 하므로 throw하지 않습니다.
  } finally {
    // 2. 프론트엔드 상태 및 로컬 스토리지 초기화 (Access Token 삭제)
    authStore.logout();
    showToast('로그아웃 되었습니다.');

    // 3. 로그인 페이지로 이동 (히스토리에 남지 않도록 replace 사용)
    await router.replace('/home');
  }
};

// 회원 탈퇴
const handleWithdraw = async () => {
  const confirmed = await requestWithdrawConfirm();
  if (!confirmed) return;

  try {
    await instance.delete('/members/me');
    authStore.logout();
    showToast('탈퇴가 완료되었습니다.');
    await router.push('/login');
  } catch (error) {
    errorMessage.value = '처리 중 오류가 발생했습니다.';
    showErrorDialog.value = true;
    setTimeout(() => { showErrorDialog.value = false; }, 2000);
  }
};

onMounted(fetchUserData);
</script>

<style scoped>
.profile-page {
  background: var(--color-brand-bg);
  font-size: var(--text-lg);
}

/* 헤더 */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 40px;
}

.logo {
  width: 40px;
}

.title {
  font-weight: 900;
  color: var(--color-brand-green);
}

/* 카드 */
.profile-card {
  background-color: var(--color-surface, #ffffff);
  border-radius: 20px;
  padding: 24px;
  border: 2px solid var(--color-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.profile-card-inner {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-logo-circle {
  width: 2.5em;
  height: 2.5em;
  border-radius: 50%;
  background-color: var(--color-text-main, white);
  color: var(--color-brand-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;

  flex-shrink: 0;
}

.profile-name {
  font-weight: 800;
}

.profile-email {
  color: gray;
  font-size: var(--text-sm);
}

/* 섹션 */
.section {
  margin-top: 40px;
}

.section-title {
  font-size: var(--text-lg);
  font-weight: 700;
  margin-bottom: 10px;
}

/* 메뉴 */
.menu-card {
  background: white;
  overflow: hidden;

  align-items: center;

  background-color: var(--color-surface, #ffffff);

  border-radius: 24px;
  border: 2px solid var(--color-border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 20px;
  font-weight: 600;

  text-decoration: none;
  color: inherit;
}

/* 셀렉트 */
.view-mode-select {
  background-color: var(--color-brand-blue);
  color: var(--color-text-main);
  border: 1px solid var(--color-text-sub);
  outline: none;
  padding: 0.4rem 1rem;
  border-radius: 9999px;
  font-size: var(--text-base);
  font-weight: 700;
}

.switch {
  position: relative;
  width: 44px;
  height: 24px;
}

.switch input {
  display: none;
}

.slider {
  position: absolute;
  inset: 0;
  background-color: #d1d5db;
  border-radius: 999px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

/* 동그라미 */
.slider::before {
  content: "";
  position: absolute;
  width: 20px;
  height: 20px;
  left: 2px;
  top: 2px;
  background-color: var(--color-surface, white);
  border-radius: 50%;
  transition: transform 0.2s ease;
}

/* 체크됐을 때 */
.switch input:checked+.slider {
  background-color: var(--color-brand-green);
}

.switch input:checked+.slider::before {
  transform: translateX(20px);
}

/* 버튼 */
.footer {
  margin-top: 40px;
  text-align: center;
}

.btn-logout {
  font-size: var(--text-lg);
  cursor: pointer;
  background: none;
  border: none;
  color: inherit;

  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  vertical-align: middle;
}

.btn-withdraw {
  font-size: var(--text-base);
  color: red;
}
</style>