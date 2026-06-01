# CSS Scroll Snap 学习笔记

CSS Scroll Snap 用来控制滚动停止时的位置。它让滚动容器在用户滚动结束后，自动把内容吸附到某些“停靠点”上。常见场景包括横向卡片列表、整屏滚动页面、图片轮播、步骤向导、时间线、双轴画廊、移动端分页浏览等。

过去这类效果经常用 JavaScript 监听 `scroll`，计算每一项的位置，再调用 `scrollTo()` 或修改 `transform`。Scroll Snap 把“滚动结束后应该停在哪里”交给 CSS 描述，浏览器可以继续保留原生滚动的惯性、触摸手势、键盘滚动、滚动条和可访问性行为。

## 示例文件

你可以直接用浏览器打开这些 HTML：

- [01-horizontal-cards.html](./01-horizontal-cards.html)：横向卡片列表，展示最常用的 `scroll-snap-type: x mandatory` 和 `scroll-snap-align`。
- [02-vertical-sections.html](./02-vertical-sections.html)：纵向整屏页面，展示 `scroll-snap-type: y mandatory`。
- [03-padding-margin.html](./03-padding-margin.html)：对比 `scroll-padding` 与 `scroll-margin`，理解吸附位置的偏移。
- [04-snap-stop.html](./04-snap-stop.html)：展示 `scroll-snap-stop: always`，减少快速滑动时跳过关键项。
- [05-two-axis-gallery.html](./05-two-axis-gallery.html)：双轴滚动画廊，展示 `scroll-snap-type: both mandatory`。
- [06-carousel-controls.html](./06-carousel-controls.html)：更接近真实组件的轮播示例，结合按钮、锚点和 CSS Scroll Snap。

Scroll Snap 已经是现代浏览器中相对稳定的能力。建议使用 Chrome、Edge、Firefox 或 Safari 的较新版本查看示例。

## 这个属性解决了什么问题

普通滚动是连续的。用户松手后，内容可能停在任意像素位置：

```CSS
.cards {
  overflow-x: auto;
}
```

这对长文章、表格、地图来说很好，但对“分页式内容”不够理想。比如横向卡片列表中，用户希望每次滚动后有一张卡片完整进入视野，而不是半张卡片卡在左边。

Scroll Snap 的思路是：

```CSS
.cards {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.card {
  scroll-snap-align: start;
}
```

意思是：

- `.cards` 是滚动容器，沿 x 轴开启强制吸附。
- `.card` 是吸附目标，每张卡片都把自己的 start 边作为停靠点。
- 用户滚动结束后，浏览器会选择合适的卡片，把它吸附到容器的 start 位置。

## 核心概念

### Scroll container

Scroll container 是真正发生滚动的元素。它通常有：

```CSS
.scroller {
  overflow-x: auto;
}
```

或者：

```CSS
.scroller {
  height: 100vh;
  overflow-y: auto;
}
```

`scroll-snap-type` 必须写在滚动容器上。

### Snapport

Snapport 可以理解为滚动容器里用于对齐的“目标窗口”。默认情况下，它和滚动容器的可视区域差不多。你可以用 `scroll-padding` 调整这个目标窗口。

例如页面顶部有一个固定导航栏时：

```CSS
.page {
  scroll-padding-top: 72px;
}
```

这样吸附时，目标元素不会被固定导航栏遮住。

### Snap area

Snap area 是某个子项用于吸附的区域。默认接近元素自身的 border box。你可以用 `scroll-margin` 扩大或偏移它。

```CSS
.section {
  scroll-margin-top: 72px;
}
```

这常用于“滚动到标题时预留顶部空间”。

### Snap position

Snap position 是 snap area 和 snapport 对齐后形成的停靠位置。`scroll-snap-align` 决定如何对齐：

```CSS
.item {
  scroll-snap-align: start;
}
```

可以理解为：让这个元素的 start 边对齐到滚动容器目标窗口的 start 边。

## 属性总览

| 名称 | 写在哪里 | 作用 |
| --- | --- | --- |
| `scroll-snap-type` | 滚动容器 | 开启吸附，并指定轴向与强度 |
| `scroll-snap-align` | 吸附子项 | 指定子项如何与容器对齐 |
| `scroll-snap-stop` | 吸附子项 | 控制快速滚动时是否允许跳过该停靠点 |
| `scroll-padding` | 滚动容器 | 调整容器的吸附目标窗口 |
| `scroll-margin` | 吸附子项 | 调整子项的吸附区域 |

## `scroll-snap-type`

`scroll-snap-type` 写在滚动容器上，用来开启 Scroll Snap。

```CSS
.scroller {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

语法：

```CSS
scroll-snap-type: none;
scroll-snap-type: x mandatory;
scroll-snap-type: y proximity;
scroll-snap-type: block mandatory;
scroll-snap-type: inline proximity;
scroll-snap-type: both mandatory;
```

它由两部分组成：

- 轴向：`x`、`y`、`block`、`inline`、`both`
- 强度：`mandatory`、`proximity`

### 轴向

`x` 表示水平方向：

```CSS
.cards {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

`y` 表示垂直方向：

```CSS
.slides {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}
```

`both` 表示水平和垂直两个方向都吸附：

```CSS
.gallery {
  overflow: auto;
  scroll-snap-type: both mandatory;
}
```

`block` 和 `inline` 是逻辑方向，会随 writing mode 变化。普通横排页面里：

- `inline` 大致等于水平方向。
- `block` 大致等于垂直方向。

### 强度

`mandatory` 表示强制吸附。只要附近有合法停靠点，滚动结束后浏览器就会吸过去。

```CSS
.scroller {
  scroll-snap-type: x mandatory;
}
```

它适合卡片轮播、整屏页面、步骤分页等“每次应该停在明确页面”的场景。

`proximity` 表示靠近时才吸附。用户停得离停靠点比较远时，浏览器可以保持原位置。

```CSS
.scroller {
  scroll-snap-type: y proximity;
}
```

它适合文章中的章节、时间线等内容。用户滚动体验更自由，不会每次都被强制拉到某个位置。

## `scroll-snap-align`

`scroll-snap-align` 写在吸附子项上，用来指定子项的哪一侧对齐到容器的 snapport。

```CSS
.card {
  scroll-snap-align: start;
}
```

常见值：

```CSS
scroll-snap-align: none;
scroll-snap-align: start;
scroll-snap-align: center;
scroll-snap-align: end;
scroll-snap-align: start center;
```

单值写法同时作用在 block 和 inline 两个轴上。双值写法第一个值对应 block 轴，第二个值对应 inline 轴：

```CSS
.tile {
  scroll-snap-align: start center;
}
```

在普通横排页面里可以粗略理解为：

- 第一个值控制垂直方向对齐。
- 第二个值控制水平方向对齐。

横向卡片最常用：

```CSS
.card {
  scroll-snap-align: start;
}
```

居中轮播最常用：

```CSS
.slide {
  scroll-snap-align: center;
}
```

整屏页面最常用：

```CSS
.section {
  scroll-snap-align: start;
}
```

## `scroll-padding`

`scroll-padding` 写在滚动容器上，用来调整 snapport。它不是给内容加真实内边距，而是告诉浏览器：吸附时请把这些区域当作需要避开的空间。

```CSS
.scroller {
  scroll-padding-inline: 24px;
}
```

常见写法：

```CSS
scroll-padding: 24px;
scroll-padding-top: 72px;
scroll-padding-inline: 32px;
scroll-padding-block-start: 80px;
```

固定顶部导航的典型写法：

```CSS
.page {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 72px;
}

.section {
  scroll-snap-align: start;
}
```

这样 `.section` 吸附到 start 时，会停在导航栏下方，而不是被导航栏盖住。

## `scroll-margin`

`scroll-margin` 写在吸附子项上，用来调整子项自己的 snap area。

```CSS
.card {
  scroll-margin-inline: 24px;
}
```

常见写法：

```CSS
scroll-margin: 16px;
scroll-margin-top: 72px;
scroll-margin-inline: 24px;
scroll-margin-block-start: 80px;
```

`scroll-padding` 和 `scroll-margin` 的区别：

- `scroll-padding` 改的是滚动容器的目标窗口。
- `scroll-margin` 改的是某个吸附子项的吸附区域。

如果所有子项都要避开固定导航，优先考虑容器上的 `scroll-padding-top`。如果只有某几个子项需要特殊偏移，用对应子项的 `scroll-margin-top`。

## `scroll-snap-stop`

`scroll-snap-stop` 写在吸附子项上，用来影响快速滚动时是否可以跳过某个停靠点。

```CSS
.important-slide {
  scroll-snap-stop: always;
}
```

语法：

```CSS
scroll-snap-stop: normal;
scroll-snap-stop: always;
```

解释：

- `normal`：默认值。快速滑动时，浏览器可以跳过中间的吸附点。
- `always`：浏览器应该在该吸附点停下，不轻易跳过。

它适合必须被看到的关键步骤，比如教程中的确认页、协议阅读节点、 onboarding 中的重要说明等。

注意：这个属性不是“锁住滚动”。用户仍然可以继续滚动到下一项。它只是减少一次快速滚动越过该项的可能。

## 最小示例

```HTML
<div class="scroller">
  <article class="card">A</article>
  <article class="card">B</article>
  <article class="card">C</article>
</div>
```

```CSS
.scroller {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}

.card {
  flex: 0 0 80%;
  scroll-snap-align: start;
}
```

这就是横向卡片吸附的核心代码。

## 常见布局模式

### 横向卡片列表

```CSS
.cards {
  display: flex;
  gap: 16px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 24px;
  padding-inline: 24px;
}

.card {
  flex: 0 0 min(320px, 80vw);
  scroll-snap-align: start;
}
```

### 居中轮播

```CSS
.carousel {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-padding-inline: 50%;
}

.slide {
  flex: 0 0 min(620px, 82vw);
  scroll-snap-align: center;
}
```

居中轮播通常还会给首尾留空间，让第一张和最后一张也能居中。可以用真实 padding，也可以通过伪元素补空间。

### 整屏滚动

```CSS
.page {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.panel {
  min-height: 100vh;
  scroll-snap-align: start;
}
```

整屏滚动要谨慎使用。强制吸附会改变用户浏览长内容的节奏，适合视觉叙事、演示页、作品展示，不一定适合普通文章或表单。

### 固定导航偏移

```CSS
.page {
  height: 100vh;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
  scroll-padding-top: 72px;
}

.section {
  min-height: 100vh;
  scroll-snap-align: start;
}
```

### 双轴画廊

```CSS
.gallery {
  width: 100vw;
  height: 100vh;
  overflow: auto;
  scroll-snap-type: both mandatory;
}

.tile {
  scroll-snap-align: center;
}
```

双轴吸附适合地图式看板、图片墙、产品矩阵等，但交互成本比单轴高。最好保证用户能明显看出可以横向和纵向滚动。

## 和 `scroll-behavior` 的关系

`scroll-snap-*` 决定“滚动结束后停在哪里”。`scroll-behavior` 决定“由程序触发滚动时是否平滑”。

```CSS
.carousel {
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
}
```

当用户点击 `<a href="#slide-3">` 或 JavaScript 调用 `scrollIntoView()` 时，`scroll-behavior: smooth` 会让滚动过程更平滑；Scroll Snap 仍然负责最终吸附位置。

出于可访问性考虑，建议配合 `prefers-reduced-motion`：

```CSS
.carousel {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  .carousel {
    scroll-behavior: auto;
  }
}
```

## 使用建议

- 在滚动容器上写 `overflow` 和 `scroll-snap-type`。
- 在每个需要停靠的子项上写 `scroll-snap-align`。
- 横向列表优先使用 `x mandatory` 或 `inline mandatory`。
- 纵向章节优先考虑 `y proximity`，只有明确分页时再使用 `mandatory`。
- 有固定头部时，用 `scroll-padding-top` 预留吸附空间。
- 单个元素需要额外偏移时，用 `scroll-margin`。
- 不要用 Scroll Snap 阻止用户自由阅读长内容。
- 对轮播、整屏页面等效果，保留键盘可访问性和清晰的焦点样式。
- 对程序触发的平滑滚动，尊重 `prefers-reduced-motion`。

## 常见问题

### 为什么写了 `scroll-snap-align` 没有效果？

通常是因为父元素没有成为滚动容器，或者没有写 `scroll-snap-type`。

```CSS
.scroller {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
}
```

### 为什么吸附位置被固定导航遮住？

在滚动容器上加 `scroll-padding-top`：

```CSS
.page {
  scroll-padding-top: 72px;
}
```

如果是浏览器窗口本身滚动，可以写在 `html` 上：

```CSS
html {
  scroll-padding-top: 72px;
}
```

### `mandatory` 和 `proximity` 怎么选？

如果内容天然是一页一页的，选 `mandatory`。例如轮播、整屏 slide、步骤向导。

如果内容仍然是连续阅读，只是希望靠近标题时更整齐，选 `proximity`。

### 可以只让某些元素参与吸附吗？

可以。只有写了 `scroll-snap-align` 且值不是 `none` 的元素才会成为吸附目标。

```CSS
.chapter {
  scroll-snap-align: start;
}

.paragraph {
  scroll-snap-align: none;
}
```

## 推荐学习顺序

1. 打开 [01-horizontal-cards.html](./01-horizontal-cards.html)，理解容器和子项各自负责什么。
2. 打开 [02-vertical-sections.html](./02-vertical-sections.html)，观察强制纵向吸附。
3. 打开 [03-padding-margin.html](./03-padding-margin.html)，分清 `scroll-padding` 和 `scroll-margin`。
4. 打开 [04-snap-stop.html](./04-snap-stop.html)，快速滚动观察关键项是否更容易停住。
5. 打开 [05-two-axis-gallery.html](./05-two-axis-gallery.html)，理解 `both` 双轴吸附。
6. 打开 [06-carousel-controls.html](./06-carousel-controls.html)，看 Scroll Snap 如何和锚点按钮一起组成真实组件。

## 参考资料

- [W3C CSS Scroll Snap Module Level 1](https://www.w3.org/TR/css-scroll-snap-1/)
- [MDN: CSS scroll snap](https://developer.mozilla.org/docs/Web/CSS/CSS_scroll_snap)
- [MDN: scroll-snap-type](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-type)
- [MDN: scroll-snap-align](https://developer.mozilla.org/docs/Web/CSS/scroll-snap-align)
- [MDN: scroll-padding](https://developer.mozilla.org/docs/Web/CSS/scroll-padding)
- [MDN: scroll-margin](https://developer.mozilla.org/docs/Web/CSS/scroll-margin)
