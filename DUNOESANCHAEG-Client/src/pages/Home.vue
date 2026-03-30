<template>
  <div class="space-y-8 px-1 pb-10">
    <div class="">
      <span class="text-3xl font-black text-brand-green">두뇌산책</span>
    </div>
    <section class="bg-brand-light-bg p-7 rounded-[--radius-xl] shadow-sm">
      <div class="flex justify-between items-start mb-6">
        <div>
          <p class="text-xs text-gray-500 font-bold mb-1">이번 주 활동</p>
          <h2 class="text-2xl font-bold text-brand-green leading-tight">
            성공적인 산책 중!
          </h2>
        </div>
        <div class="text-right">
          <span class="text-3xl font-black text-brand-green">85%</span>
          <p class="text-[10px] text-gray-400 font-bold uppercase">
            주간 목표 달성
          </p>
        </div>
      </div>

      <div class="flex justify-between items-center gap-1">
        <template
          v-for="(day, idx) in ['월', '화', '수', '목', '금', '토']"
          :key="idx"
        >
          <div class="flex flex-col items-center gap-3">
            <span class="text-xs font-bold text-gray-400">{{ day }}</span>
            <div
              :class="[
                'size-10 rounded-full flex items-center justify-center border-2 transition-all',
                idx < 3
                  ? 'bg-brand-green border-brand-green text-white'
                  : idx === 3
                  ? 'bg-white border-brand-green text-brand-green'
                  : 'bg-gray-100 border-transparent',
              ]"
            >
              <van-icon v-if="idx < 3" name="success" size="18" />
              <span v-else-if="idx === 3" class="text-[10px] font-bold"
                >진행</span
              >
            </div>
          </div>
        </template>
      </div>
    </section>

    <div class="flex justify-between items-end px-2">
      <h3 class="text-xl font-black text-gray-900">오늘의 루틴</h3>
      <span class="text-sm font-bold text-gray-400"
        >3개 중 <span class="text-gray-900">2개</span> 완료</span
      >
    </div>

    <section class="space-y-4">
      <div
        class="bg-brand-blue p-6 rounded-[--radius-xl] shadow-sm border border-gray-50 flex flex-col gap-4"
      >
        <div class="flex justify-between items-start">
          <div
            class="size-12 bg-gray-50 rounded-2xl flex items-center justify-center text-2xl"
          >
            ⚙️
          </div>
          <!-- 완료 태그 -->
          <!-- <van-tag
            round
            color="#F0F5F1"
            text-color="#2D7A36"
            class="px-3 py-1 font-bold"
          >
            <van-icon name="success" class="mr-1" /> 완료
          </van-tag> -->
        </div>
        <div>
          <h4 class="text-xl font-bold text-gray-900">미니게임 - 단어 연상</h4>
          <p class="text-gray-400 text-sm font-medium">기억력 향상 게임</p>
        </div>
        <router-link :to="{ name: 'GameWordmemory' }">
          <button
            to="/minigame/dekartersc"
            class="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-green-900/10"
          >
            <span class="!text-white">시작하기</span>
            <van-icon name="play" class="ml-1 text-white" />
          </button>
        </router-link>
      </div>

      <div
        class="bg-brand-blue p-6 rounded-[--radius-xl] shadow-sm flex flex-col gap-4"
      >
        <div class="flex justify-between items-start">
          <div
            class="size-12 bg-white/60 rounded-2xl flex items-center justify-center text-2xl text-blue-600"
          >
            🧮
          </div>
          <!-- 완료 태그 -->
          <!-- <van-tag
            round
            color="#F0F5F1"
            text-color="#2D7A36"
            class="px-3 py-1 font-bold"
          >
            <van-icon name="success" class="mr-1" /> 완료
          </van-tag> -->
        </div>
        <div>
          <h4 class="text-xl font-bold text-gray-900">미니게임 - 간단 연산</h4>
          <p class="text-gray-400 text-sm font-medium">공간 인지력 훈련</p>
        </div>
        <router-link :to="{ name: 'GameArithmetic' }">
          <button
            class="w-full bg-brand-green text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-md shadow-green-900/10"
          >
            <span class="!text-white">시작하기</span>
            <van-icon name="play" class="ml-1 text-white" />
          </button>
        </router-link>
      </div>

      <div
        class="bg-brand-green p-8 rounded-[--radius-xl] text-white relative overflow-hidden"
      >
        <van-tag color="rgba(255,255,255,0.2)" class="mb-4 px-3 py-1"
          >전문가 팁</van-tag
        >
        <h4 class="text-2xl font-bold leading-tight mb-4">
          매일 15분,<br />뇌가 건강해지는 시간
        </h4>
        <p class="text-white/80 text-sm leading-relaxed mb-2">
          꾸준한 활동은 인지 건강을 지키는 가장 강력한 도구입니다. 오늘도 멋진
          시작을 하셨네요!
        </p>
        <div
          class="absolute -bottom-4 -right-4 size-24 bg-white/10 rounded-full blur-2xl"
        ></div>
      </div>
    </section>
  </div>
</template>