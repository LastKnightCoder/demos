# tabindex 详解

## 什么是 tabindex？

`tabindex` 是一个 HTML 全局属性，用于控制元素是否可以通过键盘 Tab 键获得焦点，以及在 Tab 键导航顺序中的位置。

它是 Web 无障碍访问（Accessibility）的核心概念之一，确保键盘用户和辅助技术（如屏幕阅读器）能够正常操作页面。

---

## tabindex 的三种值

### `tabindex="0"` — 加入自然 Tab 顺序

- 使原本不可聚焦的元素（如 `<div>`、`<span>`、`<p>`）变得可聚焦
- 按照元素在 DOM 中的顺序参与 Tab 导航
- 适合自定义交互组件（如自定义按钮、卡片）

```HTML
<div tabindex="0">我现在可以被 Tab 键聚焦了</div>
```

### `tabindex="-1"` — 可编程聚焦，不在 Tab 顺序中

- 元素不会出现在 Tab 键导航序列中
- 但可以通过 JavaScript 的 `.focus()` 方法主动聚焦
- 适合模态框、下拉菜单、对话框等需要程序控制焦点的场景

```HTML
<div tabindex="-1" id="modal">模态框内容</div>
<script>
  document.getElementById('modal').focus(); // 可以聚焦
</script>
```

### `tabindex="正整数"` — 自定义 Tab 顺序（不推荐）

- 数值越小，越先被 Tab 到
- 正整数元素会在 `tabindex="0"` 的元素之前被聚焦
- ​**强烈不推荐使用**：难以维护，破坏用户预期，违反无障碍最佳实践

```HTML
<input tabindex="3" placeholder="第三个被聚焦">
<input tabindex="1" placeholder="第一个被聚焦">
<input tabindex="2" placeholder="第二个被聚焦">
```

---

## 默认可聚焦元素

以下元素无需 `tabindex` 即可通过 Tab 键聚焦，它们的默认 `tabIndex` 值（JavaScript 中的 `element.tabIndex`）大多为 ​**0**：

| 元素 | 默认 tabIndex | 条件 | 说明 |
| --- | --- | --- | --- |
| `<a>` | ​**0** | 有 `href` 属性 | 无 href 时 tabIndex 为 -1，不可聚焦 |
| `<button>` | ​**0** | 未被 `disabled` | disabled 时 tabIndex 仍为 0，但不可聚焦 |
| `<input>` | ​**0** | 未被 `disabled`，非 `type="hidden"` | 包括 text, checkbox, radio, file 等所有可见类型 |
| `<select>` | ​**0** | 未被 `disabled` | 下拉选择框 |
| `<textarea>` | ​**0** | 未被 `disabled` | 多行文本输入框 |
| `<details>` | ​**0** | 始终可聚焦 | HTML5 折叠面板元素 |
| `<summary>` | ​**0** | 作为 details 的子元素 | 在现代浏览器中与标准元素一致 |
| `<iframe>` | ​**0** | 始终可聚焦 | 内嵌框架 |
| `<audio>` | ​**0** | 有 `controls` 属性 | 无 controls 时不可聚焦 |
| `<video>` | ​**0** | 有 `controls` 属性 | 无 controls 时不可聚焦 |
| `<area>` | ​**0** | 有 `href` 属性 | 图像映射区域（配合 `<map>` 使用） |
| 可编辑元素 | ​**-1** | 有 `contenteditable` 属性 | 虽然 tabIndex 为 -1，但实际可被 Tab 聚焦 |

​**重要提示：**

- `tabIndex` 属性值 ≠ 是否可聚焦，浏览器会根据元素类型和状态综合判断
- 非可聚焦元素（如普通 `<div>`、`<span>`）的 `tabIndex` 默认为 ​**-1**

​**为什么 contenteditable 的 tabIndex 是 -1 但可以被 Tab 聚焦？**

`<summary>` 在现代浏览器中的 `tabIndex` 已经是 `0`，与标准元素一致。只有 `contenteditable` 是真正的"tabIndex=-1 但可聚焦"的特殊情况：

- ​**历史原因：** `contenteditable` 最初是 IE 的私有特性（1990 年代末），后来才标准化
- ​**语义区分：** `tabIndex=-1` 表示"这不是标准的表单控件，而是一个可编辑区域"
- ​**向后兼容：** 改成 0 会破坏大量依赖 `tabIndex === 0` 判断标准控件的代码
- ​**浏览器特殊处理：** 浏览器内部将 `contenteditable` 视为可聚焦，即使 tabIndex 是 -1

详见 [12-actual-tabindex-values.html](./12-actual-tabindex-values.html) 的实际测试结果。

---

## 常见使用场景

### 1. 自定义交互组件

当用 `<div>` 或 `<span>` 实现按钮、卡片等交互元素时，需要添加 `tabindex="0"` 使其可访问。

### 2. 模态框焦点管理

打开模态框时，用 `tabindex="-1"` 配合 `.focus()` 将焦点移入；关闭时将焦点归还原触发元素。

### 3. 焦点陷阱（Focus Trap）

在模态框、抽屉等组件中，限制 Tab 键只在组件内部循环，防止焦点逃逸到背景内容。

### 4. 跳过导航链接（Skip Link）

页面顶部添加"跳过导航"链接，让键盘用户快速跳到主内容区域。

---

## 重要注意事项

### 1. 手动设置 tabindex 的优先级

​**手动设置的 ​`tabindex`​ 属性会完全覆盖元素的默认行为，优先级最高。**

```
手动设置的 tabindex > 浏览器特殊规则 > 元素默认行为
```

​**具体效果：**

- ​**默认可聚焦元素设置 ​`tabindex="-1"`​：**
  
  ```HTML
  <input type="text" tabindex="-1">
  <button tabindex="-1">按钮</button>
  ```
  
  - ❌ 不能被 Tab 键聚焦（被移除出 Tab 顺序）
  - ✅ 仍可通过鼠标点击或 JS 的 `.focus()` 聚焦
  - 用途：临时禁用 Tab 访问（如模态框打开时禁用背景内容）
- ​**特殊元素（summary、contenteditable）设置 ​`tabindex="-1"`​：**
  
  ```HTML
  <summary tabindex="-1">折叠面板</summary>
  <div contenteditable tabindex="-1">可编辑区域</div>
  ```
  
  - ❌ 不能被 Tab 键聚焦（显式设置覆盖了浏览器的特殊行为）
- ​**普通元素设置 `tabindex="0"`​：**
  
  ```HTML
  <div tabindex="0">自定义按钮</div>
  ```
  
  - ✅ 可以被 Tab 键聚焦（加入 Tab 顺序）

### 2. 特殊元素的聚焦行为

某些元素虽然 JavaScript 读取的 `element.tabIndex` 为 `-1`，但浏览器仍将它们视为可交互元素：

| 元素 | tabIndex 值 | Tab 键行为 | 原因 |
| --- | --- | --- | --- |
| `<summary>` | -1 | ✅ 可聚焦 | 浏览器视为 `<details>` 的交互触发器 |
| `contenteditable` | -1 | ✅ 可聚焦 | 可编辑区域被视为输入控件 |
| 普通 `<div>` | -1 | ❌ 不可聚焦 | 非交互元素，符合预期 |

​**聚焦顺序规则：**

1. ​**正整数 tabindex（1, 2, 3...）**：按数值从小到大聚焦（不推荐）
2. ​**tabindex="0" + 特殊元素（summary、contenteditable）**：按 ​**DOM 顺序**聚焦
3. ​**tabindex="-1" 的普通元素**：不参与 Tab 导航，只能通过 JS 聚焦

### 3. 判断元素是否可聚焦

​**不能只看 `element.tabIndex` 值！** 应该实际测试或使用以下逻辑：

```JAVASCRIPT
function isTabbable(element) {
  // 检查元素是否在 Tab 顺序中
  if (element.tabIndex < 0) {
    // 特殊元素：summary 和 contenteditable（未显式设置 tabindex="-1"）
    return element.tagName === 'SUMMARY' && !element.hasAttribute('tabindex') ||
           element.contentEditable === 'true' && !element.hasAttribute('tabindex');
  }
  // tabIndex >= 0 且未被禁用
  return !element.disabled && element.offsetParent !== null; // 可见
}
```

### 4. 常见使用场景

​**使用 `tabindex="-1"`​ 的场景：**

- ​**临时禁用 Tab 访问：** 模态框打开时，将背景内容的交互元素设置为 `tabindex="-1"`
  
  ```JAVASCRIPT
  // 打开模态框
  document.querySelectorAll('button, a, input').forEach(el => {
    el.dataset.originalTabindex = el.getAttribute('tabindex') || '';
    el.setAttribute('tabindex', '-1');
  });
  
  // 关闭模态框，恢复背景内容
  document.querySelectorAll('button, a, input').forEach(el => {
    if (el.dataset.originalTabindex) {
      el.setAttribute('tabindex', el.dataset.originalTabindex);
    } else {
      el.removeAttribute('tabindex'); // 恢复默认行为
    }
  });
  ```
- ​**自定义焦点管理：** 复杂组件中，只让容器可聚焦，内部选项通过方向键导航
  
  ```HTML
  <div role="listbox" tabindex="0">
    <div role="option" tabindex="-1">选项 1</div>
    <div role="option" tabindex="-1">选项 2</div>
  </div>
  ```

​**使用 `tabindex="0"`​ 的场景：**

- ​**自定义交互组件：** 用 `<div>` 实现的按钮、卡片、菜单项等
- ​**恢复默认行为：** 如果之前设置了 `tabindex="-1"`，可以用 `tabindex="0"` 恢复

### 5. 其他注意事项

- ​**`disabled`​**​** 属性优先级更高：** `<button disabled tabindex="0">` 仍然不可聚焦
- ​**移除 ​**​**`tabindex`**​**​ 属性恢复默认：** `element.removeAttribute('tabindex')`
- ​**不要滥用 ​**​**`tabindex="-1"`**​**​：** 会破坏键盘用户体验，只在必要时使用
- ​**`tabIndex`​**​** 属性值 ≠ 是否可聚焦：** 浏览器会根据元素类型和状态综合判断

---

## 最佳实践

- ​**优先使用语义化 HTML**：能用 `<button>` 就不用 `<div tabindex="0">`
- ​**避免正整数 tabindex**：依赖 DOM 顺序，通过调整 HTML 结构来控制 Tab 顺序
- ​**配合 ARIA 使用**：自定义组件加 `tabindex="0"` 的同时，添加对应的 `role` 和 `aria-*` 属性
- ​**保持焦点可见**：不要用 `outline: none` 移除焦点样式，或提供自定义的清晰焦点指示器
- ​**手动设置 tabindex 时要谨慎**：理解它会覆盖默认行为，确保不会破坏键盘导航
- ​**测试键盘访问性**：实际按 Tab 键测试，不要只依赖 `tabIndex` 值判断

---

## 演示文件

| 文件 | 内容 |
| --- | --- |
| [01-basic-values.html](./01-basic-values.html) | 三种 tabindex 值的基础对比 |
| [02-custom-order.html](./02-custom-order.html) | 正整数 tabindex 的顺序问题（反面教材） |
| [03-programmatic-focus.html](./03-programmatic-focus.html) | tabindex="-1" 与程序化焦点控制 |
| [04-modal-focus-trap.html](./04-modal-focus-trap.html) | 模态框焦点陷阱实现 |
| [05-custom-widget.html](./05-custom-widget.html) | 自定义可访问组件（标签页） |
| [06-default-focusable.html](./06-default-focusable.html) | 默认可聚焦元素的 tabIndex 值详解（交互式测试） |
| [07-special-tabindex-behavior.html](./07-special-tabindex-behavior.html) | 为什么 tabIndex=-1 但仍可聚焦？聚焦顺序详解 |
| [08-manual-tabindex-override.html](./08-manual-tabindex-override.html) | 手动设置 tabIndex 会覆盖默认行为吗？完整测试 |
| [09-why-tabindex-minus-one.html](./09-why-tabindex-minus-one.html) | 为什么特殊元素默认 tabIndex=-1 而不是 0？设计原因深度解析 |
| [10-breaking-change-explanation.html](./10-breaking-change-explanation.html) | 详解：改成 tabIndex=0 会如何破坏现有代码（真实场景） |
| [11-tab-vs-activation.html](./11-tab-vs-activation.html) | Tab 键 vs 激活键：澄清常见误区（Tab 不触发点击！） |
| [12-actual-tabindex-values.html](./12-actual-tabindex-values.html) | 实际测试：summary 和 contenteditable 的真实 tabIndex 值 |
| [13-tab-shift-tab-behavior.html](./13-tab-shift-tab-behavior.html) | Tab 和 Shift+Tab 是浏览器默认行为吗？完整说明 |
