import { ref } from 'vue';
import { useRouter } from 'vue-router';

export function useRouteTransition() {
  const router = useRouter();
  const transitionName = ref('slide-left');

  // 라우팅 방향에 따른 트랜지션 동적 변경
  router.beforeEach((to, from) => {
    if (to.meta.hideLayout && !from.meta.hideLayout) {
      transitionName.value = 'slide-left'; // 상세 페이지로 진입 시
    } else if (!to.meta.hideLayout && from.meta.hideLayout) {
      transitionName.value = 'slide-right'; // 상세 페이지에서 탈출 시
    } else {
      transitionName.value = 'slide-left'; // 기본값
    }
  });

  return { transitionName };
}
