import { createRouter, createWebHistory } from 'vue-router';
import Home from "../pages/Home.vue";
import MainLayout from "../layouts/MainLayout.vue";
import Statistics from "../pages/Statistics.vue";
import Notice from "../pages/Notice.vue";
import Profile from "../pages/Profile.vue";
import Login from "../pages/Login.vue";

const routes = [
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
        path: 'login',
        name: 'Login',
        component: Login,
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

export default router;