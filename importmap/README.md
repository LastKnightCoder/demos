# Import Maps 使用指南

## 什么是 Import Maps？

Import Maps 是一种浏览器原生支持的功能，允许你控制 JavaScript 模块的导入行为。它可以让你在浏览器中使用裸模块说明符（bare module specifiers），就像在 Node.js 或打包工具中一样。

## 基本语法

Import Maps 通过 `<script type="importmap">` 标签定义：

```HTML
<script type="importmap">
{
    "imports": {
        "模块名": "模块URL"
    }
}
</script>
```

## 核心功能

### 1. 模块映射（imports）

将模块名映射到具体的 URL：

```HTML
<script type="importmap">
{
    "imports": {
        "lodash": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js",
        "vue": "https://unpkg.com/vue@3/dist/vue.esm-browser.js"
    }
}
</script>

<script type="module">
    import _ from 'lodash';
    import { createApp } from 'vue';
</script>
```

### 2. 路径前缀映射

使用尾部斜杠 `/` 映射整个路径前缀：

```HTML
<script type="importmap">
{
    "imports": {
        "lodash/": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/"
    }
}
</script>

<script type="module">
    import debounce from 'lodash/debounce.js';
    import throttle from 'lodash/throttle.js';
</script>
```

### 3. 作用域（scopes）

为不同路径下的模块指定不同的映射规则：

```HTML
<script type="importmap">
{
    "imports": {
        "lodash": "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js"
    },
    "scopes": {
        "/legacy/": {
            "lodash": "https://cdn.jsdelivr.net/npm/lodash-es@3.10.1/lodash.js"
        }
    }
}
</script>
```

## 使用场景

### 1. 无构建工具开发

在不使用 Webpack、Vite 等构建工具的情况下，直接在浏览器中使用 npm 包：

```HTML
<script type="importmap">
{
    "imports": {
        "react": "https://esm.sh/react@18",
        "react-dom": "https://esm.sh/react-dom@18"
    }
}
</script>
```

### 2. 原型开发和快速验证

快速搭建原型，无需配置复杂的构建环境。

### 3. 微前端架构

在微前端场景中共享依赖，避免重复加载：

```HTML
<script type="importmap">
{
    "imports": {
        "shared-utils": "/shared/utils.js",
        "shared-components": "/shared/components.js"
    }
}
</script>
```

### 4. 版本管理和依赖升级

集中管理依赖版本，方便统一升级：

```HTML
<script type="importmap">
{
    "imports": {
        "axios": "https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/esm/axios.min.js"
    }
}
</script>
```

### 5. 开发/生产环境切换

```HTML
<script type="importmap">
{
    "imports": {
        "my-lib": "./src/my-lib.js"
    }
}
</script>
<!-- 生产环境可替换为 -->
<!-- "my-lib": "./dist/my-lib.min.js" -->
```

## 注意事项

### 1. 位置要求

Import Map 必须在任何 `<script type="module">` 之前定义：

```HTML
<!-- ✅ 正确 -->
<script type="importmap">{ "imports": {} }</script>
<script type="module">/* ... */</script>

<!-- ❌ 错误 -->
<script type="module">/* ... */</script>
<script type="importmap">{ "imports": {} }</script>
```

### 2. 唯一性

每个文档只能有一个 Import Map（除非使用外部 Import Map）：

```HTML
<!-- ❌ 错误：多个 importmap -->
<script type="importmap">{ "imports": { "a": "/a.js" } }</script>
<script type="importmap">{ "imports": { "b": "/b.js" } }</script>
```

### 3. 不可动态修改

Import Map 一旦解析就不能修改。如需动态加载，需要在 Import Map 解析前完成：

```HTML
<script>
    const importMap = {
        imports: {
            "dynamic-module": getDynamicModuleUrl()
        }
    };
    const script = document.createElement('script');
    script.type = 'importmap';
    script.textContent = JSON.stringify(importMap);
    document.head.appendChild(script);
</script>
<!-- 之后的 module 脚本才能使用 -->
<script type="module">
    import something from 'dynamic-module';
</script>
```

### 4. JSON 格式要求

Import Map 必须是有效的 JSON：

- 不支持注释
- 不支持尾随逗号
- 键名必须用双引号

```HTML
<!-- ❌ 错误：JSON 格式不正确 -->
<script type="importmap">
{
    "imports": {
        "lodash": "/lodash.js", // 注释不允许
    }
}
</script>
```

### 5. 浏览器兼容性

Import Maps 在现代浏览器中得到广泛支持：

- Chrome 89+
- Edge 89+
- Firefox 108+
- Safari 16.4+

对于旧浏览器，可以使用 polyfill：

```HTML
<script async src="https://ga.jspm.io/npm:es-module-shims@1.8.0/dist/es-module-shims.js"></script>
```

### 6. 外部 Import Map

可以通过 `src` 属性引用外部 Import Map 文件：

```HTML
<script type="importmap" src="importmap.json"></script>
```

注意：外部 Import Map 需要正确的 CORS 配置和 MIME 类型（`application/importmap+json`）。

### 7. 完整性校验

支持使用 `integrity` 属性进行完整性校验：

```HTML
<script type="importmap">
{
    "imports": {
        "lodash": "https://cdn.example.com/lodash.js"
    },
    "integrity": {
        "https://cdn.example.com/lodash.js": "sha384-xxxxx"
    }
}
</script>
```

## 示例文件

本目录包含以下示例文件：

1. ​**01-basic-usage.html** - 基本用法演示
2. ​**02-scopes.html** - 作用域功能演示
3. ​**03-external-importmap.html** - 外部 Import Map 演示
4. ​**04-multiple-versions.html** - 多版本依赖管理
5. ​**05-practical-example.html** - 实际应用示例

## 常用 CDN 服务

以下 CDN 服务提供 ES Module 格式的包：

- ​**esm.sh**: `https://esm.sh/package-name`
- ​**jspm**: `https://ga.jspm.io/npm:package-name@version/`
- ​**unpkg**: `https://unpkg.com/package-name?module`
- ​**jsdelivr**: `https://cdn.jsdelivr.net/npm/package-name/+esm`
- ​**Skypack**: `https://cdn.skypack.dev/package-name`

## 参考资源

- [MDN - Import Maps](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap)
- [WICG Import Maps 规范](https://github.com/WICG/import-maps)
- [Can I Use - Import Maps](https://caniuse.com/import-maps)
