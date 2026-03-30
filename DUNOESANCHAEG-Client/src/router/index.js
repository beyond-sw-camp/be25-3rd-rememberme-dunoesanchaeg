import { createRouter, createWebHistory } from 'vue-router';
import Home from "../pages/Home.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Statistics from "../pages/Statistics.vue";
import Notice from "../pages/Notice.vue";
import Profile from "../pages/Profile.vue";
import KakaoCallback from "../pages/KakaoCallback.vue";

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import("../pages/Login.vue"), // MainLayout 바깥 todo 수정 필요
  },
  {
    path: '/kakao-auth',
    name: 'KakaoCallback',
    component: KakaoCallback,
  },
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
        path: 'profile',
        name: 'Profile',
        component: Profile,
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


router.beforeEach((to, from) => {
  const isAuthenticated = !!localStorage.getItem('token');
  const publicPages = ['Login', 'KakaoCallback'];
  const isPublicPage = publicPages.includes(to.name);

  if (!isPublicPage && !isAuthenticated) {
    return { name: 'Login' };
  }
  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Home' };
  }
  return true;
});

export default router;