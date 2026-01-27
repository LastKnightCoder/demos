/**
 * URLPattern exec() 方法演示
 * 运行方式: node 03-exec-method.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern exec() 方法演示');
console.log('='.repeat(60));

const baseURL = 'https://example.com';

// ============================================================
// 1. 基本用法 - 查看完整返回结构
// ============================================================
console.log('\n【1. 基本用法 - 查看完整返回结构】\n');

const pattern1 = new URLPattern('/users/:userId/posts/:postId', baseURL);
const result1 = pattern1.exec('https://example.com/users/123/posts/456');

console.log('模式: /users/:userId/posts/:postId');
console.log('URL: https://example.com/users/123/posts/456');
console.log('\nexec() 返回结果:');
console.log(JSON.stringify(result1, null, 2));

// ============================================================
// 2. 提取路径参数
// ============================================================
console.log('\n【2. 提取路径参数】\n');

if (result1) {
  const { userId, postId } = result1.pathname.groups;
  console.log('提取的参数:');
  console.log('  userId:', userId);
  console.log('  postId:', postId);
}

// ============================================================
// 3. 不匹配时返回 null
// ============================================================
console.log('\n【3. 不匹配时返回 null】\n');

const result2 = pattern1.exec('https://example.com/posts/123');
console.log('URL: https://example.com/posts/123');
console.log('exec() 返回:', result2);

// ============================================================
// 4. 通配符捕获
// ============================================================
console.log('\n【4. 通配符捕获】\n');

const wildcardPattern = new URLPattern('/api/*', baseURL);
const wildcardResult = wildcardPattern.exec('https://example.com/api/v1/users/123/posts');

console.log('模式: /api/*');
console.log('URL: https://example.com/api/v1/users/123/posts');
console.log('\n捕获的内容 (groups["0"]):');
console.log('  ', wildcardResult.pathname.groups['0']);

// ============================================================
// 5. 可选参数
// ============================================================
console.log('\n【5. 可选参数】\n');

const optionalPattern = new URLPattern('/users/:id?', baseURL);

console.log('模式: /users/:id?');

const optionalTests = [
  'https://example.com/users',
  'https://example.com/users/',
  'https://example.com/users/123'
];

optionalTests.forEach(url => {
  const result = optionalPattern.exec(url);
  if (result) {
    console.log(`\nURL: ${url}`);
    console.log('  id:', result.pathname.groups.id ?? '(undefined)');
  }
});

// ============================================================
// 6. 重复参数 (:path+)
// ============================================================
console.log('\n【6. 重复参数 (:path+)】\n');

const repeatPattern = new URLPattern('/files/:path+', baseURL);

console.log('模式: /files/:path+');

const repeatTests = [
  'https://example.com/files/documents',
  'https://example.com/files/documents/2024/report.pdf'
];

repeatTests.forEach(url => {
  const result = repeatPattern.exec(url);
  if (result) {
    console.log(`\nURL: ${url}`);
    console.log('  path:', result.pathname.groups.path);
  }
});

// ============================================================
// 7. 主机名参数捕获
// ============================================================
console.log('\n【7. 主机名参数捕获】\n');

const subdomainPattern = new URLPattern({
  hostname: ':subdomain.example.com',
  pathname: '/*'
});

console.log('模式: { hostname: ":subdomain.example.com" }');

const subdomainResult = subdomainPattern.exec('https://api.example.com/users');
if (subdomainResult) {
  console.log('URL: https://api.example.com/users');
  console.log('捕获的 subdomain:', subdomainResult.hostname.groups.subdomain);
}

// ============================================================
// 8. 查询字符串和哈希
// ============================================================
console.log('\n【8. 查询字符串和哈希】\n');

const fullPattern = new URLPattern({
  pathname: '/search',
  search: 'q=:query&page=:page',
  hash: ':section'
});

console.log('模式:', JSON.stringify({
  pathname: '/search',
  search: 'q=:query&page=:page',
  hash: ':section'
}));

const fullResult = fullPattern.exec('https://example.com/search?q=hello&page=2#results');
if (fullResult) {
  console.log('\nURL: https://example.com/search?q=hello&page=2#results');
  console.log('search.groups:', fullResult.search.groups);
  console.log('hash.groups:', fullResult.hash.groups);
}

// ============================================================
// 9. 实际应用：路由匹配
// ============================================================
console.log('\n【9. 实际应用：路由匹配】\n');

function matchRoute(url) {
  const routes = [
    { pattern: new URLPattern({ pathname: '/' }), name: 'Home' },
    { pattern: new URLPattern({ pathname: '/users' }), name: 'UserList' },
    { pattern: new URLPattern({ pathname: '/users/:id' }), name: 'UserDetail' },
    { pattern: new URLPattern({ pathname: '/users/:userId/posts/:postId' }), name: 'PostDetail' },
  ];

  for (const route of routes) {
    const result = route.pattern.exec(url);
    if (result) {
      return {
        name: route.name,
        params: result.pathname.groups
      };
    }
  }
  return null;
}

const routeTests = [
  'https://example.com/',
  'https://example.com/users',
  'https://example.com/users/42',
  'https://example.com/users/42/posts/100'
];

console.log('路由匹配结果:');
routeTests.forEach(url => {
  const match = matchRoute(url);
  console.log(`\n  ${url}`);
  console.log('  →', match ? `${match.name} ${JSON.stringify(match.params)}` : '无匹配');
});

console.log('\n' + '='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
