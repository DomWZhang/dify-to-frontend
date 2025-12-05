import http from './http';

// 防重复请求状态机
const pendingMap = new Map();
function getPendingKey(config) {
  const { method, url, params, data } = config;
  return [method, url, JSON.stringify(params), JSON.stringify(data)].join('&');
}

export async function request(config) {
  const key = getPendingKey(config);

  if (pendingMap.has(key)) {
    return Promise.reject({ message: '重复请求被阻止' });
  }

  pendingMap.set(key, true);
  try {
    const res = await http(config);
    return res;
  } finally {
    pendingMap.delete(key);
  }
}

/**
 * 自动生成 API 方法
 * @param {*} apis 对象格式：{ login: { url, method } }
 */
export function createApi(apis) {
  const result = {};
  Object.keys(apis).forEach(key => {
    let api = apis[key];
    // 简单写法：字符串 = GET 请求
    if (typeof api === 'string') api = { url: api, method: 'get' };

    result[key] = (data = {}, config = {}) => {
      const isGet = api.method.toLowerCase() === 'get';
      return request({
        url: api.url,
        method: api.method,
        ...(isGet ? { params: data } : { data }),
        ...config,
      });
    };
  });
  return result;
}
