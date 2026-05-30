# CSS Anchor Positioning 学习笔记

CSS Anchor Positioning 允许一个元素根据另一个元素的位置和尺寸来布局。典型场景是 tooltip、popover、下拉菜单、浮动菜单、拖拽标记、表单错误提示、图表标注等。过去这些东西通常需要 JavaScript 读取 `getBoundingClientRect()`，再手动设置 `top`、`left`，还要监听滚动、窗口缩放、内容变化和边界溢出。Anchor Positioning 把很多计算交给 CSS，让定位关系变成声明式样式。

> 本文基于 CSS Anchor Positioning Module Level 1 Working Draft 以及 MDN 当前文档整理。这个 API 仍在演进中，请优先使用本文采用的新语法：`position-area`、`position-try-fallbacks`、`@position-try`、`anchor()`、`anchor-size()`。

## 示例文件

你可以直接用浏览器打开这些 HTML：

- [01-basic-tooltip.html](./01-basic-tooltip.html)：最小 tooltip 示例，展示 `anchor-name、position-anchor`、`position-area`。
- [02-anchor-function.html](./02-anchor-function.html)：使用 `anchor() 精确绑定边线。`
- [03-anchor-size.html](./03-anchor-size.html)：使用 `anchor-size() 让浮层尺寸跟随锚点。`
- [04-position-area.html](./04-position-area.html)：可视化 `position-area 的九宫格/方位布局。`
- [05-fallbacks.html](./05-fallbacks.html)：使用 `position-try-fallbacks 和 @position-try` 避免溢出。
- [06-scroll-visibility.html](./06-scroll-visibility.html)：滚动容器中的锚点，以及 `position-visibility。`
- [07-anchor-scope.html](./07-anchor-scope.html)：使用 `anchor-scope 限制同名锚点的查找范围。`

建议使用 Chrome / Edge 较新版本查看。若浏览器不支持，会显示页面内的兼容性提示。

## 这个 API 解决了什么问题

### 过去的问题

假设要把 tooltip 放在按钮上方，传统写法通常要做这些事：

```JavaScript
const button = document.querySelector(".button");
const tooltip = document.querySelector(".tooltip");

function placeTooltip() {
  const rect = button.getBoundingClientRect();
  tooltip.style.left = `${rect.left + rect.width / 2}px`;
  tooltip.style.top = `${rect.top - tooltip.offsetHeight - 8}px`;
  tooltip.style.transform = "translateX(-50%)";
}

placeTooltip();
window.addEventListener("resize", placeTooltip);
window.addEventListener("scroll", placeTooltip, true);
```

这段代码表面简单，但真实项目里会继续膨胀：

- 滚动容器不一定是 `window`，可能有很多层。
- tooltip 自己的尺寸可能会因为内容、字体、响应式换行而变化。
- 锚点可能被动画、布局变化、虚拟列表或表单错误插入影响。
- 如果 tooltip 超出视口，需要自动换到下方、左侧或右侧。
- 需要考虑 writing mode、RTL、zoom、滚动条、视觉视口、iframe 等细节。
- JavaScript 读布局再写样式容易触发布局抖动。

### Anchor Positioning 的思路

Anchor Positioning 把“浮层依附于谁”和“依附在什么方位”写进 CSS：

```CSS
.button {
  anchor-name: --save-button;
}

.tooltip {
  position: absolute;
  position-anchor: --save-button;
  position-area: top;
  margin-bottom: 8px;
}
```

意思是：

- `.button` 声明自己是一个名为 `--save-button` 的锚点。
- `.tooltip` 使用 `position-anchor` 绑定这个锚点。
- `position-area: top` 把 tooltip 放到锚点上方。

浏览器负责根据锚点位置、尺寸、滚动和布局变化重新计算浮层的位置。

## 核心概念

### Anchor element

Anchor element 是被其他元素参照定位的元素。你通过 `anchor-name` 把普通元素注册成锚点。

```CSS
.card-button {
  anchor-name: --card-action;
}
```

### Anchor-positioned element

Anchor-positioned element 是根据锚点定位的元素。它必须是 positioned element，也就是 `position` 不能是默认的 `static`。通常使用：

```CSS
.menu {
  position: absolute;
  position-anchor: --card-action;
}
```

也可以用 `position: fixed`。实际选择取决于你希望浮层相对哪个包含块和滚动上下文表现。

### 默认锚点

`position-anchor` 声明一个元素的默认锚点。后续 `position-area`、`anchor()`、`anchor-size()` 可以使用这个默认锚点，不必每次重复锚点名。

```CSS
.anchor {
  anchor-name: --target;
}

.panel {
  position: absolute;
  position-anchor: --target;
  position-area: bottom right;
}
```

## 兼容性与检测

Anchor Positioning 是较新的 CSS 能力。写 demo 或生产代码时建议加 `@supports`。

```CSS
@supports (anchor-name: --x) and (position-area: top) {
  .tooltip {
    position: absolute;
    position-anchor: --x;
    position-area: top;
  }
}

@supports not (anchor-name: --x) {
  .tooltip {
    /* 这里写传统 absolute/fixed 或 JS fallback */
  }
}
```

也可以用 JavaScript 检测：

```JavaScript
const supported =
  CSS.supports("anchor-name: --x") &&
  CSS.supports("position-area: top");
```

## 属性与函数总览

| 名称 | 类型 | 作用 |
| --- | --- | --- |
| `anchor-name` | 属性 | 把当前元素注册为一个或多个锚点 |
| `anchor-scope` | 属性 | 限制锚点名只在某个子树内可被绑定 |
| `position-anchor` | 属性 | 指定 positioned element 的默认锚点 |
| `position-area` | 属性 | 用方位关键字把元素放到锚点周围或内部 |
| `anchor()` | 函数 | 在 inset 属性中引用锚点某条边的位置 |
| `anchor-size()` | 函数 | 引用锚点的宽度、高度、inline/block 尺寸 |
| `position-try` | 属性 | `position-try-order` 与 `position-try-fallbacks` 的简写 |
| `position-try-fallbacks` | 属性 | 定义定位失败或溢出时尝试的候选位置 |
| `@position-try` | at-rule | 自定义一组可复用的回退定位规则 |
| `position-try-order` | 属性 | 定义 fallback 尝试顺序如何排序 |
| `position-visibility` | 属性 | 当锚点不可见或浮层溢出时隐藏浮层 |

## `anchor-name`

`anchor-name` 给元素命名，让它可以被其他元素引用。

```CSS
.button {
  anchor-name: --button-anchor;
}
```

语法：

```CSS
anchor-name: none;
anchor-name: --name;
anchor-name: --name-a, --name-b;
```

要点：

- 锚点名必须是 dashed-ident，也就是以两个连字符开头，例如 `--menu-button`。
- 默认值是 `none`。
- 一个元素可以有多个锚点名。
- 多个元素使用同一个锚点名时，具体匹配会受作用域、树顺序和可见性影响。实际项目中建议让同一定位关系的锚点名尽量唯一。

示例：

```CSS
.avatar {
  anchor-name: --profile-avatar;
}

.status-badge {
  position: absolute;
  position-anchor: --profile-avatar;
  position-area: bottom right;
}
```

## `anchor-scope`

`anchor-scope` 用来限制锚点名的可见范围。它在组件化页面里很有用：多个卡片、列表项、弹窗实例内部可能都使用同一个锚点名，例如 `--trigger`。如果不限制范围，外部 positioned element 查找同名锚点时可能绑定到不符合预期的元素。

```CSS
.card {
  anchor-scope: --card-trigger;
}
```

语法：

```CSS
anchor-scope: none;
anchor-scope: all;
anchor-scope: --name;
anchor-scope: --name-a, --name-b;
```

解释：

- `none`：默认值，不额外限制锚点范围。
- `all`：当前元素子树内定义的所有锚点名，都只能被同一个子树内的 positioned element 绑定。
- 指定锚点名：只限制这些锚点名。

组件示例：

```CSS
.card {
  position: relative;
  anchor-scope: --trigger;
}

.card-button {
  anchor-name: --trigger;
}

.card-menu {
  position: absolute;
  position-anchor: --trigger;
  position-area: bottom;
}
```

这样每个 `.card-menu` 都会优先绑定同一张卡片内部的 `.card-button`，即使页面中有很多按钮都叫 `--trigger`。

## `position-anchor`

`position-anchor` 设置当前 positioned element 的默认锚点。

```CSS
.tooltip {
  position: absolute;
  position-anchor: --help-button;
}
```

语法：

```CSS
position-anchor: auto;
position-anchor: --anchor-name;
```

要点：

- 元素必须是 positioned element，例如 `position: absolute` 或 `position: fixed`。
- `position-anchor` 自身不决定元素放在哪里，它只是建立默认关联。
- 真正的位置可以由 `position-area` 或 inset + `anchor()` 决定。
- 如果没有找到对应锚点，相关定位会失效或回退到普通定位行为。

示例：

```CSS
.field {
  anchor-name: --email-field;
}

.error {
  position: absolute;
  position-anchor: --email-field;
  position-area: right;
  margin-left: 10px;
}
```

## `position-area`

`position-area` 是最适合入门的定位方式。它把锚点周围和内部抽象成区域，然后把浮层放进去。

```CSS
.popover {
  position: absolute;
  position-anchor: --trigger;
  position-area: bottom;
  margin-top: 8px;
}
```

常见值：

```CSS
position-area: top;
position-area: right;
position-area: bottom;
position-area: left;

position-area: top left;
position-area: top center;
position-area: top right;
position-area: bottom left;
position-area: bottom center;
position-area: bottom right;

position-area: center;
position-area: span-all;
```

逻辑方向关键字：

```CSS
position-area: block-start;
position-area: block-end;
position-area: inline-start;
position-area: inline-end;
position-area: block-start inline-end;
```

解释：

- `top` / `right` / `bottom` / `left` 是物理方向。
- `block-start` / `inline-end` 等是逻辑方向，会根据 writing mode 和文本方向变化。
- 两个关键字组合时，一个通常描述垂直方向，一个描述水平方向。
- `center` 常用于覆盖在锚点中心。
- `span-*` 关键字可以让定位区域跨越多列或多行，适合更复杂布局。

示例：

```CSS
.button {
  anchor-name: --button;
}

.menu {
  position: absolute;
  position-anchor: --button;
  position-area: bottom left;
  margin-top: 6px;
}
```

## `anchor()`

`anchor()` 函数在 inset 属性中读取锚点某条边的位置。它适合你需要更精确控制 `top`、`right`、`bottom`、`left` 时使用。

```CSS
.panel {
  position: absolute;
  left: anchor(--button left);
  top: calc(anchor(--button bottom) + 8px);
}
```

语法概念：

```CSS
anchor(<anchor-name>? <anchor-side>, <fallback>?)
```

常见写法：

```CSS
left: anchor(--trigger left);
top: anchor(--trigger bottom);
right: anchor(--trigger right);
bottom: anchor(--trigger top);

left: anchor(left);
top: calc(anchor(bottom) + 8px);
```

当已经写了 `position-anchor`，可以省略锚点名：

```CSS
.tooltip {
  position: absolute;
  position-anchor: --trigger;
  left: anchor(center);
  top: calc(anchor(top) - 8px);
  transform: translate(-50%, -100%);
}
```

常用 anchor side：

- `top`
- `right`
- `bottom`
- `left`
- `center`
- `start`
- `end`
- `self-start`
- `self-end`
- 百分比，例如 `50%`

### `self-start` / `self-end` 的含义

`self-start` 和 `self-end` 表示：根据当前被定位元素自己的 writing mode 和 direction，去判断锚点在同一轴上的 start 或 end 是哪一边。

对比：

```CSS
left: anchor(--trigger start);
left: anchor(--trigger self-start);
```

区别是：

- `start` / `end`：根据当前元素的 containing block 的书写方向判断。
- `self-start` / `self-end`：根据当前浮层自己本身的书写方向判断。

在普通横排中文/英文页面里：

```CSS
left: anchor(--trigger self-start);
```

通常大致等于：

```CSS
left: anchor(--trigger left);
```

但是如果浮层自己使用了不同的 `writing-mode` 或 `direction`，`self-start` 就可能不是 `left`，而可能变成 `right`、`top` 或 `bottom`。

例如：

```CSS
.tooltip {
  position: absolute;
  position-anchor: --trigger;
  writing-mode: vertical-rl;

  top: anchor(self-start);
}
```

这里的 `self-start` 会按 `.tooltip` 自己的竖排书写模式来解释，而不是按外层页面的普通横排模式解释。

### 百分比 anchor side 的含义

百分比表示锚点在 start 到 end 之间的某个比例位置。

```CSS
left: anchor(--trigger 0%);
left: anchor(--trigger 50%);
left: anchor(--trigger 100%);
```

可以理解为：

```CSS
anchor(--trigger 0%)   /* 锚点 start 边 */
anchor(--trigger 50%)  /* 锚点中间，类似 center */
anchor(--trigger 100%) /* 锚点 end 边 */
```

如果是在普通横排 LTR 页面里，用在水平轴上：

```CSS
left: anchor(--trigger 0%);   /* 按钮左边 */
left: anchor(--trigger 50%);  /* 按钮水平中心 */
left: anchor(--trigger 100%); /* 按钮右边 */
```

最常见的居中 tooltip 写法：

```CSS
.button {
  anchor-name: --trigger;
}

.tooltip {
  position: absolute;
  position-anchor: --trigger;

  left: anchor(50%);
  top: calc(anchor(bottom) + 8px);
  transform: translateX(-50%);
}
```

这里：

- `left: anchor(50%)`：把 tooltip 的左定位参考点放到按钮宽度 50% 的位置，也就是按钮中心。
- `transform: translateX(-50%)`：tooltip 再往左移动自身宽度的一半。

最终效果就是：tooltip 水平居中对齐按钮，并出现在按钮下方。

带 fallback：

```CSS
.tooltip {
  left: anchor(--trigger center, 50%);
  top: anchor(--trigger bottom, 0);
}
```

`含义是：如果锚点不可用，就使用后面的 fallback。`

使用建议：

- 简单方位优先用 `position-area`。
- 需要对齐某条边、中心点、偏移计算时使用 `anchor()`。
- `anchor()` 常和 `calc()`、`translate` 搭配。

## `anchor-size()`

`anchor-size()` 读取锚点尺寸。它适合让下拉菜单宽度等于按钮宽度，或者让标注根据锚点高度偏移。

```CSS
.dropdown {
  position: absolute;
  position-anchor: --select-button;
  position-area: bottom;
  width: anchor-size(width);
}
```

语法概念：

```CSS
anchor-size(<anchor-name>? <anchor-size>, <fallback>?)
```

常见写法：

```CSS
width: anchor-size(--trigger width);
height: anchor-size(--trigger height);
inline-size: anchor-size(--trigger inline);
block-size: anchor-size(--trigger block);

width: anchor-size(width);
min-width: max(12rem, anchor-size(width));
max-height: calc(anchor-size(height) * 4);
```

常用尺寸关键字：

- `width`
- `height`
- `inline`
- `block`
- `self-inline`
- `self-block`

带 fallback：

```CSS
.menu {
  width: anchor-size(--trigger width, 220px);
}
```

示例：下拉菜单宽度跟按钮一致。

```CSS
.select-button {
  anchor-name: --select;
}

.select-menu {
  position: absolute;
  position-anchor: --select;
  position-area: bottom;
  width: anchor-size(width);
  margin-top: 6px;
}
```

## `position-try-fallbacks`

`position-try-fallbacks` 定义当首选位置不可用时，浏览器应该尝试哪些替代位置。它解决了 tooltip 靠近视口边缘时溢出的问题。

```CSS
.tooltip {
  position: absolute;
  position-anchor: --target;
  position-area: top;
  position-try-fallbacks: bottom, right, left;
}
```

语法：

```CSS
position-try-fallbacks: none;
position-try-fallbacks: flip-block;
position-try-fallbacks: flip-inline;
position-try-fallbacks: flip-start;
position-try-fallbacks: top, bottom, right, left;
position-try-fallbacks: --custom-one, --custom-two;
```

内置回退：

- `flip-block`：沿 block 轴翻转，例如从上变下。
- `flip-inline`：沿 inline 轴翻转，例如从左变右。
- `flip-start`：交换 start/end 方向。
- `flip-x`：沿物理 x 轴翻转。
- `flip-y`：沿物理 y 轴翻转。

自定义回退可以引用 `@position-try`：

```CSS
@position-try --below {
  position-area: bottom;
  margin-top: 8px;
}

.tooltip {
  position: absolute;
  position-anchor: --target;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: --below;
}
```

## `position-try`

`position-try` 是 `position-try-order` 和 `position-try-fallbacks` 的简写。它适合把“如何排序”和“尝试哪些位置”写在一行里。

```CSS
.tooltip {
  position: absolute;
  position-anchor: --target;
  position-area: top;
  position-try: most-height bottom, right, left;
}
```

语法：

```CSS
position-try: normal flip-block;
position-try: most-height bottom;
position-try: most-width --custom-fallback;
position-try: most-block-size flip-block, flip-inline, right;
```

等价展开：

```CSS
.tooltip {
  position-try-order: most-height;
  position-try-fallbacks: bottom, right, left;
}
```

要点：

- 第一个可选部分是 `position-try-order`，例如 `normal`、`most-height`。
- 后面是 `position-try-fallbacks`，可以是内置翻转策略、`position-area` 值或自定义 `@position-try` 名称。
- 如果只写 fallback，例如 `position-try: flip-block`，排序仍然是默认的 `normal`。

## `@position-try`

`@position-try` 定义一组回退定位样式。

```CSS
@position-try --right-side {
  position-area: right;
  margin-left: 10px;
}

.callout {
  position: absolute;
  position-anchor: --note;
  position-area: top;
  position-try-fallbacks: --right-side;
}
```

要点：

- 名称同样使用 dashed-ident，例如 `--below`。
- 常用于改变 `position-area`、margin、尺寸等与定位相关的声明。
- 浏览器会在候选样式中选择一个更不溢出的方案。

完整示例：

```CSS
@position-try --place-below {
  position-area: bottom;
  margin-top: 8px;
  margin-bottom: 0;
}

@position-try --place-right {
  position-area: right;
  margin-left: 8px;
  margin-bottom: 0;
}

.bubble {
  position: absolute;
  position-anchor: --edge-button;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: --place-below, --place-right;
}
```

## `position-try-order`

`position-try-order` 控制多个 fallback 候选位置的尝试排序。默认按照声明顺序尝试，也可以让浏览器按可用空间排序。

```CSS
.tooltip {
  position-try-order: normal;
}
```

常见值：

```CSS
position-try-order: normal;
position-try-order: most-width;
position-try-order: most-height;
position-try-order: most-block-size;
position-try-order: most-inline-size;
```

解释：

- `normal`：按 `position-try-fallbacks` 中的顺序尝试。
- `most-width`：优先选择可用宽度更多的位置。
- `most-height`：优先选择可用高度更多的位置。
- `most-block-size`：按逻辑 block 方向可用空间排序。
- `most-inline-size`：按逻辑 inline 方向可用空间排序。

示例：

```CSS
.menu {
  position: absolute;
  position-anchor: --trigger;
  position-area: bottom;
  position-try-fallbacks: top, right, left;
  position-try-order: most-height;
}
```

## `position-visibility`

`position-visibility` 控制锚点或定位元素处于不可见/溢出状态时是否隐藏。

```CSS
.tooltip {
  position-visibility: anchors-visible;
}
```

常见值：

```CSS
position-visibility: always;
position-visibility: anchors-visible;
position-visibility: no-overflow;
```

解释：

- `always`：默认行为，不因为锚点滚出视野或溢出而自动隐藏。
- `anchors-visible`：当相关锚点不可见时隐藏定位元素。
- `no-overflow`：当定位元素会溢出其可见区域时隐藏。

示例：

```CSS
.sticky-label {
  position: absolute;
  position-anchor: --section-title;
  position-area: right;
  position-visibility: anchors-visible;
}
```

## 常见布局模式

### Tooltip

```CSS
.help {
  anchor-name: --help;
}

.tooltip {
  position: absolute;
  position-anchor: --help;
  position-area: top;
  margin-bottom: 8px;
  position-try-fallbacks: flip-block;
}
```

### Popover / Dropdown

```CSS
.trigger {
  anchor-name: --menu-trigger;
}

.menu {
  position: absolute;
  position-anchor: --menu-trigger;
  position-area: bottom left;
  margin-top: 6px;
  min-width: anchor-size(width);
  position-try-fallbacks: flip-block, flip-inline;
}
```

### 表单错误提示

```CSS
.input {
  anchor-name: --email-input;
}

.error {
  position: absolute;
  position-anchor: --email-input;
  position-area: right;
  margin-left: 10px;
  position-try-fallbacks: bottom, top;
}
```

### 图表标注

```CSS
.data-point {
  anchor-name: --point-q2;
}

.annotation {
  position: absolute;
  position-anchor: --point-q2;
  left: anchor(center);
  bottom: calc(anchor(top) + 12px);
  transform: translateX(-50%);
}
```

## `position-area` 和 `anchor()` 怎么选

优先选择 `position-area`：

```CSS
.tooltip {
  position-area: top;
}
```

当你想表达的是“放在上方/下方/右侧/左侧”时，它最清晰。

选择 `anchor()`：

```CSS
.tooltip {
  left: anchor(center);
  top: calc(anchor(top) - 8px);
  transform: translate(-50%, -100%);
}
```

当你需要精确绑定某条边或某个点，并进行 `calc()` 偏移时，它更灵活。

选择 `anchor-size()`：

```CSS
.menu {
  width: anchor-size(width);
}
```

当浮层尺寸要跟随锚点尺寸时使用。

## 注意事项

- Anchor-positioned element 必须设置 `position: absolute`、`fixed` 等非 `static` 值。
- 锚点名必须以 `--` 开头。
- `anchor()` 通常写在 `top`、`right`、`bottom`、`left`、`inset-*` 等 inset 属性里。
- `anchor-size()` 通常写在 `width`、`height`、`inline-size`、`block-size`、`min-width` 等尺寸属性里。
- 复杂浮层仍然需要考虑焦点管理、键盘交互、可访问性和状态控制。Anchor Positioning 解决的是布局定位，不负责打开/关闭逻辑。
- 如果使用 HTML Popover API，可以把 popover 元素和 anchor positioning 结合起来：Popover 负责顶层显示和交互状态，Anchor Positioning 负责位置。
- 生产环境建议配合 `@supports`，为不支持的浏览器提供可接受的 fallback。

## 推荐学习顺序

1. 打开 [01-basic-tooltip.html](./01-basic-tooltip.html)，理解锚点与浮层如何关联。
2. 打开 [04-position-area.html](./04-position-area.html)，建立 `position-area` 的空间直觉。
3. 打开 [02-anchor-function.html](./02-anchor-function.html)，学习精确边线对齐。
4. 打开 [03-anchor-size.html](./03-anchor-size.html)，学习尺寸联动。
5. 打开 [05-fallbacks.html](./05-fallbacks.html)，理解边缘避让。
6. 打开 [06-scroll-visibility.html](./06-scroll-visibility.html)，观察滚动场景中的显示/隐藏行为。
7. 打开 [07-anchor-scope.html](./07-anchor-scope.html)，理解组件中重复锚点名如何被隔离。

## 参考资料

- [W3C CSS Anchor Positioning Module Level 1](https://www.w3.org/TR/css-anchor-position-1/)
- [MDN: CSS anchor positioning](https://developer.mozilla.org/docs/Web/CSS/CSS_anchor_positioning)
- [MDN: Using CSS anchor positioning](https://developer.mozilla.org/docs/Web/CSS/CSS_anchor_positioning/Using)
- [MDN: position-try](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try)
- [MDN: anchor-scope](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/anchor-scope)
