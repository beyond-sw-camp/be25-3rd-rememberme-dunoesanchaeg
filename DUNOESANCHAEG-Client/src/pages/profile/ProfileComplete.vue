<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-20 transition-standard">
    <header class="text-center mt-8 mb-12">
      <van-image :src="logoGreen" class="w-24 h-auto mb-4" />
      <h1 class="text-3xl font-black text-text-main tracking-tight">환영합니다!</h1>
      <p class="text-text-sub mt-2 text-lg font-medium">원활한 서비스 이용을 위해<br/>추가 정보를 입력해주세요.</p>
    </header>

    <section class="bg-surface border-2 border-brand-green rounded-card p-8 mb-10 transition-standard">
      <h2 class="text-xl font-black text-brand-green mb-8 flex items-center gap-2">
        <span class="w-8 h-8 bg-brand-green text-[var(--color-button-text)] rounded-full flex items-center justify-center text-sm">1</span>
        기본 정보 입력
      </h2>

      <div class="mb-6">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">이름</label>
        <input v-model="form.name" type="text" class="input-custom text-xl font-medium placeholder:text-text-muted" placeholder="성함을 입력하세요" />
      </div>

      <div class="mb-6">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">생년월일(년, 월, 일)</label>
        <div class="flex gap-2">
          <select v-model="birth.year" class="select-custom text-lg">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-model="birth.month" class="select-custom text-lg">
            <option v-for="m in availableMonths" :key="m" :value="m">{{ parseInt(m) }}</option>
          </select>
          <select v-model="birth.day" class="select-custom text-lg">
            <option v-for="d in availableDays" :key="d" :value="d">{{ parseInt(d) }}</option>
          </select>
        </div>
      </div>

      <div class="mb-10">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">전화번호</label>
        <input v-model="form.phone" type="tel" maxlength="13" class="input-custom text-xl font-medium placeholder:text-text-muted" placeholder="010-0000-0000" />
      </div>

      <hr class="border-text-muted opacity-30 mb-10" />

      <div class="mb-8 w-full">
        <label class="block text-lg font-bold text-text-main mb-4 ml-2">보호자 활동 공유 동의</label>
        <div class="grid grid-cols-2 gap-2 w-full">
          <button
              @click="form.guardianConsent = true"
              type="button"
              :class="[
                form.guardianConsent
                  ? 'bg-brand-green border-2 border-brand-green !text-[var(--color-button-text)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)] opacity-40'
              ]"
              class="w-full p-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            동의
          </button>
          <button
              @click="form.guardianConsent = false"
              type="button"
              :class="[
                !form.guardianConsent
                  ? 'bg-[var(--color-text-main)] border-2 border-[var(--color-text-main)] !text-[var(--color-surface)]'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-2 border-[var(--color-border)] opacity-40'
              ]"
              class="w-full p-4 rounded-2xl font-bold transition-standard active:scale-95 cursor-pointer shadow-sm"
          >
            미동의
          </button>
        </div>
      </div>

      <div :class="{'opacity-20 pointer-events-none': !form.guardianConsent}" class="transition-standard duration-500">
        <div class="mb-6">
          <label class="block text-lg font-bold text-text-main mb-2 ml-2">보호자 이메일(선택)</label>
          <input v-model="form.guardianEmail" type="email" class="input-custom text-xl font-medium placeholder:text-text-muted mb-4" placeholder="example@mail.com" />
        </div>
        <div class="mb-2">
          <label class="block text-lg font-bold text-text-main mb-2 ml-2">보호자 전화번호(선택)</label>
          <input v-model="form.guardianPhone" type="tel" maxlength="13" class="input-custom text-xl font-medium placeholder:text-text-muted" placeholder="010-0000-0000" />
        </div>
      </div>
    </section>

    <section class="bg-surface border-2 border-brand-green rounded-card p-8 mb-12 transition-standard">
      <h2 class="text-xl font-black text-brand-green mb-8 flex items-center gap-2">
        <span class="w-8 h-8 bg-brand-green text-[var(--color-button-text)] rounded-full flex items-center justify-center text-sm">2</span>
        접근성 설정
      </h2>

      <div class="mb-8">
        <label class="block text-lg font-bold text-text-main mb-4 ml-2">글자 크기</label>
        <div class="grid grid-cols-3 gap-3">
          <button
              v-for="size in ['SMALL', 'MEDIUM', 'LARGE']"
              :key="size"
              @click="handleFontSizeChange(size)"
              type="button"
              :class="[
                form.fontSize === size
                  ? 'bg-brand-green !text-[var(--color-surface)] border-2 border-brand-green'
                  : 'bg-surface text-text-muted font-medium border-2 border-brand-green'
              ]"
              class="py-4 rounded-2xl text-lg shadow-sm transition-standard cursor-pointer flex items-center justify-center"
          >
            {{ size === 'SMALL' ? '작게' : size === 'MEDIUM' ? '중간' : '크게' }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between px-2">
        <label class="text-lg font-bold text-text-main">고대비 모드 활성화</label>
        <van-switch v-model="form.isHighContrast" active-color="var(--color-brand-green)" size="var(--text-3xl)" />
      </div>
    </section>

    <div class="mt-16 px-2 mb-10">
      <button
          @click="handleComplete"
          type="button"
          class="w-full py-5 bg-brand-green !text-[var(--color-surface)] text-2xl rounded-2xl shadow-lg active:scale-95 transition-standard flex items-center justify-center cursor-pointer border-none"
      >
        시작하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { showToast, showLoadingToast, closeToast } from 'vant';
import instance from '@/api/instance.js';
import { useAuthStore } from '@/store/auth.js';
import { useSettingsStore } from '@/store/settings.js';
import logoGreen from '@/assets/image/logo_green1.png';

// 1. 초기화 및 스토어 연결
const router = useRouter();
const authStore = useAuthStore();
const settingsStore = useSettingsStore();

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

// 2. 폼 상태 관리 (통합 관리)
const form = ref({
  name: '',
  phone: '',
  fontSize: 'MEDIUM',
  guardianEmail: '',
  guardianPhone: '',
  guardianConsent: false,
  isHighContrast: false,
});

const birth = ref({ year: '1960', month: '01', day: '01' });

// 3. 접근성 제어 로직
const handleFontSizeChange = (size) => {
  form.value.fontSize = size; // 서버 전송용 (Enum)
  settingsStore.setFontSize(size.toLowerCase());
};

// 고대비 모드 변경 실시간 감시
watch(() => form.value.isHighContrast, (newVal) => {
  settingsStore.setHighContrast(newVal);
});

// 초기 로드 시 현재 폼 상태에 맞춰 UI 초기화
onMounted(() => {
  console.log("프로필 완료 페이지 진입");
  settingsStore.initSettings(
      form.value.fontSize.toLowerCase(),
      form.value.isHighContrast
  ); //
});

// 4. 입력 포맷팅 및 생년월일 계산 로직
const formatPhone = (val) => {
  if (!val) return '';
  const clean = val.replace(/[^0-9]/g, '');
  if (clean.length <= 3) return clean;
  if (clean.length <= 7) return clean.replace(/(\d{3})(\d{1,4})/, '$1-$2');
  return clean.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
};

watch(() => form.value.phone, (newVal) => form.value.phone = formatPhone(newVal));
watch(() => form.value.guardianPhone, (newVal) => form.value.guardianPhone = formatPhone(newVal));

const years = computed(() => Array.from({ length: 100 }, (_, i) => String(currentYear - i)));

const availableMonths = computed(() => {
  let max = (parseInt(birth.value.year) === currentYear) ? currentMonth : 12;
  return Array.from({ length: max }, (_, i) => (i + 1 < 10 ? '0' + (i + 1) : String(i + 1)));
});

const availableDays = computed(() => {
  const y = parseInt(birth.value.year);
  const m = parseInt(birth.value.month);
  let max = new Date(y, m, 0).getDate();
  if (y === currentYear && m === currentMonth) max = currentDay;
  return Array.from({ length: max }, (_, i) => (i + 1 < 10 ? '0' + (i + 1) : String(i + 1)));
});

watch([() => birth.value.year, () => birth.value.month], () => {
  const max = availableDays.value.length;
  if (parseInt(birth.value.day) > max) birth.value.day = availableDays.value[max - 1];
});

// 5. 서버 전송 및 프로필 등록 완료 함수
const handleComplete = async () => {
  const rawPhone = form.value.phone.replace(/[^0-9]/g, '');
  const rawGuardianPhone = form.value.guardianPhone ? form.value.guardianPhone.replace(/[^0-9]/g, '') : null;
  const formattedBirthDate = `${birth.value.year}-${birth.value.month}-${birth.value.day}`;

  if (!form.value.name) return showToast('성함을 입력해주세요.');
  if (rawPhone.length < 10) return showToast('올바른 본인 전화번호를 입력해주세요.');

  if (form.value.guardianConsent) {
    if (!form.value.guardianEmail && !rawGuardianPhone) {
      return showToast('보호자 동의 시 이메일 또는 전화번호 중 하나는 필수입니다.');
    }
    if (rawGuardianPhone === rawPhone) {
      return showToast('보호자 연락처는 본인 연락처와 달라야 합니다.');
    }
  }

  showLoadingToast({ message: '등록 중...', forbidClick: true });

  try {
    const requestData = {
      name: form.value.name,
      birthDate: formattedBirthDate,
      phone: rawPhone,
      guardianEmail: form.value.guardianEmail || null,
      guardianPhone: rawGuardianPhone,
      guardianConsent: form.value.guardianConsent,
      fontSize: form.value.fontSize.toUpperCase(),
      isHighContrast: form.value.isHighContrast
    };

    // 서버 전송
    const response = await instance.put('/members/profile', requestData);

    if (response.status === 200 || response.status === 204) {
      localStorage.setItem('isProfileCompleted', 'true');
      authStore.isProfileCompleted = true;
      closeToast();
      showToast('반갑습니다! 설정이 완료되었습니다.');
      router.replace('/');
    }
  } catch (error) {
    closeToast();
    const serverMessage = error.response?.data?.message || '등록 중 오류가 발생했습니다.';

    if (serverMessage === '사용자 정보를 찾을 수 없습니다.') {
      showToast('인증 정보가 만료되었습니다. 다시 로그인해주세요.');
      localStorage.clear();
      authStore.logout();
      router.replace({ name: 'Login' });
      return;
    }
    showToast(serverMessage);
  }
};
</script>
<style scoped>
  .input-custom {
    height: 3.5rem;
    min-height: 3.5rem;
    max-height: 3.5rem;

    /* 글자가 커졌을 때 박스를 뚫고 나가지 않게 조절 */
    line-height: 1;
    display: flex;
    align-items: center;
    overflow: hidden; /* 글자가 박스보다 커질 경우를 대비 */
  }

  /* 생년월일 input 태그 자체에도 높이 적용 */
  input[type="date"].input-custom {
    padding-top: 0;
    padding-bottom: 0;
  }

  button {
    font-weight: 600 !important;
  }

</style>