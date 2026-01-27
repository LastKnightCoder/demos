/**
 * URLPattern 实际应用示例
 * 运行方式: node 05-practical-examples.js
 */

// Node.js 中需要从 url 模块导入 URLPattern
const { URLPattern } = require('url');

console.log('='.repeat(60));
console.log('URLPattern 实际应用示例');
console.log('='.repeat(60));

// ============================================================
// 1. 前端路由器实现
// ============================================================
console.log('\n【1. 前端路由器实现】\n');

class Router {
  constructor(baseURL = '') {
    this.baseURL = baseURL;
    this.routes = [];
  }

  add(pattern, handler) {
    // 根据 pattern 类型决定如何创建 URLPattern
    let urlPattern;
    if (typeof pattern === 'string') {
      urlPattern = this.baseURL
        ? new URLPattern(pattern, this.baseURL)
        : new URLPattern(pattern);
    } else {
      // 对象形式直接传入
      urlPattern = new URLPattern(pattern);
    }

    this.routes.push({
      pattern: urlPattern,
      handler,
      patternStr: typeof pattern === 'string' ? pattern : JSON.stringify(pattern)
    });
    return this;
  }

  match(url) {
    for (const route of this.routes) {
      const result = route.pattern.exec(url);
      if (result) {
        return {
          handler: route.handler,
          params: result.pathname.groups,
          pattern: route.patternStr
        };
      }
    }
    return null;
  }

  handle(url) {
    const match = this.match(url);
    if (match) {
      return match.handler(match.params);
    }
    return '404 Not Found';
  }
}

const router = new Router('https://example.com');

router
  .add('/', () => '首页')
  .add('/users', () => '用户列表')
  .add('/users/:id', (params) => `用户详情: ID=${params.id}`)
  .add('/users/:userId/posts', (params) => `用户 ${params.userId} 的文章列表`)
  .add('/users/:userId/posts/:postId', (params) =>
    `文章详情: 用户=${params.userId}, 文章=${params.postId}`)
  .add('/products/:category/:id(\\d+)', (params) =>
    `产品: 分类=${params.category}, ID=${params.id}`)
  .add('/*', () => '404 页面未找到');

const routerTests = [
  'https://example.com/',
  'https://example.com/users',
  'https://example.com/users/42',
  'https://example.com/users/42/posts',
  'https://example.com/users/42/posts/100',
  'https://example.com/products/electronics/12345',
  'https://example.com/unknown/path'
];

console.log('路由测试:');
routerTests.forEach(url => {
  const result = router.handle(url);
  console.log(`  ${url.replace('https://example.com', '')}`);
  console.log(`    → ${result}\n`);
});

// ============================================================
// 2. API 版本路由
// ============================================================
console.log('【2. API 版本路由】\n');

const apiRouter = new Router();

apiRouter
  .add({ pathname: '/api/v:version/users' }, (params) => ({
    version: params.version,
    resource: 'users',
    action: 'list'
  }))
  .add({ pathname: '/api/v:version/users/:id' }, (params) => ({
    version: params.version,
    resource: 'users',
    action: 'get',
    id: params.id
  }))
  .add({ pathname: '/api/v:version/users/:userId/posts/:postId' }, (params) => ({
    version: params.version,
    resource: 'posts',
    userId: params.userId,
    postId: params.postId
  }));

const apiTests = [
  'https://api.example.com/api/v1/users',
  'https://api.example.com/api/v2/users/123',
  'https://api.example.com/api/v3/users/456/posts/789'
];

console.log('API 路由测试:');
apiTests.forEach(url => {
  const match = apiRouter.match(url);
  if (match) {
    console.log(`  ${url}`);
    console.log(`    → ${JSON.stringify(match.handler(match.params))}\n`);
  }
});

// ============================================================
// 3. URL 参数解析器
// ============================================================
console.log('【3. URL 参数解析器】\n');

function parseUrl(url) {
  const pattern = new URLPattern(
    'https://:subdomain.example.com/api/v:version/:resource/:id'
  );

  const result = pattern.exec(url);
  if (!result) return null;

  return {
    subdomain: result.hostname.groups.subdomain,
    version: result.pathname.groups.version,
    resource: result.pathname.groups.resource,
    id: result.pathname.groups.id
  };
}

const parseTests = [
  'https://api.example.com/api/v2/users/123',
  'https://admin.example.com/api/v1/products/456'
];

console.log('URL 解析测试:');
parseTests.forEach(url => {
  const parsed = parseUrl(url);
  console.log(`  ${url}`);
  console.log(`    → ${JSON.stringify(parsed)}\n`);
});

// ============================================================
// 4. 请求过滤器
// ============================================================
console.log('【4. 请求过滤器】\n');

const filters = [
  {
    name: 'API 请求',
    pattern: new URLPattern({ pathname: '/api/*' }),
    action: 'forward to API server'
  },
  {
    name: '静态资源',
    pattern: new URLPattern({ pathname: '/static/*' }),
    action: 'serve from CDN'
  },
  {
    name: '图片资源',
    pattern: new URLPattern({ pathname: '*.{png,jpg,gif,webp}' }),
    action: 'apply image optimization'
  },
  {
    name: '管理后台',
    pattern: new URLPattern({ pathname: '/admin/*' }),
    action: 'require authentication'
  }
];

function filterRequest(url) {
  for (const filter of filters) {
    if (filter.pattern.test(url)) {
      return { name: filter.name, action: filter.action };
    }
  }
  return { name: 'Default', action: 'normal processing' };
}

const filterTests = [
  'https://example.com/api/users',
  'https://example.com/static/js/app.js',
  'https://example.com/images/logo.png',
  'https://example.com/admin/dashboard',
  'https://example.com/about'
];

console.log('请求过滤测试:');
filterTests.forEach(url => {
  const result = filterRequest(url);
  console.log(`  ${url.replace('https://example.com', '')}`);
  console.log(`    → [${result.name}] ${result.action}\n`);
});

// ============================================================
// 5. 多域名路由
// ============================================================
console.log('【5. 多域名路由】\n');

const domainRoutes = [
  {
    pattern: new URLPattern({ hostname: 'api.example.com', pathname: '/*' }),
    handler: 'API Server'
  },
  {
    pattern: new URLPattern({ hostname: 'admin.example.com', pathname: '/*' }),
    handler: 'Admin Panel'
  },
  {
    pattern: new URLPattern({ hostname: 'cdn.example.com', pathname: '/*' }),
    handler: 'CDN Server'
  },
  {
    pattern: new URLPattern({ hostname: '*.example.com', pathname: '/*' }),
    handler: 'Wildcard Subdomain Handler'
  }
];

function routeByDomain(url) {
  for (const route of domainRoutes) {
    if (route.pattern.test(url)) {
      return route.handler;
    }
  }
  return 'Default Handler';
}

const domainTests = [
  'https://api.example.com/users',
  'https://admin.example.com/dashboard',
  'https://cdn.example.com/assets/logo.png',
  'https://blog.example.com/posts',
  'https://other.com/page'
];

console.log('域名路由测试:');
domainTests.forEach(url => {
  const handler = routeByDomain(url);
  console.log(`  ${url}`);
  console.log(`    → ${handler}\n`);
});

console.log('='.repeat(60));
console.log('演示结束');
console.log('='.repeat(60));
