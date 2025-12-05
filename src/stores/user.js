import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    userInfo: {},
  }),

  actions: {
    setToken(token) {
      this.token = token;
    },
    setUserInfo(data) {
      this.userInfo = data;
    },
  },

  persist: true, // pinia-plugin-persistedstate 自动持久化
});
