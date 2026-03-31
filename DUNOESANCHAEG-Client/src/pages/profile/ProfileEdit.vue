<template>
  <div class="min-h-screen bg-brand-bg p-6 pb-20">
    <header class="flex items-center gap-3 mb-8">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-10 h-auto" />
      <h1 class="text-2xl font-black text-brand-green tracking-tight">회원 정보 수정</h1>
    </header>

    <div class="bg-gray-200 rounded-[2.5rem] p-8 shadow-inner">
      <div class="mb-6">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">이름</label>
        <input
            v-model="form.name"
            type="text"
            @focus="clearField('name')"
            @blur="restoreField('name')"
            class="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-brand-green outline-none text-xl font-medium transition-all"
            placeholder="이름을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">생년월일</label>
        <div class="flex gap-2">
          <select v-model="birth.year" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg bg-white text-center font-bold appearance-none">
            <option v-for="y in years" :key="y" :value="y">{{ y }}년</option>
          </select>
          <select v-model="birth.month" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg bg-white text-center font-bold appearance-none">
            <option v-for="m in availableMonths" :key="m" :value="m">{{ parseInt(m) }}월</option>
          </select>
          <select v-model="birth.day" class="flex-1 p-4 rounded-2xl border-none shadow-sm outline-none text-lg bg-white text-center font-bold appearance-none">
            <option v-for="d in availableDays" :key="d" :value="d">{{ parseInt(d) }}일</option>
          </select>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-lg font-bold text-gray-700 mb-2 ml-2">전화번호</label>
        <input
            v-model="form.phone"
            type="tel"
            maxlength="13"
            @focus="clearField('phone')"
            @blur="restoreField('phone')"
            class="w-full p-4 rounded-2xl border-none shadow-sm focus:ring-2 focus:ring-brand-green outline-none text-xl font-medium transition-all"
            placeholder="010-0000-0000"
        />
      </div>

      <hr class="border-gray-300 mb-8" />

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
              class="w-full p-4 rounded-2xl border-none shadow-sm outline-none text-xl font-medium"
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
              class="w-full p-4 rounded-2xl border-none shadow-sm outline-none text-xl font-medium"
              placeholder="010-0000-0000"
          />
        </div>
      </div>
    </div>

    <div class="flex gap-4 mt-12">
      <button
          @click="handleSave"
          type="button"
          class="flex-1 !py-5 !bg-brand-green !text-white font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition-all border-none cursor-pointer"
      >
        확인
      </button>
      <button
          @click="router.back()"
          type="button"
          class="flex-1 !py-5 !bg-gray-400 !text-white font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition-all border-none cursor-pointer"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { showToast, showLoadingToast, closeToast } from 'vant';
import logoGreen from '../../assets/image/logo_profile.png';

const router = useRouter();

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth() + 1;
const currentDay = today.getDate();

const initialData = ref({});
const form = ref({
  name: '',
  phone: '',
  birthDate: '',
  guardianConsent: false,
  guardianEmail: '',
  guardianPhone: '',
  fontSize: 'MEDIUM',
  isHighContrast: false
});

const birth = ref({ year: '1960', month: '01', day: '01' });

const formatPhone = (val) => {
  if (!val) return '';
  const clean = val.replace(/[^0-9]/g, '');
  if (clean.length <= 3) return clean;
  if (clean.length <= 7) return clean.replace(/(\d{3})(\d{1,4})/, '$1-$2');
  return clean.replace(/(\d{3})(\d{4})(\d{1,4})/, '$1-$2-$3');
};

watch(() => form.value.phone, (newVal) => {
  form.value.phone = formatPhone(newVal);
});
watch(() => form.value.guardianPhone, (newVal) => {
  form.value.guardianPhone = formatPhone(newVal);
});

const years = computed(() => Array.from({ length: 100 }, (_, i) => String(currentYear - i)));

const availableMonths = computed(() => {
  let max = (parseInt(birth.value.year) === currentYear) ? currentMonth : 12;
  return Array.from({ length: max }, (_, i) => {
    const m = i + 1;
    return m < 10 ? '0' + m : String(m);
  });
});

const availableDays = computed(() => {
  const y = parseInt(birth.value.year);
  const m = parseInt(birth.value.month);
  let max = new Date(y, m, 0).getDate();
  if (y === currentYear && m === currentMonth) max = currentDay;
  return Array.from({ length: max }, (_, i) => {
    const d = i + 1;
    return d < 10 ? '0' + d : String(d);
  });
});

watch([() => birth.value.year, () => birth.value.month], () => {
  const maxDay = availableDays.value.length;
  if (parseInt(birth.value.day) > maxDay) {
    birth.value.day = availableDays.value[maxDay - 1];
  }
});

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

const fetchInitialData = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/members/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = response.data.data;
    const mappedData = {
      name: data.name || '',
      phone: formatPhone(data.phone || ''),
      guardianConsent: data.guardianConsent || false,
      guardianEmail: data.guardianEmail || '',
      guardianPhone: formatPhone(data.guardianPhone || ''),
      fontSize: data.fontSize || 'MEDIUM',
      isHighContrast: data.isHighContrast || false
    };

    form.value = { ...mappedData };
    initialData.value = { ...mappedData };

    if (data.birthDate) {
      const [y, m, d] = data.birthDate.split('-');
      birth.value = { year: y, month: m, day: d };
    }
  } catch (error) {
    showToast('회원 정보를 가져오지 못했습니다.');
  }
};

const handleSave = async () => {
  const rawPhone = form.value.phone.replace(/[^0-9]/g, '');
  const rawGuardianPhone = form.value.guardianPhone ? form.value.guardianPhone.replace(/[^0-9]/g, '') : null;
  const formattedBirthDate = `${birth.value.year}-${birth.value.month}-${birth.value.day}`;

  if (form.value.guardianConsent) {
    if (!form.value.guardianEmail && !rawGuardianPhone) {
      return showToast('보호자 동의 시 이메일 또는 전화번호 중 하나는 필수입니다.');
    }
  }

  if (!form.value.name) return showToast('이름을 입력해주세요.');
  if (rawPhone.length < 10) return showToast('올바른 본인 전화번호를 입력해주세요.');

  const requestData = {
    name: form.value.name,
    phone: rawPhone,
    birthDate: formattedBirthDate,
    guardianConsent: form.value.guardianConsent,
    guardianEmail: form.value.guardianEmail || null,
    guardianPhone: rawGuardianPhone,
    fontSize: form.value.fontSize,
    isHighContrast: form.value.isHighContrast
  };

  showLoadingToast({ message: '저장 중...', forbidClick: true });

  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/members/me`, requestData, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (response.data.status === 200) {
      closeToast();
      showToast('성공적으로 수정되었습니다.');
      router.push('/profile');
    }
  } catch (error) {
    closeToast();
    showToast(error.response?.data?.message || '수정 중 오류가 발생했습니다.');
  }
};

onMounted(fetchInitialData);
</script>

<style scoped>
input:focus {
  background-color: #ffffff;
  box-shadow: 0 0 0 4px rgba(45, 122, 54, 0.1);
}

select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232D7A36' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.7rem center;
  background-size: 1.2em;
  padding-right: 2rem;
}

.transition-all {
  transition: all 0.3s ease-in-out;
}
</style>
