<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-20">
    <header class="text-center mt-8 mb-12">
      <van-image :src="logoGreen" class="w-24 h-auto mb-4" />
      <h1 class="text-3xl font-black text-gray-800 tracking-tight">환영합니다!</h1>
      <p class="text-gray-500 mt-2 text-lg font-medium">원활한 서비스 이용을 위해<br/>추가 정보를 입력해주세요.</p>
    </header>

    <section class="bg-gray-200 rounded-[2.5rem] p-8 shadow-inner mb-10">
      <h2 class="text-xl font-black text-brand-green mb-8 flex items-center gap-2">
        <span class="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center text-sm">1</span>
        기본 정보 입력
      </h2>

      <div class="mb-6">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">이름</label>
        <input
            v-model="form.name"
            type="text"
            @focus="clearField('name')"
            @blur="restoreField('name')"
            class="w-full p-4 rounded-2xl border-none shadow-sm outline-none text-xl font-medium transition-all bg-gray-100 focus:!bg-white focus:ring-2 focus:ring-brand-green"
            placeholder="성함을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">생년월일</label>
        <div class="flex gap-2">
          <select v-model="birth.year" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg font-bold appearance-none bg-white text-center">
            <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
          </select>
          <select v-model="birth.month" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg font-bold appearance-none bg-white text-center">
            <option v-for="m in availableMonths" :key="m" :value="m">{{ parseInt(m) }}월</option>
          </select>
          <select v-model="birth.day" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg font-bold appearance-none bg-white text-center">
            <option v-for="d in availableDays" :key="d" :value="d">{{ parseInt(d) }}일</option>
          </select>
        </div>
      </div>

      <div class="mb-10">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">전화번호</label>
        <input
            v-model="form.phone"
            type="tel"
            maxlength="13"
            @focus="clearField('phone')"
            @blur="restoreField('phone')"
            class="w-full p-4 rounded-2xl border-none shadow-sm outline-none text-xl font-medium transition-all bg-gray-100 focus:!bg-white focus:ring-2 focus:ring-brand-green"
            placeholder="010-0000-0000"
        />
      </div>

      <hr class="border-gray-300 mb-10" />

      <div class="mb-8 w-full">
        <label class="!block text-lg font-bold text-gray-700 mb-4 ml-2">보호자 활동 공유 동의</label>

        <div class="!grid !grid-cols-2 !gap-2 !w-full">
          <button
              @click="form.guardianConsent = true"
              type="button"
              :class="[
                form.guardianConsent
                  ? '!bg-brand-green !text-white'
                  : '!bg-white !text-gray-400'
              ]"
              class="!w-full !p-4 !rounded-2xl !border-none !shadow-sm !outline-none !text-lg !text-center !font-bold !transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            동의
          </button>
          <button
              @click="form.guardianConsent = false"
              type="button"
              :class="[
                !form.guardianConsent
                  ? '!bg-gray-500 !text-white'
                  : '!bg-white !text-gray-400'
              ]"
              class="!w-full !p-4 !rounded-2xl !border-none !shadow-sm !outline-none !text-lg !text-center !font-bold !transition-all active:scale-95 cursor-pointer flex items-center justify-center"
          >
            미동의
          </button>
        </div>
      </div>

      <div :class="{'opacity-30 pointer-events-none': !form.guardianConsent}" class="transition-all duration-500">
        <div class="mb-6">
          <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">보호자 이메일(선택)</label>
          <input
              v-model="form.guardianEmail"
              type="email"
              @focus="clearField('guardianEmail')"
              @blur="restoreField('guardianEmail')"
              class="w-full p-4 rounded-2xl border-none shadow-sm mb-4 outline-none text-xl font-medium transition-all bg-gray-100 focus:!bg-white"
              placeholder="example@mail.com"
          />
        </div>
        <div class="mb-2">
          <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">보호자 전화번호(선택)</label>
          <input
              v-model="form.guardianPhone"
              type="tel"
              maxlength="13"
              @focus="clearField('guardianPhone')"
              @blur="restoreField('guardianPhone')"
              class="w-full p-4 rounded-2xl border-none shadow-sm outline-none text-xl font-medium transition-all bg-gray-100 focus:!bg-white"
              placeholder="010-0000-0000"
          />
        </div>
      </div>
    </section>

    <section class="bg-gray-200 rounded-[2.5rem] p-8 shadow-inner mb-12">
      <h2 class="text-xl font-black text-brand-green mb-8 flex items-center gap-2">
        <span class="w-8 h-8 bg-brand-green text-white rounded-full flex items-center justify-center text-sm">2</span>
        접근성 설정
      </h2>

      <div class="mb-8">
        <label class="block text-lg font-bold text-gray-700 mb-4 ml-2">글자 크기</label>
        <div class="grid grid-cols-3 gap-3">
          <button
              v-for="size in ['SMALL', 'MEDIUM', 'LARGE']"
              :key="size"
              @click="form.fontSize = size"
              type="button"
              :class="[
                form.fontSize === size
                  ? '!bg-brand-green !text-white !font-black'
                  : '!bg-white !text-gray-500 !font-medium'
              ]"
              class="!py-4 rounded-2xl !text-lg shadow-sm transition-all border-none cursor-pointer flex items-center justify-center"
          >
            {{ size === 'SMALL' ? '작게' : size === 'MEDIUM' ? '보통' : '크게' }}
          </button>
        </div>
      </div>

      <div class="flex items-center justify-between px-2">
        <label class="text-lg font-bold text-gray-700">고대비 모드 활성화</label>
        <van-switch v-model="form.isHighContrast" active-color="#2D7A36" size="32px" />
      </div>
    </section>

    <div class="mt-16 px-2 mb-10">
      <button
          @click="handleComplete"
          type="button"
          class="w-full !py-5 !bg-brand-green !text-white !font-black !text-2xl rounded-2xl shadow-lg active:scale-95 transition-all flex items-center justify-center cursor-pointer border-none"
      >
        시작하기
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showToast, showLoadingToast, closeToast } from 'vant';
import logoGreen from '../../assets/image/logo_profile.png';

const router = useRouter();

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

const form = ref({
  name: '',
  birthDate: '',
  phone: '',
  guardianEmail: '',
  guardianPhone: '',
  guardianConsent: false,
  fontSize: 'MEDIUM',
  isHighContrast: false
});

const initialData = ref({
  name: '', phone: '', guardianEmail: '', guardianPhone: ''
});

const formatPhone = (val) => {
  if (!val) return '';
  const clean = val.replace(/[^0-9]/g, '');
  if (clean.length <= 3) return clean;
  if (clean.length <= 7) return clean.replace(/(\d{3})(\d{1,4})/, '$1-$2');
  return clean.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
};

watch(() => form.value.phone, (newVal) => form.value.phone = formatPhone(newVal));
watch(() => form.value.guardianPhone, (newVal) => form.value.guardianPhone = formatPhone(newVal));

const clearField = (field) => {
  if (form.value[field] === initialData.value[field]) {
    form.value[field] = '';
  }
};

const restoreField = (field) => {
  if (!form.value[field]) {
    form.value[field] = initialData.value[field];
  }
};

const birth = ref({ year: '1960', month: '01', day: '01' });

// [3] 미래 날짜 제한
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

const handleComplete = async () => {
  const rawPhone = form.value.phone.replace(/[^0-9]/g, '');
  const rawGuardianPhone = form.value.guardianPhone ? form.value.guardianPhone.replace(/[^0-9]/g, '') : null;
  const formattedBirthDate = `${birth.value.year}-${birth.value.month}-${birth.value.day}`;

  // 유효성 검증
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

  const requestData = {
    name: form.value.name,
    birthDate: formattedBirthDate,
    phone: rawPhone,
    guardianConsent: form.value.guardianConsent,
    guardianEmail: form.value.guardianEmail || null,
    guardianPhone: rawGuardianPhone,
    fontSize: form.value.fontSize,
    isHighContrast: form.value.isHighContrast
  };

  showLoadingToast({ message: '등록 중...', forbidClick: true });

  try {
    const token = localStorage.getItem('token');
    const response = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/members/profile`, requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.status === 200) {
      localStorage.setItem('isProfileCompleted', 'true'); // 가드 통과용 상태 갱신
      closeToast();
      showToast('반갑습니다! 설정이 완료되었습니다.');
      router.replace('/');
    }
  } catch (error) {
    closeToast();
    showToast(error.response?.data?.message || '등록 중 오류가 발생했습니다.');
  }
};

watch([() => birth.value.year, () => birth.value.month], () => {
  const max = availableDays.value.length;
  if (parseInt(birth.value.day) > max) birth.value.day = availableDays.value[max - 1];
});
</script>

<style scoped>
select {
  -webkit-appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232D7A36' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.8rem center;
  background-size: 1.2em;
  padding-right: 2.5rem;
}
</style>