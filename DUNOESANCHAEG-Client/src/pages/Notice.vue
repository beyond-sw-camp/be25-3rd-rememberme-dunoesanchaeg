<template>
  <div class="notice-container">
    <div v-if="selectedNotice" class="detail-view">
      <div class="flex items-center mb-6">
        <button @click="closeDetail" class="back-button">
          <van-icon name="arrow-left" /> 뒤로가기
        </button>
      </div>

      <div class="bg-surface p-6 rounded-card border-2 border-[var(--color-border)] shadow-sm">
        <h2 class="text-2xl font-bold text-main mb-2">{{ selectedNotice.title }}</h2>
        <p class="text-sm text-muted mb-6">{{ formatDate(selectedNotice.createdAt) }}</p>

        <div class="content-area text-base text-main whitespace-pre-wrap leading-relaxed">
          {{ selectedNotice.content }}
        </div>
      </div>
    </div>

    <div v-else class="list-view">
      <h1 class="text-3xl font-extrabold text-brand-green tracking-tight mb-10">공지사항</h1>

      <van-list 
            v-model:loading="loading" 
            :finished="finished" 
            finished-text="모든 공지를 확인했습니다" 
            @load="onLoad"
      >
        <div 
          v-for="item in noticeList" 
          :key="item.noticeId"
          class="notice-item bg-surface p-5 mb-6 flex items-center justify-between rounded-card border-2 border-[var(--color-border)] flex justify-between items-center transition-standard active:scale-[0.98]"
          @click="fetchDetail(item.noticeId)"
          >
          <div class="flex-1">
            <h3 class="text-lg font-bold text-main line-clamp-1">{{ item.title }}</h3>
            <p class="text-sm text-muted mt-1">{{ formatDate(item.createdAt) }}</p>
          </div>
          <van-icon name="arrow" class="text-3xl" />
        </div>
      </van-list>

      <div v-if="noticeList.length === 0 && !loading" class="py-20 text-center text-muted">
        등록된 공지사항이 없습니다.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import instance from '@/api/instance';
import { showToast, List as VanList, Icon as VanIcon, Cell as VanCell } from 'vant';


// 상태 관리
const noticeList = ref([]);
const selectedNotice = ref(null);
const loading = ref(false);
const finished = ref(false);
const page = ref(0);
const size = ref(10);

// API 호출 설정
const onLoad = async () => {
  try {
    const response = await instance.get('/notices', {
      params: { page: page.value, size: size.value }
    });

    const data = response.data.data;

    if (data && data.length > 0) {
      noticeList.value.push(...data);
      page.value++;
    }

    loading.value = false;

    if (!data || data.length < size.value) {
      finished.value = true;
    }
  } catch (error) {
    console.error('공지 로드 실패:', error);
    showToast('공지사항을 불러오지 못했습니다.');
    loading.value = false;
    finished.value = true;
  }
};

// 상세 내용 가져오기
const fetchDetail = async (id) => {
  try {
    const response = await instance.get(`/notices/${id}`);
    selectedNotice.value = response.data.data;
    window.scrollTo(0, 0);
  } catch (error) {
    showToast('상세 내용을 불러올 수 없습니다.');
  }
};

const closeDetail = () => {
  selectedNotice.value = null;
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};
</script>

<style scoped>
.notice-container {
  min-height: calc(100vh - 150px);
}

/* main.css 변수 활용 */
.text-main {
  color: var(--color-text-main);
}

.text-muted {
  color: var(--color-text-muted);
}

.bg-surface {
  background-color: var(--color-surface);
}

.rounded-card {
  border-radius: 24px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--color-brand-green);
  font-weight: bold;

  font-size: calc(var(--van-font-size-lg) * var(--font-scale)*1.2);
}

.notice-item {
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

html[data-high-contrast="true"] .notice-item {
  box-shadow: none;
}

.content-area {
  min-height: 200px;
}
</style>