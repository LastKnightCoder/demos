# URLPattern API 完整参考

URLPattern 是一个用于匹配 URL 的 Web API，提供声明式的方式来定义和匹配 URL 模式。

## 环境支持

### 浏览器

| 浏览器 | 版本 | 备注 |
|--------|------|------|
| Chrome | 95+ | 完全支持，全局可用 |
| Edge | 95+ | 完全支持，全局可用 |
| Safari | 17+ | 部分支持 |
| Firefox | - | 不支持，需使用 polyfill |

### Node.js

| 版本 | 支持情况 |
|------|----------|
| 18.17.0+ | 需要从 `url` 模块导入 |
| 20.0.0+ | 需要从 `url` 模块导入 |

```javascript
// Node.js 中使用 URLPattern
const { URLPattern } = require('url');

// 或使用 ES Module
import { URLPattern } from 'url';
```

---

## 构造函数

### 语法

```JAVASCRIPT
new URLPattern(input)
new URLPattern(input, baseURL)
new URLPattern(input, options)
new URLPattern(input, baseURL, options)
```

### 参数详解

#### `input` 参数

可以是以下两种类型之一：

​**1. 字符串类型 (string)**

完整的 URL 模式字符串，或相对路径（需配合 baseURL 使用）。

```JAVASCRIPT
// 完整 URL 模式
new URLPattern('https://example.com/users/:id')

// 相对路径（需要 baseURL）
new URLPattern('/users/:id', 'https://example.com')
```

​**2. 对象类型 (URLPatternInit)**

一个包含 URL 各组件模式的对象：

```TYPESCRIPT
interface URLPatternInit {
  protocol?: string;    // 协议模式，如 'https'、'http*'
  username?: string;    // 用户名模式
  password?: string;    // 密码模式
  hostname?: string;    // 主机名模式，如 '*.example.com'
  port?: string;        // 端口模式，如 '80'、'*'
  pathname?: string;    // 路径模式，如 '/users/:id'
  search?: string;      // 查询字符串模式（不含 ?）
  hash?: string;        // 哈希模式（不含 #）
  baseURL?: string;     // 基础 URL，用于解析相对路径
}
```

```JAVASCRIPT
// 使用对象定义模式
new URLPattern({
  protocol: 'https',
  hostname: '*.example.com',
  pathname: '/api/v:version/users/:id',
  search: '*',
  hash: '*'
})
```

#### `baseURL` 参数

| 类型 | 必需 | 说明 |
| --- | --- | --- |
| `string` | 否 | 用于解析相对路径的基础 URL |

当 `input` 是相对路径时必须提供：

```JAVASCRIPT
// ✓ 正确：提供 baseURL
new URLPattern('/users/:id', 'https://example.com')

// ✗ 错误：相对路径缺少 baseURL
new URLPattern('/users/:id')  // TypeError
```

#### `options` 参数

| 类型 | 必需 | 说明 |
| --- | --- | --- |
| `URLPatternOptions` | 否 | 配置选项对象 |

```TYPESCRIPT
interface URLPatternOptions {
  ignoreCase?: boolean;  // 是否忽略大小写，默认 false
}
```

```JAVASCRIPT
// 忽略大小写匹配
new URLPattern('/users/:id', 'https://example.com', { ignoreCase: true })
```

### 返回值

返回一个 `URLPattern` 实例。

### 异常

| 异常类型 | 触发条件 |
| --- | --- |
| `TypeError` | 模式字符串无效或缺少必需的 baseURL |
| `SyntaxError` | 模式语法错误 |

---

## 实例方法

### test(input, baseURL?)

测试给定的 URL 是否匹配该模式。

#### 语法

```JAVASCRIPT
pattern.test(input)
pattern.test(input, baseURL)
```

#### 参数

| 参数 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `input` | `string | URLPatternInit` | 是 | 要测试的 URL 字符串或 URL 组件对象 |
| `baseURL` | `string` | 否 | 用于解析相对 URL 的基础 URL |

#### 返回值

| 类型 | 说明 |
| --- | --- |
| `boolean` | `true` 表示匹配，`false` 表示不匹配 |

#### 示例

```JAVASCRIPT
const pattern = new URLPattern('/users/:id', 'https://example.com');

// 使用字符串测试
pattern.test('https://example.com/users/123');     // true
pattern.test('https://example.com/users/abc');     // true
pattern.test('https://example.com/posts/123');     // false
pattern.test('https://other.com/users/123');       // false

// 使用对象测试
pattern.test({ pathname: '/users/456' }, 'https://example.com');  // true

// 使用相对路径 + baseURL
pattern.test('/users/789', 'https://example.com'); // true
```

---

### exec(input, baseURL?)

执行匹配并返回详细的匹配结果。

#### 语法

```JAVASCRIPT
pattern.exec(input)
pattern.exec(input, baseURL)
```

#### 参数

| 参数 | 类型 | 必需 | 说明 |
| --- | --- | --- | --- |
| `input` | `string | URLPatternInit` | 是 | 要匹配的 URL 字符串或 URL 组件对象 |
| `baseURL` | `string` | 否 | 用于解析相对 URL 的基础 URL |

#### 返回值

| 类型 | 说明 |
| --- | --- |
| `URLPatternResult | null` | 匹配成功返回结果对象，失败返回 `null` |

#### URLPatternResult 结构

```TYPESCRIPT
interface URLPatternResult {
  // 原始输入（数组形式，包含传入的 input 和可选的 baseURL）
  inputs: (string | URLPatternInit)[];

  // 各 URL 组件的匹配结果
  protocol: URLPatternComponentResult;
  username: URLPatternComponentResult;
  password: URLPatternComponentResult;
  hostname: URLPatternComponentResult;
  port: URLPatternComponentResult;
  pathname: URLPatternComponentResult;
  search: URLPatternComponentResult;
  hash: URLPatternComponentResult;
}

interface URLPatternComponentResult {
  input: string;                              // 该组件的原始输入值
  groups: Record<string, string | undefined>; // 捕获的命名组
}
```

#### 完整示例

```JAVASCRIPT
const pattern = new URLPattern(
  '/users/:userId/posts/:postId',
  'https://example.com'
);

const result = pattern.exec('https://example.com/users/123/posts/456');

// result 完整结构：
{
  inputs: ['https://example.com/users/123/posts/456'],

  protocol: {
    input: 'https',
    groups: {}
  },

  username: {
    input: '',
    groups: {}
  },

  password: {
    input: '',
    groups: {}
  },

  hostname: {
    input: 'example.com',
    groups: {}
  },

  port: {
    input: '',
    groups: {}
  },

  pathname: {
    input: '/users/123/posts/456',
    groups: {
      userId: '123',    // ← 捕获的参数
      postId: '456'     // ← 捕获的参数
    }
  },

  search: {
    input: '',
    groups: {}
  },

  hash: {
    input: '',
    groups: {}
  }
}

// 提取参数的常用方式
if (result) {
  const { userId, postId } = result.pathname.groups;
  console.log(userId); // '123'
  console.log(postId); // '456'
}
```

---

## 实例属性（只读）

所有属性都是只读的字符串，表示该组件的模式。

| 属性 | 类型 | 说明 | 示例值 |
| --- | --- | --- | --- |
| `protocol` | `string` | 协议模式 | `'https'`、`'http*'` |
| `username` | `string` | 用户名模式 | `'*'` |
| `password` | `string` | 密码模式 | `'*'` |
| `hostname` | `string` | 主机名模式 | `'example.com'`、`'*.example.com'` |
| `port` | `string` | 端口模式 | `''`、`'8080'`、`'*'` |
| `pathname` | `string` | 路径模式 | `'/users/:id'` |
| `search` | `string` | 查询字符串模式 | `'*'`、`'q=:query'` |
| `hash` | `string` | 哈希模式 | `'*'`、`':section'` |
| `hasRegExpGroups` | `boolean` | 是否包含正则表达式组 | `true`、`false` |

```JAVASCRIPT
const pattern = new URLPattern('/users/:id', 'https://example.com');

console.log(pattern.protocol);  // 'https'
console.log(pattern.hostname);  // 'example.com'
console.log(pattern.pathname);  // '/users/:id'
console.log(pattern.port);      // ''
console.log(pattern.search);    // '*'
console.log(pattern.hash);      // '*'
```

---

## 模式语法详解

URLPattern 使用类似于 path-to-regexp 的语法。

### 语法速查表

| 语法 | 名称 | 说明 | 匹配示例 |
| --- | --- | --- | --- |
| `:name` | 命名参数 | 匹配单个路径段（不含 `/`） | `/users/:id` → `/users/123` |
| `*` | 通配符 | 匹配任意字符（含 `/`） | `/api/*` → `/api/a/b/c` |
| `:name?` | 可选参数 | 参数可存在可不存在 | `/users/:id?` → `/users` 或 `/users/123` |
| `:name+` | 一个或多个 | 匹配一个或多个路径段 | `/files/:path+` → `/files/a/b` |
| `:name*` | 零个或多个 | 匹配零个或多个路径段 | `/files/:path*` → `/files` 或 `/files/a/b` |
| `:name(regexp)` | 正则约束 | 使用正则限制匹配内容 | `/users/:id(\\d+)` → 只匹配数字 |
| `(regexp)` | 匿名正则组 | 不命名的正则捕获组 | `/(\\d+).jpg` |
| `{...}` | 分组 | 将多个部分组合（不捕获） | `/api{/v:version}?/users` |
| `\\x` | 转义 | 转义特殊字符 | `/path\\*` → 匹配字面量 `*` |

### 1. 命名参数 `:name`

捕获单个路径段（不包含 `/`）。

```JAVASCRIPT
const pattern = new URLPattern('/users/:userId/posts/:postId', baseURL);

// ✓ 匹配
pattern.exec('.../users/123/posts/456');
// pathname.groups = { userId: '123', postId: '456' }

// ✗ 不匹配（缺少段）
pattern.test('.../users/123');           // false
pattern.test('.../users/123/posts');     // false
```

### 2. 通配符 `*`

匹配任意字符（包括 `/`），结果存储在 `groups[0]`。

```JAVASCRIPT
const pattern = new URLPattern('/api/*', baseURL);

pattern.exec('.../api/users/123/posts');
// pathname.groups = { '0': 'users/123/posts' }

pattern.test('.../api/');        // true（匹配空字符串）
pattern.test('.../api/anything'); // true
```

### 3. 可选参数 `:name?`

参数可以存在也可以不存在。

```JAVASCRIPT
const pattern = new URLPattern('/users/:id?', baseURL);

pattern.test('.../users');       // true, groups.id = undefined
pattern.test('.../users/');      // true, groups.id = undefined
pattern.test('.../users/123');   // true, groups.id = '123'
pattern.test('.../users/123/x'); // false（多余的段）
```

### 4. 重复参数 `:name+` 和 `:name*`

```JAVASCRIPT
// :path+ 匹配一个或多个段
const patternPlus = new URLPattern('/files/:path+', baseURL);
patternPlus.test('.../files/a');       // true, path = 'a'
patternPlus.test('.../files/a/b/c');   // true, path = 'a/b/c'
patternPlus.test('.../files');         // false（至少需要一个）

// :path* 匹配零个或多个段
const patternStar = new URLPattern('/docs/:path*', baseURL);
patternStar.test('.../docs');          // true, path = undefined
patternStar.test('.../docs/a/b');      // true, path = 'a/b'
```

### 5. 正则约束 `:name(regexp)`

使用正则表达式限制匹配内容。

```JAVASCRIPT
// 只匹配数字 ID
const pattern = new URLPattern('/users/:id(\\d+)', baseURL);

pattern.test('.../users/123');    // true
pattern.test('.../users/456789'); // true
pattern.test('.../users/abc');    // false
pattern.test('.../users/12ab');   // false

// 匹配特定格式
const datePattern = new URLPattern('/posts/:date(\\d{4}-\\d{2}-\\d{2})', baseURL);
datePattern.test('.../posts/2024-01-15'); // true
datePattern.test('.../posts/2024-1-5');   // false
```

### 6. 分组 `{...}`

将多个部分组合在一起，常与 `?` 配合实现可选路径段。

```JAVASCRIPT
// 可选的版本前缀
const pattern = new URLPattern('/api{/v:version}?/users', baseURL);

pattern.test('.../api/users');      // true, version = undefined
pattern.test('.../api/v1/users');   // true, version = '1'
pattern.test('.../api/v2/users');   // true, version = '2'
```

### 7. 主机名模式

```JAVASCRIPT
// 匹配子域名
const pattern = new URLPattern({
  hostname: ':subdomain.example.com',
  pathname: '/*'
});

pattern.exec('https://api.example.com/users');
// hostname.groups = { subdomain: 'api' }

// 匹配任意子域名
const wildcardPattern = new URLPattern({
  hostname: '*.example.com'
});
```

---

## 示例文件

### HTML 交互示例（浏览器运行）

| 文件 | 说明 |
|------|------|
| [01-basic-usage.html](./01-basic-usage.html) | 基本用法：创建模式、test()、exec() |
| [02-pattern-syntax.html](./02-pattern-syntax.html) | 模式语法详解与交互测试 |
| [03-exec-result.html](./03-exec-result.html) | exec() 返回值结构详解 |
| [04-routing-example.html](./04-routing-example.html) | 路由器实战示例 |
| [05-service-worker.html](./05-service-worker.html) | Service Worker 中的应用 |

### JavaScript 示例（Node.js 运行）

需要 Node.js 18.17.0+ 版本。运行方式：`node <文件名>`

| 文件 | 说明 |
|------|------|
| [01-constructor.js](./01-constructor.js) | 构造函数的各种用法、参数详解 |
| [02-test-method.js](./02-test-method.js) | test() 方法的各种使用场景 |
| [03-exec-method.js](./03-exec-method.js) | exec() 方法和返回值结构 |
| [04-pattern-syntax.js](./04-pattern-syntax.js) | 所有模式语法的详细演示 |
| [05-practical-examples.js](./05-practical-examples.js) | 实际应用：路由器、API 版本、请求过滤 |
| [06-url-components.js](./06-url-components.js) | URL 各组件（协议、主机名、端口、查询、哈希）模式 |

---

## 常见用例

### 前端路由

```JAVASCRIPT
const routes = [
  { pattern: new URLPattern({ pathname: '/' }), component: 'Home' },
  { pattern: new URLPattern({ pathname: '/users' }), component: 'UserList' },
  { pattern: new URLPattern({ pathname: '/users/:id' }), component: 'UserDetail' },
];

function matchRoute(url) {
  for (const route of routes) {
    const match = route.pattern.exec(url);
    if (match) {
      return { component: route.component, params: match.pathname.groups };
    }
  }
  return null;
}
```

### Service Worker 请求拦截

```JAVASCRIPT
const apiPattern = new URLPattern({ pathname: '/api/*' });

self.addEventListener('fetch', (event) => {
  if (apiPattern.test(event.request.url)) {
    event.respondWith(handleApiRequest(event.request));
  }
});
```

### URL 参数提取

```JAVASCRIPT
const pattern = new URLPattern(
  'https://:subdomain.example.com/api/v:version/:resource/:id',
  { ignoreCase: true }
);

const result = pattern.exec('https://api.example.com/api/v2/users/123');
if (result) {
  const { subdomain } = result.hostname.groups;  // 'api'
  const { version, resource, id } = result.pathname.groups;
  // version = '2', resource = 'users', id = '123'
}
```
