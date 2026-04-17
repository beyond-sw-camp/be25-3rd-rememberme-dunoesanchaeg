<template>
  <div class="flex justify-between items-end px-1 pt-4">
    <h3 class="text-2xl font-bold text-[var(--color-text-main)]">오늘의 루틴</h3>
    <span class="text-lg text-[var(--color-text-muted)]">
      {{ missions.length }}개 중
      <span class="text-[var(--color-text-main)] font-semibold">
        {{missions.filter(g => g.isCompleted).length}}개
      </span> 완료
    </span>
  </div>

  <section class="space-y-4">
    <div v-for="(mission, i) in missions" :key="i"
      class="bg-[var(--color-surface)] p-5 rounded-[24px] border-2 border-[var(--color-border)] shadow-[0_4px_20px_rgba(0,0,0,0.05)] flex flex-col gap-4">

      <div class="flex items-center gap-3">
        <div class="size-11 bg-[var(--color-surface-variant)] rounded-xl flex items-center justify-center text-lg">
          {{ getMissionIcon(mission) }}
        </div>
        <div>
          <h4 class="text-base font-bold text-[var(--color-text-main)]">{{ getMissionTitle(mission) }}</h4>
          <p class="text-[var(--color-text-muted)] text-sm">{{ getMissionDesc(mission) }}</p>
        </div>
      </div>

      <template v-if="mission.assignedGameType">
        <router-link v-if="!mission.gameFinished" :to="getGameLink(mission.assignedGameType)">
          <button class="start-button">시작하기</button>
        </router-link>
        <button v-else class="completed-button">완료됨</button>
      </template>

      <template v-else-if="mission.link === 'OpenQuestion'">
        <button v-if="!mission.isCompleted" @click="goToOpenQuestion" class="start-button">시작하기</button>
        <button v-else class="completed-button">완료됨</button>
      </template>

      <template v-else>
        <router-link v-if="!mission.isCompleted" :to="{ name: mission.link }">
          <button class="start-button">시작하기</button>
        </router-link>
        <button v-else class="completed-button">완료됨</button>
      </template>
    </div>
  </section>

  <CustomErrorDialog :show="showExitedError">
    오늘은 개방형질문을<br/>할 수 없습니다. 😢
  </CustomErrorDialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { startOpenQuestion } from '@/api/openQuestion';
import CustomErrorDialog from '@/components/common/CustomErrorDialog.vue';

const router = useRouter();

const props = defineProps({
  missions: {
    type: Array,
    required: true,
    default: () => []
  }
});

const showExitedError = ref(false);

// 게임 타입에 따른 라우터 링크 반환
const getGameLink = (type) => {
  const gameMap = {
    'ARITHMETIC': { name: 'GameArithmetic' },
    'WORD_MEMORY': { name: 'GameWordmemory' },
    'DESCARTES_RPS': { name: 'GameDekarterps' }
  };
  return gameMap[type] || { name: 'Home' };
};

// 미션 제목 동적 처리
const getMissionTitle = (mission) => {
  if (mission.assignedGameType) return '오늘의 두뇌 게임';
  return mission.title;
};

// 미션 아이콘 동적 처리
const getMissionIcon = (mission) => {
  if (mission.assignedGameType) return '🎮';
  return mission.icon;
};

const getMissionDesc = (mission) => {
  if (mission.assignedGameType) return '뇌 건강을 위해 게임 한 판 어때요?';
  return mission.desc;
};

const goToOpenQuestion = async () => {
  try {
    const data = await startOpenQuestion();

    if (data.status === 'EXITED') {
      showExitedError.value = true;
      setTimeout(() => {
        showExitedError.value = false;
      }, 2000);
      return;
    }

    sessionStorage.setItem('openQuestionEntry', 'allowed');
    router.push('/open-question');
  } catch (error) {
    console.error('개방형질문 시작 확인 실패:', error);
    showExitedError.value = true;
    setTimeout(() => {
      showExitedError.value = false;
    }, 2000);
  }
};
</script>

<style scoped>
.start-button {
  width: 100%;
  padding: 0.875rem 0;
  border-radius: 0.875rem;
  font-weight: 700;
font-size: calc(var(--van-font-size-lg) * var(--font-scale) * 1.2);
  cursor: pointer;
  border: none;
  background-color: var(--color-brand-green);
  color: var(--color-button-text);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.completed-button {
  width: 100%;
  padding: 0.875rem 0;
  border-radius: 0.875rem;
  font-weight: 700;
  font-size: calc(var(--van-font-size-lg) * var(--font-scale) * 1.2);
  cursor: default;
  border: none;
  background-color: var(--color-surface-variant);
  color: var(--color-text-muted);
}
</style>