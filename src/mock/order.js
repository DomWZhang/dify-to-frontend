import Mock from 'mockjs';

Mock.mock(/\/order\/list/, 'get', options => {
  console.log('Mock hit', options); // 检查是否触发
  const query = options.url.split('?')[1]; // GET 请求 query
  return Mock.mock({
    code: 200,
    data: {
      [`list|10`]: [
        {
          'id|+1': 1,
          name: '@name',
          price: '@float(10,100,2,2)',
        },
      ],
    },
  });
});

Mock.mock(/\/order\/\d+/, 'get', options => {
  const id = options.url.match(/\/(\d+)$/)[1];
  return { code: 200, data: { id, name: '订单' + id, amount: 500, status: 'paid' } };
});
