import { createRouter, createWebHistory } from 'vue-router';
import Homepage from "../pages/Homepage.vue"; 
import MainLayout from "../layouts/MainLayout.vue";

const routes = [
  {
    path: '/',
    component: MainLayout, // 전체 틀(네비바 포함)을 레이아웃으로 설정
    children: [
      {
        path: '', // 기본 경로일 때 Home을 표시
        name: 'Homepage',
        component: Homepage,
      },
      // 다른 페이지들(통계, 프로필 등)도 여기에 추가
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;