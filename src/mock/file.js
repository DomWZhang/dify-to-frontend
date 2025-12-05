import Mock from 'mockjs';

Mock.mock('/api/file/upload', 'post', {
  code: 200,
  data: { url: 'https://mock.com/file.png' },
});
