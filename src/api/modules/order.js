import { createApi } from '../generator';

export default createApi({
  list: { url: '/order/list', method: 'get' },
  detail: { url: '/order/detail', method: 'get' },
  create: { url: '/order/create', method: 'post' },
});
