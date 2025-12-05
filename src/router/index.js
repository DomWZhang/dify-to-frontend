import { createRouter, createWebHashHistory } from 'vue-router';
import home from '@/router/modules/home';
import user from '@/router/modules/user';

const routes = [
  ...home,
  ...user,
  {
    path: '/hospitalList',
    name: 'HospitalList',
    component: () => import('@/views/hospitalList/index.vue'),
    meta: { title: 'MSH直付医院列表' },
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 简单的滚动行为：按浏览器行为或回到顶部
    if (savedPosition) return savedPosition;
    return { top: 0 };
  },
});

// 全局导航守卫（示例：设置 document.title）
router.beforeEach((to, from, next) => {
  if (to.meta && to.meta.title) {
    document.title = to.meta.title;
  }
  // 这里可以处理权限校验，例如：
  // const token = localStorage.getItem('token')
  // if (to.meta.requiresAuth && !token) return next('/login')
  next();
});

export default router;
