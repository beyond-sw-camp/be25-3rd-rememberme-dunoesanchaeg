import { ref, onUnmounted, readonly } from 'vue';

export function useTimer(initialTime = 0, onTimeUp = null) {
  const timeLeft = ref(initialTime);
  const isActive = ref(false);
  let timerInterval = null;

  // 상태값은 외부에서 직접 수정하지 못하게 readonly로 노출하는 것이 안전합니다.
  const stopTimer = () => {
    isActive.value = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const startTimer = (time) => {
    // 인자가 없으면 현재 남은 시간(timeLeft)으로 재개(Resume)
    if (time !== undefined) {
      timeLeft.value = time;
    }

    if (isActive.value) return; // 이미 실행 중이면 중복 방지

    isActive.value = true;
    timerInterval = setInterval(() => {
      if (timeLeft.value > 0) {
        timeLeft.value--;
      } else {
        stopTimer();
        if (typeof onTimeUp === 'function') {
          onTimeUp();
        }
      }
    }, 1000);
  };

  // 일시정지 기능 (현재 시간 유지)
  const pauseTimer = () => {
    isActive.value = false;
    if (timerInterval) {
      clearInterval(timerInterval);
      timerInterval = null;
    }
  };

  const resetTimer = (time = initialTime) => {
    stopTimer();
    timeLeft.value = time;
  };

  onUnmounted(() => stopTimer());

  return {
    timeLeft: readonly(timeLeft), // 원본 보호를 위해 readonly 권장
    isActive: readonly(isActive),
    startTimer,
    stopTimer,
    pauseTimer,
    resetTimer
  };
}