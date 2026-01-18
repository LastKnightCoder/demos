# HTML `is` 全局属性

## 概述

`is` 是 HTML 的一个全局属性，用于创建​**自定义内置元素**（Customized Built-in Elements）。它允许你扩展现有的 HTML 元素，为其添加自定义行为，同时保留原生元素的所有功能和语义。

## 基本语法

```HTML
<button is="custom-button">点击我</button>
```

```JAVASCRIPT
class CustomButton extends HTMLButtonElement {
  connectedCallback() {
    // 自定义逻辑
  }
}

customElements.define('custom-button', CustomButton, { extends: 'button' });
```

## 核心特点

### 1. 扩展内置元素

- 继承原生元素的所有功能（如 `<button>` 的点击、焦点、表单提交等）
- 保留元素的语义和可访问性
- 添加自定义行为和样式

### 2. 与自主自定义元素的区别

| 特性 | 自主自定义元素 | 自定义内置元素 (使用 `is`) |
| --- | --- | --- |
| 定义方式 | `<my-element>` | `<button is="my-button">` |
| 继承 | HTMLElement | 特定的内置元素类 |
| 语义 | 需要自己定义 | 继承原生元素语义 |
| 可访问性 | 需要手动实现 | 自动继承 |
| 浏览器支持 | 较好 | Safari 不支持 |

### 3. 使用场景

- 增强现有元素的功能（如添加动画效果）
- 保持语义化的同时添加交互
- 需要原生元素的默认行为时

## 浏览器兼容性

- ✅ Chrome/Edge 67+
- ✅ Firefox 63+
- ❌ Safari（不支持）

Safari 不支持自定义内置元素，但支持自主自定义元素。

## 示例列表

1. ​**01-basic-example.html** - 基础示例：扩展按钮元素
2. ​**02-ripple-button.html** - 波纹效果按钮
3. ​**03-auto-save-input.html** - 自动保存的输入框
4. ​**04-expandable-details.html** - 可展开的详情元素
5. ​**05-polyfill.html** - Safari 兼容方案

## 参考资源

- [MDN: is 属性](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/is)
- [Web Components 规范](https://html.spec.whatwg.org/multipage/custom-elements.html#custom-elements-customized-builtin-example)
