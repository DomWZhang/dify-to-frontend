import { createApi } from '../generator';

export default createApi({
  list: { url: '/ipmi-web-api/provider/list', method: 'post' },
});
