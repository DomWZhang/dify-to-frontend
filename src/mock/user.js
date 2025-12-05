import Mock from 'mockjs';

Mock.mock('/api/user/login', 'post', options => {
  const body = JSON.parse(options.body);
  if (body.username === 'wd' && body.password === '123') {
    return { code: 200, data: { token: 'mock-token', username: 'wd' } };
  }
  return { code: 401, message: '账号或密码错误' };
});

Mock.mock('/api/user/profile', 'get', {
  code: 200,
  data: { id: 1, username: 'wd', role: 'admin' },
});
