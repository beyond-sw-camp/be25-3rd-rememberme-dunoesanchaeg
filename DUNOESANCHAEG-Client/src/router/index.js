import { createRouter, createWebHistory } from 'vue-router';
import Home from "../pages/Home.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Statistics from "../pages/Statistics.vue";
import Notice from "../pages/Notice.vue";
import Profile from "../pages/profile/Profile.vue";
import KakaoCallback from "../pages/login/KakaoCallback.vue";

const routes = [
    // TODO 마지막에 주석 해제 해야함
  {
    path: '/login',
    name: 'Login',
    component: () => import("../pages/login/Login.vue"), // MainLayout 바깥 todo 수정 필요
  },
  {
    path: '/account-recovery',
    name: 'AccountRecovery',
    component: () => import('../pages/profile/AccountRecovery.vue'),
  },
  // {
  //   path: '/kakao-auth',
  //   name: 'KakaoCallback',
  //   component: KakaoCallback,
  // },
  {
    path: '/',
    component: MainLayout, // 전체 틀(네비바 포함)을 레이아웃으로 설정
    children: [
      {
        path: '', // 기본 경로일 때 Home을 표시
        name: 'Home',
        component: Home,
      },
      {
        path: 'statistics',
        name: 'Statistics',
        component: Statistics,
      },
      {
        path: 'notice',
        name: 'Notice',
        component: Notice,
      },
      {
        path: 'profile/complete',
        name: 'ProfileComplete',
        component: () => import('../pages/profile/ProfileComplete.vue')
      },
      {
        path: 'profile',
        children: [
          {
            path: '', // /profile 주소일 때
            name: 'Profile',
            component: Profile,
          },
          {
            path: 'edit', // /profile/edit 주소일 때
            name: 'ProfileEdit',
            component: () => import("../pages/profile/ProfileEdit.vue"),
          },
        ]
      },
      {
        path: 'minigame',
        children: [
          {
            path: 'arithmetic',
            name: 'GameArithmetic',
            component: () => import("../pages/minigame/Arithmetic.vue")
          },
          {
            path: 'wordmemory',
            name: 'GameWordmemory',
            component: () => import("../pages/minigame/WordMemory.vue")
          },
          {
            path: 'dekarterps',
            name: 'GameDekarterps',
            component: () => import("../pages/minigame/Dekarterps.vue")
          },

        ]
      }

    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});


// router.beforeEach((to) => {
//   const token = localStorage.getItem('token');
//   const isProfileCompleted = localStorage.getItem('isProfileCompleted') === 'true';
//
//   // 1. 인증이 필요 없는 페이지 정의 (카카오 콜백 필수 포함)
//   const publicPages = ['Login', 'KakaoCallback'];
//   const isPublicPage = publicPages.includes(to.name);
//
//   // 2. 비로그인 상태인데 보호된 페이지에 접근할 때 -> 로그인으로
//   if (!isPublicPage && !token) {
//     return { name: 'Login' };
//   }
//
//   // 3. 로그인 상태인데 로그인 페이지에 접근할 때 -> 홈으로
//   if (to.name === 'Login' && token) {
//     return { name: 'Home' };
//   }
//
//   // 4. 로그인 상태지만 프로필 미완성인데 다른 곳으로 갈 때 -> 프로필 완성 페이지로
//   if (token && !isProfileCompleted && to.name !== 'ProfileComplete') {
//     // showToast('추가 정보 입력이 필요합니다.'); // 필요시 추가
//     return { name: 'ProfileComplete' };
//   }
//
//   // 5. 프로필 완성된 유저가 가입 페이지로 가려고 할 때 -> 홈으로
//   if (token && isProfileCompleted && to.name === 'ProfileComplete') {
//     return { name: 'Home' };
//   }
//
//   // 6. 위 모든 조건에 해당하지 않으면 정상 이동
//   return true;
// });

export default router;