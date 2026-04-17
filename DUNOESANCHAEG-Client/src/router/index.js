import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/store/auth.js';
import {getRoleFromToken} from '@/utils/jwtUtils.js';
import { isTokenExpired } from '@/utils/jwtUtils.js';

// 컴포넌트 임포트
import Home from "@/pages/Home.vue";
import Statistics from "@/pages/statistics/Statistics.vue";
import Notice from "@/pages/Notice.vue";
import Profile from "@/pages/profile/Profile.vue";
import KakaoCallback from "@/pages/login/KakaoCallback.vue";


// meta: {hideLayout: true} 추가시 페이지 및 하단바 안보임
const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import("@/pages/login/Login.vue"),
        meta: {hideLayout: true}
    },
    {
        path: '/account-recovery',
        name: 'AccountRecovery',
        component: () => import('@/pages/profile/AccountRecovery.vue'),
        meta: {hideLayout: true}
    },
    {
        path: '/kakao-auth',
        name: 'KakaoCallback',
        component: KakaoCallback,
        meta: {hideLayout: true}
    },
    {
        path: '/profile/complete',
        name: 'ProfileComplete',
        component: () => import('@/pages/profile/ProfileComplete.vue'),
        meta: {hideLayout: true} // 하단바 숨겨야하는 경우 사용
    },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/daily-record',
        name: 'DailyRecord',
        component: () => import('@/pages/daily-record/DailyRecordPage.vue'),
        meta: {hideLayout: true}
    },
    {path: '/statistics', name: 'Statistics', component: Statistics},
    {path: '/statistics/detail', name: 'StatisticsDetail', component: () => import("@/pages/statistics/DailyDetail.vue"), meta: {hideLayout: true}},
    {path: '/notices', name: 'Notice', component: Notice},
    {path: '/profile', name: 'Profile', component: Profile}, 
    {path: '/profile/edit', name: 'ProfileEdit', component: () => import("@/pages/profile/ProfileEdit.vue"), meta: {hideLayout: true}},
    {
        path: '/minigame',
        name: 'MiniGame',
        children: [
            {path: 'arithmetic', name: 'GameArithmetic', component: () => import("@/pages/minigame/Arithmetic.vue"), meta: {hideLayout: true}},
            {path: 'wordmemory', name: 'GameWordmemory', component: () => import("@/pages/minigame/WordMemory.vue"), meta: {hideLayout: true}},
            {path: 'dekarterps', name: 'GameDekarterps', component: () => import("@/pages/minigame/Dekarterps.vue"), meta: {hideLayout: true}},
        ]
    },
    {
        path: '/open-question',
        name: 'OpenQuestion',
        component: () => import("@/pages/open-question/OpenQuestion.vue"),
        meta: {hideLayout: true}
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0 };
        }
    }
});

router.beforeEach((to) => {
  const authStore = useAuthStore();
  const token = localStorage.getItem('accessToken');
  const role = getRoleFromToken(token);
  const isProfileCompleted = localStorage.getItem('isProfileCompleted') === 'true';

  const publicPages = ['Login', 'KakaoCallback'];
  const targetName = to.name;
  const isPublicPage = publicPages.includes(targetName);

  if (token && isTokenExpired(token)) {
      console.warn("토큰이 만료되었습니다. 세션을 초기화합니다.");
      authStore.logout(); // 스토어와 로컬스토리지 모두 삭제
      return { name: 'Login' };
  }

  if (!isPublicPage && !token) {
    return { name: 'Login' };
  }

  if (token) {
    if (isPublicPage) {
      return { name: 'Home' };
    }

    if (role === 'WITHDRAWN') {
      if (targetName !== 'AccountRecovery') {
        return { name: 'AccountRecovery' };
      }
      return true;
    }

    if (role !== 'WITHDRAWN' && targetName === 'AccountRecovery') {
        console.warn("일반 회원은 계정 복구 페이지에 접근할 수 없습니다.");
        return { name: 'Home' };
    }

    if (!isProfileCompleted && targetName !== 'ProfileComplete') {
      return { name: 'ProfileComplete' };
    }

    if (isProfileCompleted && targetName === 'ProfileComplete') {
      return { name: 'Home' };
    }
  }
  return true;
});

router.beforeEach((to) => {
    const authStore = useAuthStore();
    const token = localStorage.getItem('accessToken');
    
    const publicPages = ['Login', 'KakaoCallback', 'Home']; 
    const isPublicPage = publicPages.includes(to.name);

    if (!isPublicPage && !token) {
        authStore.openLoginModal();
        return false;
    }

    return true; 
});

export default router;