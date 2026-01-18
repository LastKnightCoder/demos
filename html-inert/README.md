# HTML inert 属性

## 什么是 inert 属性？

`inert` 是一个 HTML 全局属性，用于使元素及其所有后代元素变为"惰性"状态。当元素被标记为 inert 时，浏览器会忽略该元素上的所有用户交互。

## 核心特性

当元素设置了 `inert` 属性后，会产生以下效果：

1. ​**不可聚焦** - 元素无法通过键盘 Tab 键或编程方式获得焦点
2. ​**不可点击** - 鼠标点击事件不会触发
3. ​**不可交互** - 所有用户交互事件（如 hover、focus、click）都会被忽略
4. ​**对辅助技术不可见** - 屏幕阅读器等辅助技术会跳过这些元素
5. ​**影响所有后代** - inert 属性会递归应用到所有子元素

## 语法

```HTML
<!-- 使元素变为 inert -->
<div inert>
  <button>这个按钮无法点击</button>
  <input type="text" placeholder="这个输入框无法聚焦">
</div>

<!-- 通过 JavaScript 动态控制 -->
<div id="content">
  <button>可交互的按钮</button>
</div>

<script>
  const content = document.getElementById('content');
  content.inert = true;  // 设置为 inert
  content.inert = false; // 取消 inert
</script>
```

## 常见使用场景

### 1. 模态对话框

当打开模态对话框时，将背景内容设置为 inert，确保用户只能与对话框交互。

### 2. 侧边栏/抽屉

当侧边栏打开时，将主内容区域设置为 inert，引导用户关注侧边栏。

### 3. 加载状态

在内容加载时，将相关区域设置为 inert，防止用户在加载过程中进行交互。

### 4. 多步骤表单

在多步骤表单中，将未激活的步骤设置为 inert，确保用户按顺序完成表单。

### 5. 禁用区域

临时禁用页面的某个区域，而不影响其视觉呈现。

## inert vs disabled

| 特性 | inert | disabled |
| --- | --- | --- |
| 适用范围 | 所有 HTML 元素 | 仅表单元素 |
| 样式影响 | 无默认样式变化 | 通常有灰色样式 |
| 后代影响 | 影响所有后代 | 仅影响当前元素 |
| 辅助技术 | 完全隐藏 | 仍可被读取 |

## 浏览器支持

`inert` 属性在现代浏览器中得到广泛支持：

- Chrome 102+
- Edge 102+
- Firefox 112+
- Safari 15.5+

对于不支持的浏览器，可以使用 [polyfill](https://github.com/WICG/inert)。

## 示例文件

本目录包含以下示例：

1. ​**01-basic-inert.html** - 基础用法演示
2. ​**02-modal-dialog.html** - 模态对话框场景
3. ​**03-sidebar-drawer.html** - 侧边栏/抽屉场景
4. ​**04-loading-state.html** - 加载状态场景
5. ​**05-multi-step-form.html** - 多步骤表单场景

## 最佳实践

1. ​**视觉反馈** - 为 inert 元素添加视觉样式（如降低透明度），让用户知道该区域不可交互
2. ​**焦点管理** - 设置 inert 前，确保焦点不在该元素内；取消 inert 后，考虑恢复焦点
3. ​**语义化** - 配合 ARIA 属性使用，提供更好的可访问性
4. ​**性能考虑** - inert 属性的切换非常高效，可以频繁使用

## 参考资源

- [MDN Web Docs - inert](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/inert)
- [WHATWG HTML Standard](https://html.spec.whatwg.org/multipage/interaction.html#inert)
- [WICG inert Polyfill](https://github.com/WICG/inert)
