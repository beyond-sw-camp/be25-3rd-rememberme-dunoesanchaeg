import {createRouter, createWebHistory} from 'vue-router';
import {useAuthStore} from '@/store/auth.js';
import { getRoleFromToken, isTokenExpired } from '@/utils/jwtUtils.js';

// 컴포넌트 임포트
import Home from "@/pages/Home.vue";
import Statistics from "@/pages/Statistics.vue";
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
    //     meta: {hideLayout: true}
    // },
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {path: '/statistics', name: 'Statistics', component: Statistics},
    {path: '/notice', name: 'Notice', component: Notice},
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
//     const authStore = useAuthStore();
//     const token = localStorage.getItem('token');
//
//     // 1. 변수 선언 (에러 발생 지점 해결 🎯)
//     const targetName = to.name;
//     const expired = isTokenExpired(token);
//     const role = getRoleFromToken(token);
//     const isProfileCompleted = localStorage.getItem('isProfileCompleted') === 'true';
//
//     // 2. 공개 페이지 설정
//     const publicPages = ['Login', 'KakaoCallback', 'AccountRecovery'];
//     const isPublicPage = publicPages.includes(targetName);
//
//     // 3. 토큰이 만료되었거나 없는 경우
//     if (!token || expired) {
//         if (token && expired) {
//             // 만료되었다면 로컬 스토리지 청소
//             localStorage.removeItem('token');
//             localStorage.removeItem('isProfileCompleted');
//             localStorage.removeItem('role');
//         }
//
//         if (isPublicPage) return true;
//         return { name: 'Login' };
//     }
//
//     // 4. 유효한 토큰이 있는 경우 (로그인 상태)
//     if (token && !expired) {
//         // 로그인/카카오 콜백 페이지로 가려 하면 홈으로 리다이렉트
//         if (targetName === 'Login' || targetName === 'KakaoCallback') {
//             return { name: 'Home' };
//         }
//
//         // 탈퇴 회원인 경우
//         if (role === 'WITHDRAWN') {
//             if (targetName !== 'AccountRecovery') {
//                 return { name: 'AccountRecovery' };
//             }
//             return true;
//         }
//
//         // 프로필 미완료자인 경우
//         if (!isProfileCompleted && targetName !== 'ProfileComplete') {
//             return { name: 'ProfileComplete' };
//         }
//
//         // 프로필 완료했는데 다시 작성 페이지로 가려 하는 경우
//         if (isProfileCompleted && targetName === 'ProfileComplete') {
//             return { name: 'Home' };
//         }
//     }
//
//     return true;
// });

export default router;