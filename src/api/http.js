import axios from 'axios';
import { useUserStore } from '@/stores/user';

const http = axios.create({
  baseURL: import.meta.env.VITE_USE_MOCK === 'true' ? '' : import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
});

// 请求拦截
http.interceptors.request.use(
  config => {
    const userStore = useUserStore();
    if (userStore.token) {
      config.headers.Authorization = `Bearer ${userStore.token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截
http.interceptors.response.use(
  response => {
    const res = response.data;
    if (res.code !== 0) {
      return Promise.reject(res);
    }
    return res.data;
  },
  error => {
    return Promise.reject(error);
  }
);

export default http;
