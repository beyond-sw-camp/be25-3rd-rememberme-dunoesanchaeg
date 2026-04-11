<template>
  <div class="bg-surface rounded-card p-5 shadow-[0_4px_20px_rgba(0,0,0,0.05)]">
    <div class="flex items-center justify-between mb-6">
      <button @click="changeMonth(-1)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-blue transition-colors text-brand-green">
        <span class="text-2xl font-bold">&lt;</span>
      </button>
      <h2 class="text-2xl font-extrabold text-text-main">
        {{ currentYear }}년 {{ currentMonth }}월
      </h2>
      <button @click="changeMonth(1)" class="w-10 h-10 flex items-center justify-center rounded-full hover:bg-brand-blue transition-colors text-brand-green">
        <span class="text-2xl font-bold">&gt;</span>
      </button>
    </div>

    <div class="grid grid-cols-7 gap-2 mb-4 text-center">
      <div v-for="(day, index) in weekDays" :key="day" 
           class="text-base font-bold" 
           :class="{'text-red-500': index === 0, 'text-blue-500': index === 6, 'text-text-sub': index > 0 && index < 6}">
        {{ day }}
      </div>
    </div>

    <div class="grid grid-cols-7 gap-y-4 gap-x-2 text-center">
      <div v-for="blank in blankDays" :key="'blank-' + blank" class="h-12 border-transparent"></div>

      <div v-for="date in daysInMonth" :key="date.day"
           @click="handleDateClick(date)"
           class="relative h-12 flex flex-col items-center justify-center rounded-2xl cursor-pointer transition-standard"
           :class="[
             date.isToday ? 'bg-brand-green text-surface shadow-md' : 'hover:bg-brand-blue text-text-main'
           ]">
        <span class="text-lg font-bold z-10" :class="{'text-red-500': !date.isToday && date.weekDay === 0, 'text-blue-500': !date.isToday && date.weekDay === 6}">
          {{ date.day }}
        </span>
        
        <span v-if="date.hasRecord && !date.isToday" 
              class="absolute bottom-1 w-2 h-2 rounded-full bg-brand-green">
        </span>
        <span v-else-if="date.hasRecord && date.isToday" 
              class="absolute bottom-1 w-2 h-2 rounded-full bg-surface">
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';

const router = useRouter();

const currentDate = ref(new Date());
const records = ref({}); 

const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

const currentYear = computed(() => currentDate.value.getFullYear());
const currentMonth = computed(() => currentDate.value.getMonth() + 1);

const blankDays = computed(() => {
  const firstDayOfMonth = new Date(currentYear.value, currentMonth.value - 1, 1).getDay();
  return firstDayOfMonth;
});

const daysInMonth = computed(() => {
  const daysCount = new Date(currentYear.value, currentMonth.value, 0).getDate();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === currentYear.value && today.getMonth() + 1 === currentMonth.value;
  
  return Array.from({ length: daysCount }, (_, i) => {
    const day = i + 1;
    const dateStr = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dateObj = new Date(currentYear.value, currentMonth.value - 1, day);
    
    return {
      day,
      dateStr,
      weekDay: dateObj.getDay(),
      isToday: isCurrentMonth && day === today.getDate(),
      hasRecord: !!records.value[dateStr]
    };
  });
});

// Methods
const changeMonth = (offset) => {
  currentDate.value = new Date(currentYear.value, currentMonth.value - 1 + offset, 1);
};

// TODO: 사용자가 요청한 단건 API를 통해 해당 날짜 데이터 요청 및 상세 이동 라우팅 구현
const handleDateClick = async (date) => {
  // 
  try {
    // 1. 실제 서버 요청:
    // const response = await axios.get(`http://localhost:8080/api/v1/calendar/summary?targetDate=${date.dateStr}`);
    
    // 2. 라우터를 통해 상세보기 모달이나, 페이지로 정보를 전달
    router.push({
      path: '/statistics/detail',
      query: { date: date.dateStr }
    });
  } catch (error) {
    console.error("Failed to fetch calendar summary", error);
  }
};

// TODO: 이번 달 전체의 기록 여부를 가져와서 records 에 삽입 
const fetchMonthlyRecords = async () => {
  // 목업 데이터(예시)
  const mockDateBase = `${currentYear.value}-${String(currentMonth.value).padStart(2, '0')}`;
  records.value = {
    [`${mockDateBase}-11`]: true,
    [`${mockDateBase}-15`]: true,
    [`${mockDateBase}-20`]: true,
  };
};

watch(currentMonth, () => {
  fetchMonthlyRecords();
});

onMounted(() => {
  fetchMonthlyRecords();
});
</script>

<style scoped>
</style>
