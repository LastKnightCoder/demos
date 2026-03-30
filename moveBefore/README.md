# moveBefore API

`moveBefore(nodeToMove, referenceNode)` 把 `nodeToMove` 插入到 `referenceNode` 之前，同时保留该节点及其子节点的所有内部状态。

## 语法

```JS
parentNode.moveBefore(node, referenceNode)
```

- `node`：要移动的节点，必须已经在页面中（`isConnected === true`）
- `referenceNode`：参照节点，移动后 `node` 位于其之前；传入 `null` 则 `node` 成为父节点的最后一个子节点
- 返回值：被移动的节点

该方法定义在 `Element`、`Document`、`DocumentFragment` 接口上，这三种类型均可作为父节点调用。

## 为什么需要它

传统的 `appendChild` / `insertBefore` 移动节点时，实际上分两步执行：​**先移除，再插入**。这会导致：

| 问题 | 说明 |
| --- | --- |
| iframe 重新加载 | 移除时触发卸载，插入时重新请求资源 |
| 动画中断 | 节点离开 DOM 后动画状态丢失 |
| 焦点丢失 | 移除时 `blur` 事件触发，选中文字也会消失 |
| Web Components 生命周期误触发 | `disconnectedCallback` → `connectedCallback` 导致不必要的清理和重新初始化 |
| popover / dialog 被关闭 | 移除时自动关闭，需要代码重新打开 |

`moveBefore` 是​**原子移动**，整个过程不存在节点离开 DOM 的中间状态，以上问题均不会发生。

> 注意：媒体资源（`<audio>` / `<video>`）无论使用哪种方式移动，播放状态都会被保留，这是浏览器对媒体元素的特殊处理，与 `moveBefore` 无关。

## 与 insertBefore 的对比

| `insertBefore` | `moveBefore` |
| --- | --- |
| 节点是否必须在页面中 | 否，内存中的节点也可以 | ​**是**，`isConnected` 必须为 `true` |
| 移动过程 | 先移除再插入（两步） | 原子操作（一步） |
| iframe | 重新加载 | 不重新加载 |
| CSS 动画 | 中断 | 继续执行 |
| 焦点 / 选区 | 丢失 | 保留 |
| Web Components 回调 | `disconnectedCallback` + `connectedCallback` | `connectedMoveCallback` |
| popover / dialog | 关闭 | 保持打开 |

## Web Components 生命周期

使用 `moveBefore` 移动自定义元素时，会触发 `connectedMoveCallback` 而不是 `disconnectedCallback` + `connectedCallback`：

```JS
class MyElement extends HTMLElement {
  connectedCallback() {
    console.log('挂载')
  }
  disconnectedCallback() {
    console.log('卸载')
  }
  // moveBefore 专属回调，移动时触发
  connectedMoveCallback() {
    console.log('被移动，状态已保留')
  }
}
customElements.define('my-element', MyElement)
```

如果自定义元素没有定义 `connectedMoveCallback`，`moveBefore` 仍然正常工作，只是不会有任何回调触发（不会回退到触发 `disconnectedCallback` / `connectedCallback`）。

## 错误条件

| 错误类型 | 触发场景 |
| --- | --- |
| `HierarchyRequestError` | 违反 DOM 层级规则，例如把父节点移动到子节点内部 |
| `NotFoundError` | `referenceNode` 不是目标父节点的直接子节点 |
| `TypeError` | 参数类型不合法 |
| 节点未连接 | `node.isConnected === false` 时抛出错误（这是与 `insertBefore` 最重要的区别） |

## 特性检测

```JS
const supported = 'moveBefore' in Element.prototype

if (supported) {
  parent.moveBefore(node, ref)
} else {
  // 降级：状态会丢失
  parent.insertBefore(node, ref)
}
```

## 使用场景

​**React **​**`createPortal`**​** / Vue **​**`Teleport`**：为了避免被 `overflow: hidden` 裁剪，通常把元素挂到 `<body>` 下。使用 `moveBefore` 可以在传送的同时保留内部状态（动画、焦点、子组件状态等）。

​**拖拽复杂元素**：拖拽包含 popover、动画、视频的复杂组件时，`moveBefore` 可以保持这些状态不被中断。

​**虚拟列表 / 列表重排**：对含有 iframe 或媒体元素的列表进行排序时，避免资源重新加载。

## 浏览器兼容性

| 浏览器 | 支持版本 |
| --- | --- |
| Chrome | 133+ |
| Edge | 133+ |
| Firefox | 开发中 |
| Safari | 开发中（WebKit Bug #281223） |

可通过 [caniuse.com/wf-move-before](https://caniuse.com/wf-move-before) 查看最新支持情况。

## 参考

- [MDN: Element.moveBefore()](https://developer.mozilla.org/en-US/docs/Web/API/Element/moveBefore)
- [Chrome for Developers: Preserve state during DOM mutations with moveBefore()](https://developer.chrome.com/blog/movebefore-api)
- [告别 insertBefore，使用 moveBefore 移动 DOM 元素](https://juejin.cn/post/7462727316967292979)
