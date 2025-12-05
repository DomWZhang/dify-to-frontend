import { createApi } from '../generator';

export default createApi({
  upload: { url: '/file/upload', method: 'post' },
});
