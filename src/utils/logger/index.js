const isProd = import.meta.env.PROD; // 生产环境自动关闭日志

// 统一样式模板
const styles = {
  base: `
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 12px;
    color: #fff;
  `,
  info: `background:#409EFF;`, // 蓝色
  success: `background:#67C23A;`, // 绿色
  warn: `background:#E6A23C;`, // 橙色
  error: `background:#F56C6C;`, // 红色
  mock: `background:#2ecc71;font-weight:bold;`, // mock 启动
};

/**
 * 内部打印函数
 */
function print(label, style, ...args) {
  if (isProd) return; // 生产关闭

  console.log(`%c ${label} `, styles.base + style, ...args);
}

/**
 * 封装外部 API
 */
export const log = {
  info: (...args) => print('INFO', styles.info, ...args),
  success: (...args) => print('SUCCESS', styles.success, ...args),
  warn: (...args) => print('WARN', styles.warn, ...args),
  error: (...args) => print('ERROR', styles.error, ...args),

  mock: (...args) => print('MOCK', styles.mock, ...args),

  /**
   * 分组打印（带折叠）
   */
  group(title, fn) {
    if (isProd) return;
    console.groupCollapsed(`%c ${title} `, styles.base + styles.info);
    fn();
    console.groupEnd();
  },
};
