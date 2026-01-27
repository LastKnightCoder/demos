/**
 * URLPattern 模式语法演示
 * 运行方式: node 04-pattern-syntax.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern 模式语法演示');
console.log('='.repeat(60));

const baseURL = 'https://example.com';

function testPattern(title, patternStr, testUrls) {
  console.log(`\n【${title}】`);
  console.log(`模式: ${patternStr}\n`);

  const pattern = new URLPattern(patternStr, baseURL);

  testUrls.forEach(url => {
    const fullUrl = url.startsWith('http') ? url : baseURL + url;
    const result = pattern.exec(fullUrl);
    const matched = result !== null;
    const groups = result ? result.pathname.groups : null;

    console.log(`  ${matched ? '✓' : '✗'} ${url}`);
    if (matched && Object.keys(groups).length > 0) {
      console.log(`    → groups: ${JSON.stringify(groups)}`);
    }
  });
}

// ============================================================
// 1. 命名参数 :name
// ============================================================
testPattern(
  '1. 命名参数 :name',
  '/users/:userId/posts/:postId',
  [
    '/users/123/posts/456',
    '/users/abc/posts/def',
    '/users/123',
    '/users/123/posts',
    '/users/123/posts/456/extra'
  ]
);

// ============================================================
// 2. 通配符 *
// ============================================================
testPattern(
  '2. 通配符 *',
  '/api/*',
  [
    '/api/users',
    '/api/users/123/posts',
    '/api/',
    '/api',
    '/other'
  ]
);

// ============================================================
// 3. 可选参数 :name?
// ============================================================
testPattern(
  '3. 可选参数 :name?',
  '/users/:id?',
  [
    '/users',
    '/users/',
    '/users/123',
    '/users/123/extra'
  ]
);

// ============================================================
// 4. 一个或多个 :name+
// ============================================================
testPattern(
  '4. 一个或多个 :name+',
  '/files/:path+',
  [
    '/files/a',
    '/files/a/b/c',
    '/files/',
    '/files'
  ]
);

// ============================================================
// 5. 零个或多个 :name*
// ============================================================
testPattern(
  '5. 零个或多个 :name*',
  '/docs/:path*',
  [
    '/docs',
    '/docs/',
    '/docs/a',
    '/docs/a/b/c'
  ]
);

// ============================================================
// 6. 正则约束 :name(regexp) - 只匹配数字
// ============================================================
testPattern(
  '6. 正则约束 :name(\\d+) - 只匹配数字',
  '/users/:id(\\d+)',
  [
    '/users/123',
    '/users/456789',
    '/users/abc',
    '/users/12ab',
    '/users/ab12'
  ]
);

// ============================================================
// 7. 正则约束 - 匹配特定格式
// ============================================================
testPattern(
  '7. 正则约束 - 日期格式 (\\d{4}-\\d{2}-\\d{2})',
  '/posts/:date(\\d{4}-\\d{2}-\\d{2})',
  [
    '/posts/2024-01-15',
    '/posts/2024-12-31',
    '/posts/2024-1-5',
    '/posts/24-01-15',
    '/posts/invalid'
  ]
);

// ============================================================
// 8. 分组 {...} - 可选版本前缀
// ============================================================
testPattern(
  '8. 分组 {...} - 可选版本前缀',
  '/api{/v:version}?/users',
  [
    '/api/users',
    '/api/v1/users',
    '/api/v2/users',
    '/api/v10/users',
    '/api/version1/users'
  ]
);

// ============================================================
// 9. 组合使用
// ============================================================
testPattern(
  '9. 组合使用 - 可选扩展名',
  '/files/:name{.:ext}?',
  [
    '/files/document',
    '/files/document.pdf',
    '/files/image.png',
    '/files/archive.tar.gz'
  ]
);

// ============================================================
// 10. 多个可选参数
// ============================================================
testPattern(
  '10. 多个可选参数',
  '/:category?/:subcategory?/:id?',
  [
    '/',
    '/electronics',
    '/electronics/phones',
    '/electronics/phones/123'
  ]
);

// ============================================================
// 11. 固定前缀 + 通配符
// ============================================================
testPattern(
  '11. 固定前缀 + 通配符',
  '/static/:type(js|css|img)/*',
  [
    '/static/js/app.js',
    '/static/css/style.css',
    '/static/img/logo.png',
    '/static/html/index.html',
    '/static/js/vendor/jquery.js'
  ]
);

console.log('\n' + '='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
