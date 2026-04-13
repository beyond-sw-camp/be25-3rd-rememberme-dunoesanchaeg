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
    // {
    //     path: '/login',
    //     name: 'Login',
    //     component: () => import("@/pages/login/Login.vue"),
    //     meta: {hideLayout: true}
    // },
    // {
    //     path: '/account-recovery',
    //     name: 'AccountRecovery',
    //     component: () => import('@/pages/profile/AccountRecovery.vue'),
    //     meta: {hideLayout: true}
    // },
    // {
    //     path: '/kakao-auth',
    //     name: 'KakaoCallback',
    //     component: KakaoCallback,
    //     meta: {hideLayout: true}
    // },
    // {
    //     path: '/profile/complete',
    //     name: 'ProfileComplete',
    //     component: () => import('@/pages/profile/ProfileComplete.vue'),
    //     meta: {hideLayout: true} // 하단바 숨겨야하는 경우 사용
    // },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {path: '/statistics', name: 'Statistics', component: Statistics},
    {path: '/statistics/detail', name: 'StatisticsDetail', component: () => import("@/pages/statistics/DailyDetail.vue"), meta: {hideLayout: true}},
    {path: '/notices', name: 'Notice', component: Notice},
    {path: '/profile', name: 'Profile', component: Profile},
    {path: '/profile/edit', name: 'ProfileEdit', component: () => import("@/pages/profile/ProfileEdit.vue")},
    {
        path: '/minigame',
        children: [
            {path: 'arithmetic', name: 'GameArithmetic', component: () => import("@/pages/minigame/Arithmetic.vue")},
            {path: 'wordmemory', name: 'GameWordmemory', component: () => import("@/pages/minigame/WordMemory.vue")},
            {path: 'dekarterps', name: 'GameDekarterps', component: () => import("@/pages/minigame/Dekarterps.vue")},
        ]
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach((to) => {
//   const authStore = useAuthStore();
//   const token = localStorage.getItem('accessToken');
//   const role = getRoleFromToken(token);
//   const isProfileCompleted = localStorage.getItem('isProfileCompleted') === 'true';
//
//   const publicPages = ['Login', 'KakaoCallback'];
//   const targetName = to.name;
//   const isPublicPage = publicPages.includes(targetName);
//
//   if (token && isTokenExpired(token)) {
//       console.warn("토큰이 만료되었습니다. 세션을 초기화합니다.");
//       authStore.logout(); // 스토어와 로컬스토리지 모두 삭제
//       return { name: 'Login' };
//   }
//
//   if (!isPublicPage && !token) {
//     return { name: 'Login' };
//   }
//
//   if (token) {
//     if (isPublicPage) {
//       return { name: 'Home' };
//     }
//
//     if (role === 'WITHDRAWN') {
//       if (targetName !== 'AccountRecovery') {
//         return { name: 'AccountRecovery' };
//       }
//       return true;
//     }
//
//     if (!isProfileCompleted && targetName !== 'ProfileComplete') {
//       return { name: 'ProfileComplete' };
//     }
//
//     if (isProfileCompleted && targetName === 'ProfileComplete') {
//       return { name: 'Home' };
//     }
//   }
//   return true;
// });

export default router;