/**
 * URLPattern test() 方法演示
 * 运行方式: node 02-test-method.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern test() 方法演示');
console.log('='.repeat(60));

const baseURL = 'https://example.com';

// ============================================================
// 1. 基本用法
// ============================================================
console.log('\n【1. 基本用法】\n');

const pattern = new URLPattern('/users/:id', baseURL);
console.log('模式: /users/:id');
console.log('baseURL:', baseURL);

const testCases = [
  'https://example.com/users/123',
  'https://example.com/users/abc',
  'https://example.com/posts/123',
  'https://other.com/users/123',
  'https://example.com/users',
  'https://example.com/users/123/extra'
];

console.log('\n测试结果:');
testCases.forEach(url => {
  const result = pattern.test(url);
  console.log(`  ${result ? '✓' : '✗'} ${url}`);
});

// ============================================================
// 2. 使用完整 URL 对象测试
// ============================================================
console.log('\n【2. 使用完整 URL 对象测试】\n');

// 注意：Node.js 中对象形式需要提供完整的 URL 组件
const fullUrlObj = {
  protocol: 'https',
  hostname: 'example.com',
  pathname: '/users/456'
};
console.log('pattern.test(fullUrlObj)');
console.log('对象:', JSON.stringify(fullUrlObj));
console.log('结果:', pattern.test(fullUrlObj));

// ============================================================
// 3. 使用相对路径 + baseURL 测试
// ============================================================
console.log('\n【3. 使用相对路径 + baseURL 测试】\n');

console.log('pattern.test("/users/789", baseURL)');
console.log('结果:', pattern.test('/users/789', baseURL));

// ============================================================
// 4. 测试不同 URL 组件
// ============================================================
console.log('\n【4. 测试不同 URL 组件】\n');

// 测试协议
const protocolPattern = new URLPattern({ protocol: 'https' });
console.log('协议模式: { protocol: "https" }');
console.log('  https://example.com:', protocolPattern.test('https://example.com'));
console.log('  http://example.com:', protocolPattern.test('http://example.com'));

// 测试主机名
const hostnamePattern = new URLPattern({ hostname: '*.example.com' });
console.log('\n主机名模式: { hostname: "*.example.com" }');
console.log('  api.example.com:', hostnamePattern.test('https://api.example.com'));
console.log('  www.example.com:', hostnamePattern.test('https://www.example.com'));
console.log('  example.com:', hostnamePattern.test('https://example.com'));

// 测试端口
const portPattern = new URLPattern({ port: '8080' });
console.log('\n端口模式: { port: "8080" }');
console.log('  example.com:8080:', portPattern.test('https://example.com:8080'));
console.log('  example.com:3000:', portPattern.test('https://example.com:3000'));

// ============================================================
// 5. 组合多个条件
// ============================================================
console.log('\n【5. 组合多个条件】\n');

const combinedPattern = new URLPattern({
  protocol: 'https',
  hostname: 'api.example.com',
  pathname: '/v:version/*'
});

console.log('组合模式:', JSON.stringify({
  protocol: 'https',
  hostname: 'api.example.com',
  pathname: '/v:version/*'
}));

const combinedTests = [
  'https://api.example.com/v1/users',
  'https://api.example.com/v2/posts/123',
  'http://api.example.com/v1/users',      // 协议不匹配
  'https://www.example.com/v1/users',     // 主机名不匹配
  'https://api.example.com/users'         // 路径不匹配
];

console.log('\n测试结果:');
combinedTests.forEach(url => {
  const result = combinedPattern.test(url);
  console.log(`  ${result ? '✓' : '✗'} ${url}`);
});

console.log('\n' + '='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
