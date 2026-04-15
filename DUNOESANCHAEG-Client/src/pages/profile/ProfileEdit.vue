<template>
  <div class="min-h-screen bg-brand-bg transition-all">
    <header class="flex items-center gap-3 mb-8">
      <van-image :src="logoGreen" alt="두뇌산책 로고" class="w-10 h-auto" />
      <h1 class="text-2xl font-black text-brand-green tracking-tight">회원 정보 수정</h1>
    </header>

    <div class="bg-white rounded-card p-8 shadow-inner transition-all">

      <div class="mb-6">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">이름</label>
        <input
            v-model="form.name"
            type="text"
            @focus="clearField('name')"
            @blur="restoreField('name')"
            class="input-custom text-xl font-medium"
            placeholder="이름을 입력하세요"
        />
      </div>

      <div class="mb-6">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">생년월일(년, 월, 일)</label>
        <div class="flex gap-2">
          <select v-model="birth.year" class="select-custom text-base">
            <option v-for="y in years" :key="y" :value="y">{{ y }}</option>
          </select>
          <select v-model="birth.month" class="select-custom text-base">
            <option v-for="m in availableMonths" :key="m" :value="m">{{ parseInt(m) }}</option>
          </select>
          <select v-model="birth.day" class="select-custom text-base">
            <option v-for="d in availableDays" :key="d" :value="d">{{ parseInt(d) }}</option>
          </select>
        </div>
      </div>

      <div class="mb-8">
        <label class="block text-lg font-bold text-text-main mb-2 ml-2">전화번호</label>
        <input
            v-model="form.phone"
            type="tel"
            maxlength="13"
            class="input-custom text-xl font-medium"
            placeholder="010-0000-0000"
        />
      </div>

      <hr class="border-text-muted/30 mb-8" />

      <div class="mb-8 w-full">
        <label class="block! text-lg font-bold text-text-main mb-4 ml-2">보호자 활동 공유 동의</label>

        <div class="grid grid-cols-2 gap-2 w-full">
          <button
              @click="form.guardianConsent = true"
              type="button"
              :class="[
                form.guardianConsent
                  ? 'bg-brand-green !text-white'
                  : 'bg-surface text-text-muted'
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
                  ? 'bg-gray-400! !text-white'
                  : 'bg-surface text-text-muted'
              ]"
              class="w-full p-4 rounded-2xl font-bold transition-all active:scale-95 cursor-pointer shadow-sm"
          >
            미동의
          </button>
        </div>
      </div>

      <div :class="{'opacity-20 pointer-events-none': !form.guardianConsent}" class="transition-all duration-500">
        <div class="mb-6">
          <label class="block text-lg font-bold text-text-main mb-2 ml-2">보호자 이메일(선택)</label>
          <input
              v-model="form.guardianEmail"
              type="email"
              class="input-custom text-xl font-medium"
              placeholder="example@mail.com"
          />
        </div>
        <div class="mb-2">
          <label class="block text-lg font-bold text-text-main mb-2 ml-2">보호자 전화번호(선택)</label>
          <input
              v-model="form.guardianPhone"
              type="tel"
              maxlength="13"
              class="input-custom text-xl font-medium"
              placeholder="010-0000-0000"
          />
        </div>
      </div>
    </div>

    <div class="flex gap-4 mt-12">
      <button
          @click="handleSave"
          type="button"
          class="flex-1 py-5 bg-brand-green text-white! font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        확인
      </button>
      <button
          @click="router.back()"
          type="button"
          class="flex-1 py-5 bg-gray-400! text-white! font-black text-2xl rounded-2xl shadow-lg active:scale-95 transition-all cursor-pointer"
      >
        취소
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import instance from '@/api/instance.js';
import { showToast, showLoadingToast, closeToast } from 'vant';
import logoGreen from '../../assets/image/logo_green1.png';

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
    // instance를 사용하면 헤더 설정을 따로 안 해도 됩니다.
    const response = await instance.get('/members/me');
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
    console.error("데이터 로드 실패:", error);
    showToast('회원 정보를 가져오지 못했습니다.');
  }
};

const handleSave = async () => {
  const requestData = {
    name: form.value.name,
    phone: form.value.phone.replace(/[^0-9]/g, ''),
    birthDate: `${birth.value.year}-${birth.value.month}-${birth.value.day}`,
    guardianConsent: form.value.guardianConsent,
    guardianEmail: form.value.guardianEmail || null,
    guardianPhone: form.value.guardianPhone ? form.value.guardianPhone.replace(/[^0-9]/g, '') : null,
    fontSize: form.value.fontSize,
    isHighContrast: form.value.isHighContrast
  };

  showLoadingToast({ message: '저장 중...', forbidClick: true });

  try {
    const response = await instance.patch('/members/me', requestData);

    if (response.data.code === 200) {
      closeToast();
      showToast('성공적으로 수정되었습니다.');

      router.push({ name: 'Profile' });
    }
  } catch (error) {
    closeToast();
    showToast(error.response?.data?.message || '수정 중 오류가 발생했습니다.');
  }
};

onMounted(fetchInitialData);
</script>

<style scoped>
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* 1. 부모 컨테이너 정렬 */
.flex.gap-2 {
  display: flex;
  align-items: stretch; /* 자식 요소들의 높이를 동일하게 맞춤 */
  justify-content: space-between; /* 박스 간 간격을 일정하게 */
}

/* 2. 셀렉트 박스 개별 정렬 */
.select-custom {
  flex: 1; /* 세 박스가 동일한 너비를 가지도록 설정 */
  height: 3.5rem !important; /* 높이 고정 (글자 크기에 영향 받지 않음) */
  padding: 0 0.5rem !important; /* 좌우 여백만 부여, 상하는 0 */
  padding-right: 2.5rem !important; /* 글자 크기에 따라 2~3rem 정도로 조절 */

  /* 글자가 너무 길면 ...으로 생략되게 하여 화살표 침범 방지 */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  vertical-align: middle; /* 박스들끼리 기준선 맞춤 */
  box-sizing: border-box;
}
/* 이름, 전화번호 입력창(input-custom)도 동일하게 적용하고 싶다면 */
.input-custom {
  height: 3.5rem !important;
  padding-top: 0 !important;
  padding-bottom: 0 !important;
  box-sizing: border-box;
}

button {
  font-weight: 600 !important;
}
</style>
