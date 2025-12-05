import { createApi } from '../generator';

export default createApi({
  info: { url: '/ipmi-web-api/premium/info', method: 'post' },
  logout: { url: '/user/logout', method: 'post' },
  profile: '/user/profile', // 简单 GET
});
