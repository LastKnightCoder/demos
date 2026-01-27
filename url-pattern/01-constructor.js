/**
 * URLPattern 构造函数演示
 * 运行方式: node 01-constructor.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern 构造函数演示');
console.log('='.repeat(60));

// ============================================================
// 1. 使用完整 URL 模式字符串
// ============================================================
console.log('\n【1. 使用完整 URL 模式字符串】\n');

const pattern1 = new URLPattern('https://example.com/users/:id');
console.log('模式:', 'https://example.com/users/:id');
console.log('pattern1.protocol:', pattern1.protocol);
console.log('pattern1.hostname:', pattern1.hostname);
console.log('pattern1.pathname:', pattern1.pathname);

// ============================================================
// 2. 使用路径 + baseURL
// ============================================================
console.log('\n【2. 使用路径 + baseURL】\n');

const pattern2 = new URLPattern('/users/:id', 'https://example.com');
console.log('模式: /users/:id');
console.log('baseURL: https://example.com');
console.log('pattern2.protocol:', pattern2.protocol);
console.log('pattern2.hostname:', pattern2.hostname);
console.log('pattern2.pathname:', pattern2.pathname);

// ============================================================
// 3. 使用对象形式 (URLPatternInit)
// ============================================================
console.log('\n【3. 使用对象形式 (URLPatternInit)】\n');

const pattern3 = new URLPattern({
  protocol: 'https',
  hostname: '*.example.com',
  pathname: '/api/v:version/users/:id',
  search: '*',
  hash: '*'
});

console.log('模式对象:', JSON.stringify({
  protocol: 'https',
  hostname: '*.example.com',
  pathname: '/api/v:version/users/:id'
}, null, 2));
console.log('\npattern3.protocol:', pattern3.protocol);
console.log('pattern3.hostname:', pattern3.hostname);
console.log('pattern3.pathname:', pattern3.pathname);
console.log('pattern3.search:', pattern3.search);
console.log('pattern3.hash:', pattern3.hash);

// ============================================================
// 4. 使用 options 参数 (ignoreCase)
// ============================================================
console.log('\n【4. 使用 options 参数 (ignoreCase)】\n');

const patternCaseSensitive = new URLPattern('/Users/:id', 'https://example.com');
const patternIgnoreCase = new URLPattern('/Users/:id', 'https://example.com', { ignoreCase: true });

console.log('测试 URL: https://example.com/users/123');
console.log('区分大小写 (默认):', patternCaseSensitive.test('https://example.com/users/123'));
console.log('忽略大小写:', patternIgnoreCase.test('https://example.com/users/123'));

// ============================================================
// 5. 查看所有实例属性
// ============================================================
console.log('\n【5. 查看所有实例属性】\n');

const pattern5 = new URLPattern('/users/:id', 'https://example.com:8080');

const properties = {
  protocol: pattern5.protocol,
  username: pattern5.username,
  password: pattern5.password,
  hostname: pattern5.hostname,
  port: pattern5.port,
  pathname: pattern5.pathname,
  search: pattern5.search,
  hash: pattern5.hash,
  hasRegExpGroups: pattern5.hasRegExpGroups
};

console.log('URLPattern 实例属性:');
console.log(JSON.stringify(properties, null, 2));

// ============================================================
// 6. 错误处理示例
// ============================================================
console.log('\n【6. 错误处理示例】\n');

try {
  // 相对路径缺少 baseURL 会抛出错误
  new URLPattern('/users/:id');
} catch (e) {
  console.log('错误类型:', e.constructor.name);
  console.log('错误信息:', e.message);
}

console.log('\n' + '='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
