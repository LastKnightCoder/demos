# CSS `corner-shape` 学习笔记

`corner-shape` 用来设置盒子圆角区域里的“角形状”。它不是用来替代 `border-radius` 的；更准确地说，`border-radius` 先决定角区域有多大，`corner-shape` 再决定这个角区域里的边界曲线长什么样。

普通 `border-radius` 只能得到圆弧或椭圆弧。`corner-shape` 让同一块角区域可以变成圆角、方角、斜切角、凹弧角、内切缺口、squircle，或者任意 `superellipse()` 曲线。

> 本文基于 MDN 当前文档与 CSS Borders and Box Decorations Module Level 4 草案整理。`corner-shape` 仍属于较新的 CSS 能力，生产环境使用前请做兼容性检测。

## 示例文件

你可以直接用浏览器打开这些 HTML：

- [01-basic-shapes.html](./01-basic-shapes.html)：对比 `round`、`squircle`、`square`、`bevel`、`scoop`、`notch`。
- [02-radius-required.html](./02-radius-required.html)：说明为什么必须有非零 `border-radius`。
- [03-per-corner.html](./03-per-corner.html)：演示一到四个值的展开顺序，以及四个角分别设置。
- [04-superellipse.html](./04-superellipse.html)：用 `superellipse()` 连续调节角曲线。
- [05-border-shadow-overflow.html](./05-border-shadow-overflow.html)：观察背景、边框、阴影、`overflow` 裁剪如何跟随角形状。
- [06-animation.html](./06-animation.html)：演示不同角形状之间的动画。

建议使用 Chrome / Edge 较新版本查看。若浏览器不支持，页面会显示兼容性提示，并退化为普通 `border-radius` 效果。

## 它解决了什么问题

过去如果想做非普通圆角，经常要用这些方案：

- `clip-path: polygon(...)` 做斜切角。
- 伪元素覆盖背景，假装挖出一个缺口。
- SVG / mask 实现特殊卡片轮廓。
- 图片或复杂渐变模拟凹角。

这些方案的问题是：边框、背景、阴影、点击区域、裁剪行为经常不能自然跟着走。比如你用 `clip-path` 切了一个角，`box-shadow` 不一定按你想要的轮廓投影；用伪元素挖角时，背景层和真实边框也容易分离。

`corner-shape` 的目标是把这些角形状变成盒模型本身的一部分：

```CSS
.card {
  border: 8px solid #264653;
  border-radius: 32px;
  corner-shape: bevel;
}
```

这表示：元素仍然是一个普通盒子，只是它的圆角区域不再画成圆弧，而是画成斜切角。

## 最重要的一句话

`corner-shape` 只有在对应角有非零 `border-radius` 时才有视觉效果。

```CSS
.no-effect {
  border-radius: 0;
  corner-shape: scoop; /* 没有效果 */
}

.works {
  border-radius: 36px;
  corner-shape: scoop; /* 有效果 */
}
```

原因是 `border-radius` 决定角区域大小。如果半径是 0，这个角区域就是 0，`corner-shape` 没有空间去改变形状。

## 基础语法

```CSS
corner-shape: round;
corner-shape: squircle;
corner-shape: square;
corner-shape: bevel;
corner-shape: scoop;
corner-shape: notch;
corner-shape: superellipse(0.6);
```

它也支持和 `border-radius` 类似的一到四个值：

```CSS
/* 四个角都相同 */
corner-shape: bevel;

/* 左上/右下，右上/左下 */
corner-shape: notch squircle;

/* 左上，右上/左下，右下 */
corner-shape: scoop bevel round;

/* 左上，右上，右下，左下 */
corner-shape: scoop bevel notch squircle;
```

展开顺序是：

1. top-left
2. top-right
3. bottom-right
4. bottom-left

和 `margin`、`padding`、`border-radius` 的四值逻辑保持一致。

## 关键字含义

| 值 | 形状直觉 | 等价的 `superellipse()` |
| --- | --- | --- |
| `round` | 普通圆角/椭圆角，也是默认值 | `superellipse(1)` |
| `squircle` | 比圆角更接近方形的柔和凸角 | `superellipse(2)` |
| `square` | 方角，视觉上类似没有圆角 | `superellipse(infinity)` |
| `bevel` | 斜切角，一条直线连接两边 | `superellipse(0)` |
| `scoop` | 向内凹的圆弧角 | `superellipse(-1)` |
| `notch` | 向内切出的直角缺口 | `superellipse(-infinity)` |

最常用的三个方向：

```CSS
.soft-card {
  border-radius: 32px;
  corner-shape: squircle;
}

.cut-card {
  border-radius: 32px;
  corner-shape: bevel;
}

.ticket {
  border-radius: 24px;
  corner-shape: scoop;
}
```

## `superellipse()` 怎么理解

`superellipse()` 是更底层、更连续的写法。关键字只是常见参数的别名。

```CSS
.box {
  border-radius: 40px;
  corner-shape: superellipse(1.5);
}
```

可以粗略这样理解参数：

- 负值：向内凹。
- `0`：直线斜切，也就是 `bevel`。
- `1`：普通圆角，也就是 `round`。
- 大于 `1`：更饱满、更接近方角。
- 越接近正无穷：越像 `square`。
- 越接近负无穷：越像 `notch`。

示意：

```CSS
.notch-like {
  corner-shape: superellipse(-4);
}

.scoop-like {
  corner-shape: superellipse(-1);
}

.bevel-like {
  corner-shape: superellipse(0);
}

.round-like {
  corner-shape: superellipse(1);
}

.squircle-like {
  corner-shape: superellipse(2);
}
```

## 与 `border-radius` 的关系

`border-radius` 和 `corner-shape` 是一组搭配：

```CSS
.card {
  border-radius: 48px;
  corner-shape: scoop;
}
```

可以把它拆成两步：

1. `border-radius: 48px`：角区域宽高大约是 48px。
2. `corner-shape: scoop`：在这块角区域内，把外边界画成凹弧。

如果你增大 `border-radius`，角形状影响的范围会变大：

```CSS
.small {
  border-radius: 12px;
  corner-shape: bevel;
}

.large {
  border-radius: 56px;
  corner-shape: bevel;
}
```

两者都是斜切角，但第二个切得更明显。

## 每个角单独设置

`corner-shape` 是简写属性。它对应四个物理方向长属性：

```CSS
corner-top-left-shape: scoop;
corner-top-right-shape: bevel;
corner-bottom-right-shape: notch;
corner-bottom-left-shape: squircle;
```

等价于：

```CSS
corner-shape: scoop bevel notch squircle;
```

如果你只想改上边两个角，可以用侧边简写：

```CSS
.panel {
  border-radius: 32px;
  corner-top-shape: bevel;
}
```

如果你只想改左侧两个角：

```CSS
.panel {
  border-radius: 32px;
  corner-left-shape: scoop;
}
```

规范中还定义了逻辑方向版本，例如 `corner-start-start-shape`、`corner-end-end-shape` 等。它们会根据 `writing-mode`、`direction`、`text-orientation` 映射到实际物理角，适合国际化排版或组件库。

## 背景、边框、阴影和裁剪

`corner-shape` 不是单纯的视觉装饰。它会影响盒子相关绘制：

- 背景会按新的角形状绘制。
- 边框会沿新的角形状绘制。
- `box-shadow` 会跟随新的外轮廓。
- `overflow` 裁剪会使用新的角形状。
- `outline` 等效果也会受角形状影响。

例子：

```CSS
.media-card {
  overflow: hidden;
  border: 10px solid #1f3a5f;
  border-radius: 56px;
  corner-shape: scoop;
  box-shadow: 0 24px 45px rgb(31 58 95 / 22%);
}
```

如果卡片内部有图片或渐变背景，角上的内容会被凹形边界裁掉，而不是仍然按照普通圆角裁剪。

## 动画

不同 `corner-shape` 值可以动画过渡，因为关键字会映射到对应的 `superellipse()` 参数。

```CSS
.shape {
  border-radius: 48px;
  animation: morph 4s ease-in-out infinite alternate;
}

@keyframes morph {
  from {
    corner-shape: scoop;
  }

  to {
    corner-shape: squircle;
  }
}
```

也可以直接动画 `superellipse()`：

```CSS
@keyframes tune-corner {
  from {
    corner-shape: superellipse(-1);
  }

  to {
    corner-shape: superellipse(2);
  }
}
```

实际支持情况取决于浏览器版本。动画不支持时，通常会退化为离散变化或普通圆角。

## 兼容性与检测

`corner-shape` 当前不是所有主流浏览器都稳定支持的属性。建议用 `@supports` 包起来：

```CSS
.card {
  border-radius: 32px;
}

@supports (corner-shape: bevel) {
  .card {
    corner-shape: bevel;
  }
}
```

也可以用 JavaScript 检测：

```JavaScript
const supported = CSS.supports("corner-shape: bevel");
```

如果你用了 `superellipse()`，可以单独检测：

```JavaScript
const superellipseSupported = CSS.supports("corner-shape: superellipse(1)");
```

## 渐进增强写法

生产环境里比较稳妥的写法是：先给出普通圆角，再增强为特殊角。

```CSS
.coupon {
  border-radius: 20px;
  background: #fff8e6;
}

@supports (corner-shape: scoop) {
  .coupon {
    corner-shape: scoop;
  }
}
```

这样不支持的浏览器仍然得到一个可接受的普通圆角卡片。

## 常见使用场景

### 斜切角按钮

```CSS
.button {
  border: 2px solid currentColor;
  border-radius: 12px;
  corner-shape: bevel;
  padding: 10px 16px;
}
```

### 票券或优惠券

```CSS
.ticket {
  border-radius: 22px;
  corner-shape: scoop;
  background: #fff4cc;
}
```

### 更接近系统 UI 的柔和卡片

```CSS
.app-card {
  border-radius: 28px;
  corner-shape: squircle;
}
```

### 四角混合的视觉标识

```CSS
.brand-tile {
  border-radius: 40px;
  corner-shape: scoop bevel notch squircle;
}
```

## 和其他方案的区别

### 与 `border-radius`

`border-radius` 控制角区域大小；`corner-shape` 控制角区域形状。

```CSS
.box {
  border-radius: 40px;
  corner-shape: bevel;
}
```

### 与 `clip-path`

`clip-path` 可以裁出复杂轮廓，但它不是专门为盒子角设计的。边框、阴影、背景裁剪等行为不一定像普通盒子一样自然。`corner-shape` 是盒子绘制模型的一部分，因此更适合“只是想改变角”的需求。

### 与 mask / SVG

mask 和 SVG 更强大，但也更重，且常常需要额外资源或更复杂的响应式处理。`corner-shape` 用一行 CSS 就能表达常见角形状。

## 注意事项

- 必须配合非零 `border-radius` 使用。
- 默认值是 `round`，也就是普通 `border-radius` 效果。
- `square` 视觉上像没有圆角，但仍然是 `corner-shape` 的一种可动画形状。
- `bevel` 是直线斜切，不是凹角。
- `scoop` 是凹弧，`notch` 是凹直角。
- 对很小的元素或很小的 `border-radius`，差异可能不明显。
- 当相邻或相对角的半径过大时，浏览器会约束半径，避免角形状互相重叠。
- 生产环境务必使用 `@supports` 做渐进增强。

## 推荐学习顺序

1. 打开 [01-basic-shapes.html](./01-basic-shapes.html)，先建立关键字的视觉直觉。
2. 打开 [02-radius-required.html](./02-radius-required.html)，理解它为什么依赖 `border-radius`。
3. 打开 [03-per-corner.html](./03-per-corner.html)，学习四值语法和单角设置。
4. 打开 [04-superellipse.html](./04-superellipse.html)，理解关键字背后的连续参数。
5. 打开 [05-border-shadow-overflow.html](./05-border-shadow-overflow.html)，观察盒模型相关绘制如何跟随角形状。
6. 打开 [06-animation.html](./06-animation.html)，感受动画过渡。

## 参考资料

- [MDN: corner-shape](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape)
- [MDN: `<corner-shape-value>`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/corner-shape-value)
- [MDN: `superellipse()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/superellipse)
- [CSS Borders and Box Decorations Module Level 4](https://drafts.csswg.org/css-borders-4/#corner-shaping)
