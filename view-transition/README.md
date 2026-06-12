# View Transition API 完全指南

## 目录

- [概述](#概述)
- [浏览器支持](#浏览器支持)
- [核心概念](#核心概念)
- [同文档视图过渡 (SPA)](#同文档视图过渡-spa)
- [跨文档视图过渡 (MPA)](#跨文档视图过渡-mpa)
- [view-transition-name](#view-transition-name)
- [视图过渡的伪元素树](#视图过渡的伪元素树)
- [自定义过渡动画](#自定义过渡动画)
- [过渡类型 (Transition Types)](#过渡类型-transition-types)
- [view-transition-class](#view-transition-class)
- [常见应用场景](#常见应用场景)
- [性能与最佳实践](#性能与最佳实践)
- [注意事项与陷阱](#注意事项与陷阱)
- [演示文件说明](#演示文件说明)
- [参考资源](#参考资源)

---

## 概述

View Transition API 是一种浏览器原生的过渡动画机制，用于在 DOM 状态变化时创建平滑的视觉过渡效果。它解决了长期以来 Web 开发中页面/视图切换时的"闪烁"问题，让原本需要复杂 JavaScript 动画库才能实现的过渡效果变得简单。

### 核心价值

1. ​**简化动画逻辑**：不再需要手动管理旧元素的退出动画和新元素的进入动画
2. ​**性能优越**：浏览器在合成层（compositor layer）上执行过渡，不触发布局重排
3. ​**渐进增强**：不支持的浏览器会直接跳过过渡，不影响功能
4. ​**声明式 API**：大部分工作通过 CSS 完成，JavaScript 只负责触发

### 两种模式

| 模式 | 适用场景 | 触发方式 |
| --- | --- | --- |
| 同文档过渡 (Same-document) | SPA、选项卡切换、列表排序 | `document.startViewTransition()` |
| 跨文档过渡 (Cross-document) | 传统多页面网站 (MPA) | `@view-transition` CSS 规则 + 导航 |

---

## 浏览器支持

| 特性 | Chrome | Edge | Safari | Firefox |
| --- | --- | --- | --- | --- |
| 同文档过渡 | 111+ | 111+ | 18+ | 不支持 |
| 跨文档过渡 | 126+ | 126+ | 18.2+ | 不支持 |
| view-transition-class | 125+ | 125+ | 18.2+ | 不支持 |
| 过渡类型 (types) | 125+ | 125+ | 18+ | 不支持 |

> ​**注意**：截至 2025 年，Firefox 尚未实现 View Transition API。建议使用特性检测进行渐进增强。

---

## 核心概念

### 工作原理

View Transition API 的工作流程：

```
1. 调用 startViewTransition(callback)
2. 浏览器捕获当前页面状态的"旧快照"（截图）
3. 执行 callback（DOM 更新）
4. 浏览器捕获更新后的"新快照"
5. 构建伪元素树，在旧快照和新快照之间执行动画
6. 动画完成后，移除伪元素，显示真实 DOM
```

关键理解：​**过渡期间用户看到的不是真实 DOM，而是伪元素上的截图**。这就是为什么过渡能如此流畅——它完全在合成层上运行。

### ViewTransition 对象

`document.startViewTransition()` 返回一个 `ViewTransition` 对象：

```JavaScript
const transition = document.startViewTransition(() => {
  // 更新 DOM
});

// 生命周期 Promise
transition.ready      // 伪元素树创建完成，即将开始动画
transition.finished   // 整个过渡完成
transition.updateCallbackDone  // callback 执行完毕

// 跳过过渡
transition.skipTransition();
```

#### 生命周期时序

```
startViewTransition(callback)
        │
        ▼
  捕获旧状态快照
        │
        ▼
  执行 callback ──────► updateCallbackDone resolved
        │
        ▼
  捕获新状态快照
        │
        ▼
  构建伪元素树 ────────► ready resolved
        │
        ▼
  执行过渡动画
        │
        ▼
  移除伪元素 ──────────► finished resolved
```

---

## 同文档视图过渡 (SPA)

### 基本用法

```JavaScript
document.startViewTransition(() => {
  // 同步或异步 DOM 更新
  updateDOM();
});
```

如果 callback 返回 Promise（异步操作），浏览器会等待 Promise resolve 后才捕获新快照：

```JavaScript
document.startViewTransition(async () => {
  const data = await fetchData();
  renderNewContent(data);
});
```

### 特性检测

```JavaScript
if (!document.startViewTransition) {
  // 降级：直接更新 DOM
  updateDOM();
} else {
  document.startViewTransition(() => updateDOM());
}
```

### 默认过渡效果

不添加任何 CSS 时，默认的过渡是整个页面的交叉淡入淡出（cross-fade）。整个 `<html>` 根元素作为过渡单元。

---

## 跨文档视图过渡 (MPA)

### 启用方式

在​**两个页面**（导航起始页和目标页）都需要添加：

```CSS
@view-transition {
  navigation: auto;
}
```

这表示浏览器在同源导航时自动触发视图过渡。

### 限制条件

- 必须是​**同源**导航（same-origin）
- 两个页面都必须声明 `@view-transition`
- 导航类型必须是 `traverse`（前进/后退）或 `push`/`replace`（非 reload）
- 页面不能有 `Sec-Fetch-Site` 为 `cross-origin` 的响应头阻止

### 自定义跨文档过渡

使用 `pageswap` 和 `pagereveal` 事件来定制行为：

```JavaScript
// 在离开页面时触发
window.addEventListener('pageswap', (event) => {
  // event.viewTransition 是 ViewTransition 对象
  // 可以在这里根据目标 URL 设置 view-transition-name
  if (event.viewTransition) {
    const targetUrl = new URL(event.activation?.entry?.url);
    // 根据目标设置过渡名称...
  }
});

// 在新页面显示时触发
window.addEventListener('pagereveal', (event) => {
  if (event.viewTransition) {
    // 根据来源设置过渡名称...
  }
});
```

---

## view-transition-name

这是 View Transition 最强大的特性——让浏览器识别"旧页面中的元素 A"和"新页面中的元素 B"是同一个东西，从而创建元素级别的过渡动画。

### 基本语法

```CSS
.card-thumbnail {
  view-transition-name: hero-image;
}
```

### 规则

1. ​**唯一性**：同一时刻，一个 `view-transition-name` 值只能出现在一个元素上。重复会导致过渡失败。
2. ​**命名规范**：值为 CSS 自定义标识符（custom-ident），不能是 `none`，不能以数字开头。
3. ​**动态赋值**：可以通过 JavaScript 动态设置 `style.viewTransitionName`，在过渡前设置、过渡后移除。

### 动态命名模式

```JavaScript
// 过渡前：给被点击的卡片赋予名称
clickedCard.style.viewTransitionName = 'active-card';

document.startViewTransition(() => {
  // 更新内容
  showDetail();
  // 给详情页的主图赋予相同的名称
  detailImage.style.viewTransitionName = 'active-card';
});
```

### 使用 CSS 自定义属性配合

```CSS
.card {
  view-transition-name: var(--vt-name, none);
}
```

```JavaScript
card.style.setProperty('--vt-name', 'card-expand');
```

---

## 视图过渡的伪元素树

过渡期间，浏览器会创建以下伪元素结构：

```
::view-transition                          ← 覆盖层（overlay），覆盖所有内容
├── ::view-transition-group(root)          ← 每个命名元素的容器
│   └── ::view-transition-image-pair(root) ← 包含新旧截图
│       ├── ::view-transition-old(root)    ← 旧状态的截图
│       └── ::view-transition-new(root)    ← 新状态的截图
├── ::view-transition-group(hero-image)
│   └── ::view-transition-image-pair(hero-image)
│       ├── ::view-transition-old(hero-image)
│       └── ::view-transition-new(hero-image)
└── ...
```

### 各伪元素的作用

| 伪元素 | 作用 | 默认动画 |
| --- | --- | --- |
| `::view-transition` | 过渡期间的根覆盖层 | 无 |
| `::view-transition-group(*)` | 容器，尺寸和位置会插值 | `width`/`height`/`transform` 动画 |
| `::view-transition-image-pair(*)` | 包裹新旧图像 | `isolation: auto` |
| `::view-transition-old(*)` | 旧状态截图 | `opacity: 1 → 0`（淡出） |
| `::view-transition-new(*)` | 新状态截图 | `opacity: 0 → 1`（淡入） |

### 使用通配符选择器

```CSS
/* 选择所有过渡组 */
::view-transition-group(*) {
  animation-duration: 0.4s;
}

/* 选择特定命名的过渡 */
::view-transition-old(hero-image) {
  animation: scale-down 0.3s ease-out;
}
```

---

## 自定义过渡动画

### 修改默认动画

```CSS
/* 改变过渡时长和缓动 */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.5s;
  animation-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

### 完全自定义动画

```CSS
@keyframes slide-out-left {
  from { transform: translateX(0); }
  to   { transform: translateX(-100%); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
  to   { transform: translateX(0); }
}

::view-transition-old(root) {
  animation: slide-out-left 0.3s ease-in forwards;
}

::view-transition-new(root) {
  animation: slide-in-right 0.3s ease-out forwards;
}
```

### 非对称过渡（不同方向不同动画）

```CSS
/* 前进导航 */
.forward::view-transition-old(root) {
  animation: slide-out-left 0.3s ease-in;
}
.forward::view-transition-new(root) {
  animation: slide-in-right 0.3s ease-out;
}

/* 后退导航 */
.backward::view-transition-old(root) {
  animation: slide-out-right 0.3s ease-in;
}
.backward::view-transition-new(root) {
  animation: slide-in-left 0.3s ease-out;
}
```

### 利用 ready Promise 实现程序化动画

```JavaScript
const transition = document.startViewTransition(() => updateDOM());

transition.ready.then(() => {
  // 使用 Web Animations API
  document.documentElement.animate(
    { clipPath: ['circle(0% at 50% 50%)', 'circle(150% at 50% 50%)'] },
    {
      duration: 500,
      easing: 'ease-out',
      pseudoElement: '::view-transition-new(root)',
    }
  );
});
```

---

## 过渡类型 (Transition Types)

过渡类型允许你在同一页面中根据不同操作选择不同的过渡动画。

### 同文档过渡中使用

```JavaScript
document.startViewTransition({
  update: () => updateDOM(),
  types: ['slide-forward'],
});
```

### 跨文档过渡中使用

```CSS
@view-transition {
  navigation: auto;
  types: slide-forward, hero-expand;
}
```

也可以在事件中动态设置：

```JavaScript
window.addEventListener('pageswap', (event) => {
  if (event.viewTransition) {
    event.viewTransition.types.add('slide-forward');
  }
});
```

### 在 CSS 中根据类型应用不同动画

```CSS
/* 使用 :active-view-transition-type() 伪类 */
html:active-view-transition-type(slide-forward) {
  &::view-transition-old(root) {
    animation: slide-out-left 0.3s ease;
  }
  &::view-transition-new(root) {
    animation: slide-in-right 0.3s ease;
  }
}

html:active-view-transition-type(slide-backward) {
  &::view-transition-old(root) {
    animation: slide-out-right 0.3s ease;
  }
  &::view-transition-new(root) {
    animation: slide-in-left 0.3s ease;
  }
}
```

---

## view-transition-class

当多个元素需要相同的过渡动画但各自有不同的 `view-transition-name` 时，`view-transition-class` 可以避免重复编写 CSS 规则。

### 问题场景

```CSS
/* 如果有 50 张卡片，每张都有唯一的 view-transition-name... */
.card-1 { view-transition-name: card-1; }
.card-2 { view-transition-name: card-2; }
/* ...你不想为每个都写动画规则 */
```

### 解决方案

```CSS
.card {
  view-transition-class: card-item;
}
.card:nth-child(1) { view-transition-name: card-1; }
.card:nth-child(2) { view-transition-name: card-2; }

/* 一条规则覆盖所有 card */
::view-transition-group(*.card-item) {
  animation-duration: 0.35s;
  animation-timing-function: ease-out;
}
```

`*.card-item` 语法中的 `*` 表示匹配任何名称，`.card-item` 表示该名称的元素必须具有 `view-transition-class: card-item`。

---

## 常见应用场景

### 1. 列表排序/过滤动画

给列表中每个元素设置唯一的 `view-transition-name`，重排序时元素会自动滑动到新位置。

### 2. 卡片展开为详情页

点击卡片时，卡片中的缩略图和标题"飞"到详情页的对应位置。

### 3. 主题切换（明暗模式）

使用 `clipPath` 圆形扩展动画实现丝滑的主题切换效果。

### 4. 选项卡/轮播切换

根据切换方向（左/右）使用不同的滑动动画。

### 5. 图片画廊

缩略图点击后展开为全屏预览，利用 `view-transition-name` 实现无缝过渡。

### 6. 导航栏状态变化

高亮指示器跟随激活项移动。

### 7. 数据仪表盘更新

数字变化时添加过渡效果而非直接替换。

---

## 性能与最佳实践

### 性能优势

- 过渡动画运行在​**合成层**上，不会导致布局重排
- 浏览器只截取了标记了 `view-transition-name` 的元素
- 过渡期间真实 DOM 已更新完毕，用户可以立即交互（如果需要）

### 最佳实践

1. ​**限制命名元素数量**：每个 `view-transition-name` 都会创建额外的合成层。避免给数百个元素都设置名称。
2. ​**使用 **​**`content-visibility: auto`**：对于长列表，配合 `content-visibility` 可以减少需要截图的区域。
3. ​**设置合理时长**：过渡时长建议 200-500ms。太短看不清，太长用户会觉得慢。
4. ​**提供降级方案**：
  
  ```JavaScript
  function navigate(url) {
    if (!document.startViewTransition) {
      location.href = url;
      return;
    }
    document.startViewTransition(() => loadPage(url));
  }
  ```
5. ​**使用 **​**`prefers-reduced-motion`**：
  
  ```CSS
  @media (prefers-reduced-motion: reduce) {
    ::view-transition-group(*),
    ::view-transition-old(*),
    ::view-transition-new(*) {
      animation-duration: 0.01ms !important;
    }
  }
  ```
6. ​**避免在 callback 中做耗时操作**：callback 执行期间页面处于"冻结"状态（显示旧快照），应尽快完成 DOM 更新。

---

## 注意事项与陷阱

### 1. view-transition-name 必须唯一

同一时刻页面上不能有两个元素使用相同的 `view-transition-name`。违反此规则会导致​**整个过渡静默失败**——无报错，无动画。

```CSS
/* 错误：两个卡片同时可见且名称相同 */
.card { view-transition-name: card; }

/* 正确：每个卡片唯一命名 */
.card:nth-child(1) { view-transition-name: card-1; }
.card:nth-child(2) { view-transition-name: card-2; }
```

### 2. 过渡期间页面不可滚动

过渡动画运行期间，`::view-transition` 伪元素覆盖在页面上方，用户无法滚动或交互。因此过渡时长不宜过长。

### 3. 固定定位元素的问题

`position: fixed` 的元素（如导航栏、浮动按钮）在默认过渡中会随整个页面一起淡入淡出，看起来很突兀。解决方案：给它们设置独立的 `view-transition-name`。

```CSS
.navbar {
  view-transition-name: navbar;
}

/* 让导航栏不参与淡入淡出 */
::view-transition-old(navbar),
::view-transition-new(navbar) {
  animation: none;
}
```

### 4. 溢出裁剪

`::view-transition-group` 默认 `overflow: hidden`。如果元素在过渡中需要溢出可见（如阴影、装饰元素），需要覆盖：

```CSS
::view-transition-group(card) {
  overflow: visible;
}
```

### 5. z-index 和绘制顺序

伪元素的绘制顺序由 DOM 中 `view-transition-name` 出现的顺序决定（后出现的在上层）。可以通过 CSS 调整：

```CSS
::view-transition-group(overlay) {
  z-index: 100;
}
```

### 6. iframe 中的限制

View Transition 不会跨越 iframe 边界。iframe 内的内容作为一个整体参与父文档的过渡。

### 7. 异步 callback 的超时

如果 callback 返回的 Promise 长时间不 resolve，浏览器会在一定时间后超时并跳过过渡。不要在 callback 中进行慢速网络请求——应该预加载数据。

### 8. 捕获时机的"诡异"行为

浏览器捕获旧快照时使用的是​**元素的当前渲染状态**，包括 `opacity`、`transform` 等。如果元素正在执行其他动画，快照会捕获动画中间帧。

### 9. 与 `will-change` 的交互

给过渡元素设置 `will-change: transform` 可能会导致提前提升为合成层，反而增加内存消耗。一般不需要手动设置。

### 10. 跨文档过渡的同源限制

跨文档过渡只在同源页面间生效。跨域导航绝不会触发视图过渡，这是安全设计。

---

## 演示文件说明

本目录包含以下演示文件：

| 文件 | 演示内容 |
| --- | --- |
| `01-basic-crossfade.html` | 基础交叉淡入淡出：最简单的 View Transition 用法 |
| `02-card-expand.html` | 卡片展开详情：点击卡片飞入详情页的经典模式 |
| `03-theme-switch.html` | 主题切换：圆形扩展动画实现明暗模式切换 |
| `04-list-reorder.html` | 列表排序：拖拽/按钮排序时元素平滑移动 |
| `05-tab-navigation.html` | 选项卡导航：方向感知的滑动切换 |
| `06-image-gallery.html` | 图片画廊：缩略图到全屏的无缝过渡 |
| `07-mpa-page-a.html` / `07-mpa-page-b.html` | 跨文档过渡：两个独立 HTML 文件之间的 MPA 过渡 |

> 请使用 Chrome 111+ 或 Edge 111+ 查看完整效果。建议通过本地服务器运行（`npx serve .`）。

---

## 参考资源

- [MDN: View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API)
- [Chrome Developers: View Transitions](https://developer.chrome.com/docs/web-platform/view-transitions)
- [CSS Tricks: View Transitions API](https://css-tricks.com/view-transitions-api/)
- [W3C 规范草案](https://drafts.csswg.org/css-view-transitions-1/)
- [Jake Archibald: View Transitions 详解](https://jakearchibald.com/2024/view-transitions-handling-aspect-ratio-changes/)
