<template>
    <div class="flex justify-between items-end px-1 pt-4">
      <h3 class="text-2xl font-bold text-zinc-800">오늘의 루틴</h3>
      <span class="text-l text-zinc-400">
        {{ missions.length }}개 중
        <span class="text-zinc-800 font-semibold">
          {{missions.filter(g => g.isCompleted).length}}개
        </span> 완료
      </span>
    </div>

    <section class="space-y-4">
      <div v-for="(mission, i) in missions" :key="i"
        class="bg-white p-5 rounded-2xl border border-zinc-200 shadow-sm flex flex-col gap-4">

        <div class="flex items-center gap-3">
          <div class="size-11 bg-zinc-100 rounded-xl flex items-center justify-center text-lg">
            {{ mission.icon }}
          </div>
          <div>
            <h4 class="text-base font-bold text-zinc-800">{{ mission.title }}</h4>
            <p class="text-zinc-400 text-sm">{{ mission.desc }}</p>
          </div>
        </div>

        <router-link v-if="!mission.isCompleted" :to="{ name: mission.link }">
          <button class="start-button">
            시작하기
          </button>
        </router-link>

        <button v-else class="completed-button">
          완료됨
        </button>
      </div>
    </section>
</template>

<script setup>
const props = defineProps({
  missions: {
    type: Array,
    required: true,
    default: () => []
  }
});
</script>
 
<style scoped>
/* ✅ 부모에 있던 버튼 스타일을 이쪽으로 옮겨왔어요! */
.start-button {
  width: 100%;
  padding: 0.875rem 0;
  border-radius: 0.875rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: pointer;
  border: none;
  background-color: var(--color-brand-green);
  color: #ffffff;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.completed-button {
  width: 100%;
  padding: 0.875rem 0;
  border-radius: 0.875rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: default;
  border: none;
  background-color: #f4f4f5; /* zinc-100 */
  color: #a1a1aa; /* zinc-400 */
}
</style>