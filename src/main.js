import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from '@/App.vue';
import '@/style/style.css';
import router from '@/router/index';
import { log } from '@/utils/logger/index';

if (import.meta.env.VITE_USE_MOCK === 'true') {
  await import('@/mock/index.js');
}

const app = createApp(App);

// 封装log
app.config.globalProperties.$log = log;
window.$log = log; // Composition API 也直接使用

app.use(createPinia());
app.use(router);
app.mount('#app');
