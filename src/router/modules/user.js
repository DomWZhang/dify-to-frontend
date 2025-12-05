export default [
  {
    path: '/user',
    name: 'User',
    component: () => import('@/views/about/index.vue'),
    meta: { title: '用户中心', requiresAuth: true },
  },
];
