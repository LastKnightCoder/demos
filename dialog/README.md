# HTML Dialog 元素学习指南

## 简介

`<dialog>` 是 HTML5 中用于创建对话框、弹窗和模态框的原生元素。它提供了内置的可访问性支持和简单的 API，无需依赖第三方库即可实现专业的对话框功能。

## 基本语法

```HTML
<dialog id="myDialog">
  <p>这是一个对话框</p>
  <button onclick="document.getElementById('myDialog').close()">关闭</button>
</dialog>

<button onclick="document.getElementById('myDialog').showModal()">打开对话框</button>
```

默认情况下，`<dialog>` 元素是隐藏的（`display: none`），需要通过 JavaScript 方法来显示。

## 核心 API

### 方法

#### `dialog.show()`

显示非模态对话框。

```JAVASCRIPT
const dialog = document.querySelector('dialog');
dialog.show();
```

​**特点：**

- 对话框显示在页面上，但不阻止用户与页面其他内容交互
- 不显示背景遮罩
- 不会自动捕获焦点
- 不支持 ESC 键关闭
- 对话框会按照正常文档流定位

#### `dialog.showModal()`

显示模态对话框。

```JAVASCRIPT
const dialog = document.querySelector('dialog');
dialog.showModal();
```

​**特点：**

- 对话框显示在页面最上层（top layer）
- 显示背景遮罩（`::backdrop` 伪元素）
- 阻止用户与页面其他内容交互
- 自动将焦点移到对话框内的第一个可聚焦元素
- 支持 ESC 键关闭
- 焦点被"困"在对话框内（focus trap）

​**注意：** 如果对话框不在 DOM 中或已经打开，调用此方法会抛出异常。

#### `dialog.close([returnValue])`

关闭对话框，可选地设置返回值。

```JAVASCRIPT
// 简单关闭
dialog.close();

// 带返回值关闭
dialog.close('confirmed');
```

​**参数：**

- `returnValue`（可选）：字符串类型，设置 `dialog.returnValue` 属性

### 属性

#### `dialog.open`

只读布尔属性，表示对话框当前是否打开。

```JAVASCRIPT
if (dialog.open) {
  console.log('对话框已打开');
}
```

​**注意：** 不要直接设置此属性，应使用 `show()`、`showModal()` 或 `close()` 方法。

#### `dialog.returnValue`

字符串属性，存储对话框关闭时的返回值。

```JAVASCRIPT
dialog.addEventListener('close', () => {
  console.log('返回值:', dialog.returnValue);
});

dialog.close('user-confirmed');
```

​**用途：**

- 表单提交结果
- 用户选择的选项
- 确认/取消操作的结果

### 事件

#### `close` 事件

对话框关闭时触发（无论是通过 `close()` 方法、ESC 键还是表单提交）。

```JAVASCRIPT
dialog.addEventListener('close', (event) => {
  console.log('对话框已关闭');
  console.log('返回值:', dialog.returnValue);
});
```

#### `cancel` 事件

用户按 ESC 键时触发（仅模态对话框）。

```JAVASCRIPT
dialog.addEventListener('cancel', (event) => {
  // 可以阻止默认行为来禁止 ESC 关闭
  // event.preventDefault();
  console.log('用户按下了 ESC 键');
});
```

​**注意：** 如果调用 `event.preventDefault()`，对话框将不会关闭。

## 模态 vs 非模态

### 模态对话框 (Modal)

​**使用场景：**

- 需要用户立即响应的操作（确认删除、保存更改等）
- 表单输入（登录、注册、设置等）
- 重要警告或通知
- 需要阻止用户操作其他内容的场景

​**特性：**

- 使用 `showModal()` 打开
- 显示背景遮罩（`::backdrop` 伪元素）
- 阻止与页面其他内容的交互
- 按 ESC 键可关闭（可通过 `cancel` 事件阻止）
- 自动管理焦点（focus trap）
- 显示在 top layer，不受 z-index 影响

​**示例：**

```JAVASCRIPT
const dialog = document.querySelector('dialog');
const openBtn = document.querySelector('#openBtn');
const closeBtn = document.querySelector('#closeBtn');

openBtn.addEventListener('click', () => {
  dialog.showModal();
});

closeBtn.addEventListener('click', () => {
  dialog.close();
});

// 点击背景关闭
dialog.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect();
  if (
    e.clientX < rect.left ||
    e.clientX > rect.right ||
    e.clientY < rect.top ||
    e.clientY > rect.bottom
  ) {
    dialog.close();
  }
});
```

### 非模态对话框 (Non-modal)

​**使用场景：**

- 辅助信息显示（工具提示、帮助文档等）
- 不需要立即响应的通知
- 允许用户同时操作对话框和页面内容
- 类似浮动面板的功能

​**特性：**

- 使用 `show()` 打开
- 无背景遮罩
- 允许与页面其他内容交互
- 不会自动捕获焦点
- 不支持 ESC 键关闭（需要手动实现）
- 按照正常文档流定位

​**示例：**

```JAVASCRIPT
const dialog = document.querySelector('dialog');

// 打开非模态对话框
dialog.show();

// 需要手动实现 ESC 关闭
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && dialog.open) {
    dialog.close();
  }
});
```

## 样式化

### 基本样式

```CSS
dialog {
  /* 移除默认边框 */
  border: none;
  border-radius: 8px;
  padding: 20px;

  /* 设置最大宽度 */
  max-width: 500px;
  width: 90%;

  /* 阴影效果 */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* 移除默认的 padding */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}
```

### 背景遮罩样式

`::backdrop` 伪元素只在模态对话框中生效。

```CSS
/* 基础背景遮罩 */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.5);
}

/* 模糊效果 */
dialog::backdrop {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(4px);
}

/* 渐变背景 */
dialog::backdrop {
  background: linear-gradient(
    135deg,
    rgba(0, 0, 0, 0.6),
    rgba(0, 0, 0, 0.3)
  );
}
```

### 动画效果

```CSS
/* 打开动画 */
dialog[open] {
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 背景遮罩动画 */
dialog[open]::backdrop {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
```

​**注意：** 关闭动画需要特殊处理，因为 `close()` 会立即移除 `open` 属性。

```JAVASCRIPT
// 关闭动画实现
function closeWithAnimation(dialog) {
  dialog.classList.add('closing');

  dialog.addEventListener('animationend', () => {
    dialog.classList.remove('closing');
    dialog.close();
  }, { once: true });
}
```

```CSS
dialog.closing {
  animation: slideOut 0.3s ease-in;
}

@keyframes slideOut {
  to {
    opacity: 0;
    transform: translateY(-50px);
  }
}
```

## 表单集成

### 使用 method="dialog"

表单可以通过 `method="dialog"` 属性与对话框集成。

```HTML
<dialog id="formDialog">
  <form method="dialog">
    <label>
      姓名：
      <input type="text" name="name" required>
    </label>
    <button type="submit" value="cancel">取消</button>
    <button type="submit" value="confirm">确定</button>
  </form>
</dialog>
```

​**特点：**

- 提交表单时自动关闭对话框
- 按钮的 `value` 属性会成为 `dialog.returnValue`
- 不会触发实际的表单提交（不会发送 HTTP 请求）

### 获取表单数据

```JAVASCRIPT
const dialog = document.querySelector('#formDialog');
const form = dialog.querySelector('form');

dialog.addEventListener('close', () => {
  if (dialog.returnValue === 'confirm') {
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log('表单数据:', data);
  }
});
```

### 表单验证

```JAVASCRIPT
form.addEventListener('submit', (e) => {
  if (!form.checkValidity()) {
    e.preventDefault();
    // 显示验证错误
  }
});
```

## 演示文件

本项目包含以下演示文件：

1. ​**01-basic-dialog.html** - 基础对话框演示

- 模态和非模态对话框
- 基本的打开/关闭操作

1. ​**02-modal-dialog.html** - 模态对话框演示

- 背景遮罩自定义
- ESC 键关闭
- 点击背景关闭

1. ​**03-form-dialog.html** - 表单对话框演示

- 表单提交处理
- 返回值获取
- 表单验证

1. ​**04-animated-dialog.html** - 动画对话框演示

- 打开/关闭动画
- 过渡效果
- 自定义动画

## 常见问题与注意事项

### 1. 对话框无法打开

**问题：** 调用 `showModal()` 时抛出异常。

**原因：**
- 对话框已经处于打开状态
- 对话框不在 DOM 中

**解决方案：**
```javascript
if (!dialog.open) {
  dialog.showModal();
}
```

### 2. 点击背景无法关闭

**问题：** 点击背景遮罩时对话框不关闭。

**原因：** 这不是默认行为，需要手动实现。

**解决方案：**
```javascript
dialog.addEventListener('click', (e) => {
  const rect = dialog.getBoundingClientRect();
  const isInDialog = (
    e.clientX >= rect.left &&
    e.clientX <= rect.right &&
    e.clientY >= rect.top &&
    e.clientY <= rect.bottom
  );
  if (!isInDialog) {
    dialog.close();
  }
});
```

### 3. 关闭动画不生效

**问题：** 对话框关闭时没有动画效果。

**原因：** `close()` 方法会立即移除 `open` 属性。

**解决方案：**
```javascript
function closeWithAnimation(dialog) {
  dialog.classList.add('closing');
  dialog.addEventListener('animationend', () => {
    dialog.classList.remove('closing');
    dialog.close();
  }, { once: true });
}
```

### 4. 焦点管理问题

**问题：** 对话框关闭后焦点丢失。

**解决方案：**
```javascript
let previousActiveElement;

openBtn.addEventListener('click', () => {
  previousActiveElement = document.activeElement;
  dialog.showModal();
});

dialog.addEventListener('close', () => {
  previousActiveElement?.focus();
});
```

### 5. 移动端显示问题

**解决方案：**
```css
dialog {
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

@media (max-width: 640px) {
  dialog {
    max-width: 100vw;
    max-height: 100vh;
    width: 100%;
    margin: 0;
  }
}
```

### 6. 阻止 ESC 键关闭

**解决方案：**
```javascript
dialog.addEventListener('cancel', (e) => {
  e.preventDefault();
  if (confirm('确定要关闭吗？')) {
    dialog.close();
  }
});
```

### 7. 表单重置问题

**解决方案：**
```javascript
dialog.addEventListener('close', () => {
  form.reset();
});
```

## 浏览器支持

| 浏览器 | 版本 | 发布时间 |
|--------|------|----------|
| Chrome | 37+ | 2014年8月 |
| Edge | 79+ | 2020年1月 |
| Firefox | 98+ | 2022年3月 |
| Safari | 15.4+ | 2022年3月 |

**Polyfill：** 对于旧浏览器，可使用 [dialog-polyfill](https://github.com/GoogleChrome/dialog-polyfill)。

## 可访问性

### 自动功能

- **ARIA 角色：** 自动设置 `role="dialog"`
- **焦点管理：** 模态对话框自动捕获焦点
- **焦点陷阱：** Tab 键循环在对话框内
- **键盘支持：** ESC 键关闭模态对话框

### 最佳实践

#### 1. 添加 aria-label 或 aria-labelledby

```html
<dialog aria-labelledby="dialog-title">
  <h2 id="dialog-title">对话框标题</h2>
  <p>对话框内容</p>
</dialog>
```

#### 2. 添加 aria-describedby

```html
<dialog aria-labelledby="title" aria-describedby="desc">
  <h2 id="title">警告</h2>
  <p id="desc">此操作无法撤销。</p>
</dialog>
```

#### 3. 提供明确的关闭方式

```html
<dialog>
  <button aria-label="关闭对话框">×</button>
  <h2>对话框标题</h2>
</dialog>
```

## 性能优化

### 1. 延迟加载内容

```javascript
function openDialog(contentUrl) {
  dialog.showModal();
  dialog.innerHTML = '<p>加载中...</p>';
  fetch(contentUrl)
    .then(res => res.text())
    .then(html => dialog.innerHTML = html);
}
```

### 2. 复用对话框

```javascript
// ✓ 好
const messageDialog = document.querySelector('#messageDialog');
function showMessage(msg) {
  messageDialog.querySelector('p').textContent = msg;
  messageDialog.showModal();
}
```

## 最佳实践总结

### 必须做的

1. ✓ 使用 `showModal()` 而非 `show()`（除非确实需要非模态）
2. ✓ 提供明确的关闭按钮
3. ✓ 添加 `aria-labelledby` 或 `aria-label`
4. ✓ 处理 `close` 事件清理状态
5. ✓ 在移动端测试响应式布局

### 不应该做的

1. ✗ 不要嵌套对话框
2. ✗ 不要在对话框内放置过多内容
3. ✗ 不要阻止所有 ESC 关闭行为（除非必要）
4. ✗ 不要直接操作 `open` 属性

## 常见用例示例

### 1. 确认对话框

```javascript
function confirm(message) {
  return new Promise((resolve) => {
    const dialog = document.querySelector('#confirmDialog');
    dialog.querySelector('p').textContent = message;
    dialog.addEventListener('close', () => {
      resolve(dialog.returnValue === 'confirm');
    }, { once: true });
    dialog.showModal();
  });
}

const confirmed = await confirm('确定要删除吗？');
```

### 2. 表单输入

```javascript
function promptInput(title, placeholder) {
  return new Promise((resolve) => {
    const dialog = document.querySelector('#inputDialog');
    const input = dialog.querySelector('input');
    dialog.querySelector('h2').textContent = title;
    input.placeholder = placeholder;
    dialog.addEventListener('close', () => {
      resolve(dialog.returnValue === 'submit' ? input.value : null);
    }, { once: true });
    dialog.showModal();
  });
}
```

### 3. 加载提示

```javascript
class LoadingDialog {
  constructor() {
    this.dialog = document.querySelector('#loadingDialog');
  }
  show(message = '加载中...') {
    this.dialog.querySelector('p').textContent = message;
    this.dialog.showModal();
  }
  hide() {
    this.dialog.close();
  }
}
```

## 参考资源

- [MDN Web Docs - Dialog](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/dialog)
- [HTML Standard - Dialog](https://html.spec.whatwg.org/multipage/interactive-elements.html#the-dialog-element)
- [ARIA Authoring Practices - Dialog](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [Can I Use - Dialog](https://caniuse.com/dialog)
