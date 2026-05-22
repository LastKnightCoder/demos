# CSS `@property` 详解

## 概述

`@property` 是 CSS Houdini 规范中的一部分，允许开发者显式地注册自定义属性（CSS Custom Properties），为其定义类型、继承行为和初始值。相比于普通的 `--variable`，通过 `@property` 注册的自定义属性可以参与动画过渡、类型检查等高级特性。

## 语法

```CSS
@property --property-name {
  syntax: "<type>";
  inherits: true | false;
  initial-value: value;
}
```

### 描述符说明

| 描述符 | 必需 | 说明 |
| --- | --- | --- |
| `syntax` | 是 | 定义属性的类型，决定浏览器如何解析该值 |
| `inherits` | 是 | 是否从父元素继承值 |
| `initial-value` | 视情况 | 属性的初始值（当 syntax 不为 `*` 时必需） |

### `syntax` 支持的类型

| 类型 | 说明 | 示例 |
| --- | --- | --- |
| `<length>` | 长度值 | `10px`, `2em`, `1rem` |
| `<number>` | 数值 | `0`, `1.5`, `100` |
| `<percentage>` | 百分比 | `50%`, `100%` |
| `<length-percentage>` | 长度或百分比 | `10px`, `50%` |
| `<color>` | 颜色值 | `red`, `#ff0000`, `rgb(255,0,0)` |
| `<image>` | 图像 | `url(...)`, `linear-gradient(...)` |
| `<url>` | URL | `url(...)` |
| `<integer>` | 整数 | `1`, `100` |
| `<angle>` | 角度 | `45deg`, `0.5turn` |
| `<time>` | 时间 | `1s`, `200ms` |
| `<resolution>` | 分辨率 | `96dpi` |
| `<transform-function>` | 变换函数 | `rotate(45deg)` |
| `<transform-list>` | 变换列表 | `rotate(45deg) scale(2)` |
| `<custom-ident>` | 自定义标识符 | `my-value` |
| `*` | 任意值（通用语法） | 任何合法 CSS 值 |

### 组合语法

- `<length> | <percentage>` — 值可以是多种类型之一（用 `|` 分隔）
- `<color>+` — 接受以空格分隔的多个值
- `<color>#` — 接受以逗号分隔的多个值

## 核心能力：使自定义属性可动画化

普通的 CSS 自定义属性（`--var`）无法被 `transition` 或 `animation` 动画化，因为浏览器不知道它的值类型。通过 `@property` 注册后，浏览器了解了属性的类型信息，就可以对其进行插值计算，从而实现平滑的过渡动画。

```CSS
/* 未注册 —— 无法动画 */
.box {
  --my-color: red;
  background: var(--my-color);
  transition: --my-color 0.3s;
}
.box:hover {
  --my-color: blue; /* 直接跳变，无过渡 */
}

/* 通过 @property 注册 —— 可以动画 */
@property --my-color {
  syntax: "<color>";
  inherits: false;
  initial-value: red;
}
.box {
  background: var(--my-color);
  transition: --my-color 0.3s;
}
.box:hover {
  --my-color: blue; /* 平滑过渡 */
}
```

## JavaScript 等价 API

`@property` 的 CSS 语法等价于 JavaScript 的 `CSS.registerProperty()`：

```JavaScript
CSS.registerProperty({
  name: '--my-color',
  syntax: '<color>',
  inherits: false,
  initialValue: 'red'
});
```

两者效果完全相同，CSS `@property` 的优势在于不需要 JavaScript 执行，在样式表解析阶段就完成注册。

## 使用场景

### 1. 渐变动画

CSS 不支持直接对 `linear-gradient` 进行过渡，但可以通过 `@property` 将渐变中的颜色或角度注册为自定义属性，间接实现渐变动画。

→ 参见 [demo1-gradient-animation.html](./demo1-gradient-animation.html)

### 2. 颜色过渡

为按钮、卡片等组件实现平滑的颜色过渡效果。

→ 参见 [demo2-color-transition.html](./demo2-color-transition.html)

### 3. 数字计数器动画

利用 `<integer>` 类型实现数值递增动画，配合 `counter-reset` 和 `content` 显示。

→ 参见 [demo3-counter-animation.html](./demo3-counter-animation.html)

### 4. 类型安全与初始值

为设计系统中的变量提供类型约束和合理的回退值，防止无效值导致样式失效。

→ 参见 [demo4-type-safety.html](./demo4-type-safety.html)

### 5. 复杂动画效果

结合多个 `@property` 属性实现呼吸灯、波纹扩散等复杂效果。

→ 参见 [demo5-complex-animations.html](./demo5-complex-animations.html)

### 6. 继承控制

通过 `inherits: false` 阻止属性继承，实现组件级别的样式隔离。

→ 参见 [demo6-inheritance.html](./demo6-inheritance.html)

## 注意事项

### 1. 浏览器兼容性

- Chrome 85+、Edge 85+、Safari 16.4+、Firefox 128+ 支持
- 使用前建议通过 `@supports` 检测：

```CSS
@supports (background: paint(something)) {
  /* Houdini 相关特性 */
}
```

或通过 JavaScript 检测：

```JavaScript
if (window.CSS && CSS.registerProperty) {
  // 支持
}
```

### 2. `initial-value` 的限制

- 当 `syntax` 为 `*` 时，`initial-value` 是可选的（如果提供，则为计算值时为空的 guaranteed-invalid value）
- 当 `syntax` 不为 `*` 时，`initial-value` 必须是符合 syntax 类型的合法值
- `initial-value` 不能包含 `var()` 引用

### 3. 重复注册规则

- CSS 中多个同名 `@property` 规则，以​**最后一个**为准（符合正常的 CSS 级联顺序）
- 如果同时通过 CSS `@property` 和 JavaScript ​**`CSS.registerProperty()`** 注册同名属性，​**JavaScript 注册优先**
- JavaScript 的 `CSS.registerProperty()` 对已注册的属性重复调用会抛出错误

### 4. 性能考虑

- 注册过多的自定义属性并对其添加动画可能会影响性能
- 动画化的自定义属性如果被大量元素使用，每个元素都会参与插值计算

### 5. `inherits` 的影响

- `inherits: true` — 子元素会继承父元素的计算值，类似 `color` 属性
- `inherits: false` — 每个元素独立使用 `initial-value`，类似 `border` 属性
- 选择错误的继承行为可能导致意外的样式表现

### 6. 与 `var()` 回退值的区别

```CSS
/* var() 回退：只在变量未定义时生效 */
color: var(--text-color, black);

/* @property initial-value：在变量值无效时也会生效 */
@property --text-color {
  syntax: "<color>";
  inherits: true;
  initial-value: black;
}
```

如果设置 `--text-color: 42px`（不是有效颜色），`@property` 会使用 `initial-value`，而普通 `var()` 回退不会触发。

## 示例文件

| 文件 | 说明 |
| --- | --- |
| [demo1-gradient-animation.html](./demo1-gradient-animation.html) | 渐变动画 |
| [demo2-color-transition.html](./demo2-color-transition.html) | 颜色平滑过渡 |
| [demo3-counter-animation.html](./demo3-counter-animation.html) | 数字计数器动画 |
| [demo4-type-safety.html](./demo4-type-safety.html) | 类型安全与初始值回退 |
| [demo5-complex-animations.html](./demo5-complex-animations.html) | 复杂组合动画 |
| [demo6-inheritance.html](./demo6-inheritance.html) | 继承行为对比 |

## 参考资料

- [MDN - @property](https://developer.mozilla.org/en-US/docs/Web/CSS/@property)
- [CSS Properties and Values API Level 1](https://www.w3.org/TR/css-properties-values-api-1/)
- [Chrome Developers - @property](https://developer.chrome.com/blog/css-custom-properties-evolve/)
