/**
 * URLPattern 主机名和其他组件模式演示
 * 运行方式: node 06-url-components.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern URL 组件模式演示');
console.log('='.repeat(60));

// ============================================================
// 1. 协议模式
// ============================================================
console.log('\n【1. 协议模式】\n');

const httpsOnly = new URLPattern({ protocol: 'https' });
const httpOrHttps = new URLPattern({ protocol: 'http{s}?' });

console.log('模式 1: { protocol: "https" }');
console.log('  https://example.com:', httpsOnly.test('https://example.com'));
console.log('  http://example.com:', httpsOnly.test('http://example.com'));

console.log('\n模式 2: { protocol: "http{s}?" }');
console.log('  https://example.com:', httpOrHttps.test('https://example.com'));
console.log('  http://example.com:', httpOrHttps.test('http://example.com'));

// ============================================================
// 2. 主机名模式
// ============================================================
console.log('\n【2. 主机名模式】\n');

// 精确匹配
const exactHost = new URLPattern({ hostname: 'example.com' });
console.log('精确匹配: { hostname: "example.com" }');
console.log('  example.com:', exactHost.test('https://example.com'));
console.log('  www.example.com:', exactHost.test('https://www.example.com'));

// 通配符子域名
const wildcardSubdomain = new URLPattern({ hostname: '*.example.com' });
console.log('\n通配符: { hostname: "*.example.com" }');
console.log('  api.example.com:', wildcardSubdomain.test('https://api.example.com'));
console.log('  www.example.com:', wildcardSubdomain.test('https://www.example.com'));
console.log('  example.com:', wildcardSubdomain.test('https://example.com'));

// 命名子域名捕获
const namedSubdomain = new URLPattern({ hostname: ':subdomain.example.com' });
console.log('\n命名捕获: { hostname: ":subdomain.example.com" }');
const subResult = namedSubdomain.exec('https://api.example.com/path');
if (subResult) {
  console.log('  api.example.com → subdomain:', subResult.hostname.groups.subdomain);
}

// 多级子域名
const multiLevel = new URLPattern({ hostname: ':sub1.:sub2.example.com' });
console.log('\n多级子域名: { hostname: ":sub1.:sub2.example.com" }');
const multiResult = multiLevel.exec('https://us.api.example.com/path');
if (multiResult) {
  console.log('  us.api.example.com →', multiResult.hostname.groups);
}

// ============================================================
// 3. 端口模式
// ============================================================
console.log('\n【3. 端口模式】\n');

const port8080 = new URLPattern({ port: '8080' });
const anyPort = new URLPattern({ port: '*' });
const portRange = new URLPattern({ port: ':port(80|443|8080)' });

console.log('固定端口: { port: "8080" }');
console.log('  :8080:', port8080.test('https://example.com:8080'));
console.log('  :3000:', port8080.test('https://example.com:3000'));

console.log('\n任意端口: { port: "*" }');
console.log('  :8080:', anyPort.test('https://example.com:8080'));
console.log('  :3000:', anyPort.test('https://example.com:3000'));
console.log('  (默认):', anyPort.test('https://example.com'));

console.log('\n端口范围: { port: ":port(80|443|8080)" }');
console.log('  :80:', portRange.test('https://example.com:80'));
console.log('  :443:', portRange.test('https://example.com:443'));
console.log('  :8080:', portRange.test('https://example.com:8080'));
console.log('  :3000:', portRange.test('https://example.com:3000'));

// ============================================================
// 4. 查询字符串模式
// ============================================================
console.log('\n【4. 查询字符串模式】\n');

// 任意查询字符串
const anySearch = new URLPattern({ pathname: '/search', search: '*' });
console.log('任意查询: { search: "*" }');
console.log('  /search?q=hello:', anySearch.test('https://example.com/search?q=hello'));
console.log('  /search:', anySearch.test('https://example.com/search'));

// 命名查询参数
const namedSearch = new URLPattern({ pathname: '/search', search: 'q=:query' });
console.log('\n命名参数: { search: "q=:query" }');
const searchResult = namedSearch.exec('https://example.com/search?q=hello');
if (searchResult) {
  console.log('  ?q=hello → query:', searchResult.search.groups.query);
}

// 多个查询参数
const multiSearch = new URLPattern({ pathname: '/search', search: 'q=:query&page=:page' });
console.log('\n多个参数: { search: "q=:query&page=:page" }');
const multiSearchResult = multiSearch.exec('https://example.com/search?q=hello&page=2');
if (multiSearchResult) {
  console.log('  ?q=hello&page=2 →', multiSearchResult.search.groups);
}

// ============================================================
// 5. 哈希模式
// ============================================================
console.log('\n【5. 哈希模式】\n');

const namedHash = new URLPattern({ pathname: '/docs', hash: ':section' });
console.log('命名哈希: { hash: ":section" }');
const hashResult = namedHash.exec('https://example.com/docs#introduction');
if (hashResult) {
  console.log('  #introduction → section:', hashResult.hash.groups.section);
}

// 带路径的哈希
const pathHash = new URLPattern({ pathname: '/docs', hash: ':category/:item' });
console.log('\n路径哈希: { hash: ":category/:item" }');
const pathHashResult = pathHash.exec('https://example.com/docs#api/methods');
if (pathHashResult) {
  console.log('  #api/methods →', pathHashResult.hash.groups);
}

// ============================================================
// 6. 组合所有组件
// ============================================================
console.log('\n【6. 组合所有组件】\n');

const fullPattern = new URLPattern({
  protocol: 'https',
  hostname: ':subdomain.example.com',
  port: '',
  pathname: '/api/v:version/:resource/:id',
  search: 'format=:format',
  hash: ':section'
});

console.log('完整模式:');
console.log(JSON.stringify({
  protocol: 'https',
  hostname: ':subdomain.example.com',
  pathname: '/api/v:version/:resource/:id',
  search: 'format=:format',
  hash: ':section'
}, null, 2));

const fullUrl = 'https://api.example.com/api/v2/users/123?format=json#details';
const fullResult = fullPattern.exec(fullUrl);

if (fullResult) {
  console.log(`\n测试 URL: ${fullUrl}`);
  console.log('\n提取的所有参数:');
  console.log('  hostname.groups:', fullResult.hostname.groups);
  console.log('  pathname.groups:', fullResult.pathname.groups);
  console.log('  search.groups:', fullResult.search.groups);
  console.log('  hash.groups:', fullResult.hash.groups);
}

console.log('\n' + '='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
