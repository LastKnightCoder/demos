# CSS Gap Decorations：`column-rule` / `row-rule`

这个目录用于说明和演示 CSS Gap Decorations，重点解释 `column-rule` 在 grid、flex、多列布局中的绘制位置。

可以直接用浏览器打开 `index.html`，也可以单独打开任意 demo 文件。

## 简短结论

`column-rule` 默认画在 ​**column gap 的中心线** 上。

如果布局是：

```CSS
column-gap: 24px;
column-rule: 4px solid red;
```

那么 rule 的中心会落在 24px gap 的正中间。4px 宽的 rule 会以这条中心线为基准，左右各占 2px。它不会参与布局，也不会把两侧 item 挤开。

所以 24px gap 可以理解为：

```Plain Text
item | 10px 空白 | 4px rule | 10px 空白 | item
```

`row-rule` 也是同样逻辑：画在 row gap 的中心线上。

## 关键行为

### Rule 不占布局空间

Gap decoration 只是绘制效果，不会增加、减少或预留布局空间。

下面两个布局里，item 的位置是一样的：

```CSS
.a {
  column-gap: 24px;
}

.b {
  column-gap: 24px;
  column-rule: 12px solid red;
}
```

区别只在于 `.b` 会在 gap 中间绘制一条规则线。

### Rule 太宽时会溢出 gap

如果 rule 比 gap 还宽，它仍然围绕 gap 中心线绘制。

```CSS
column-gap: 8px;
column-rule: 20px solid red;
```

20px 的 rule 会从 gap 中心线向左右各扩展 10px。由于 gap 只有 8px，所以它会向左右相邻 item 区域各覆盖 6px。

这对视觉分隔线通常没问题，但如果 item 边缘有文字、图片或按钮，就可能被 rule 盖住。

### `column-rule` 的视觉方向取决于布局

在常见的横向、从左到右的 grid 或 flex row 中，`column-rule` 看起来像列之间的竖线。

但 “column” 是逻辑概念，不一定永远等于视觉上的竖线：

- `writing-mode` 会改变视觉方向。
- Grid 的 row gap 和 column gap 跟随 grid tracks。
- Flex 的 gap 取决于 `flex-direction` 和换行情况。
- 多列文本布局中的 `column-rule` 画在文本列之间。

更准确的理解是：`column-rule` 是 “column gap 的装饰线”，而不是 “永远垂直的线”。

## 主要属性

### `column-rule`

控制 column gap 的装饰线。

```CSS
.layout {
  column-gap: 24px;
  column-rule: 1px solid #64748b;
}
```

它也可以拆成 longhand：

```CSS
column-rule-width: 1px;
column-rule-style: solid;
column-rule-color: #64748b;
```

### `row-rule`

控制 row gap 的装饰线。

```CSS
.layout {
  row-gap: 24px;
  row-rule: 1px dashed #64748b;
}
```

它也可以拆成 longhand：

```CSS
row-rule-width: 1px;
row-rule-style: dashed;
row-rule-color: #64748b;
```

### `rule`

同时设置 row rule 和 column rule 的简写。

```CSS
.layout {
  gap: 24px;
  rule: 1px solid #64748b;
}
```

### `rule-inset`

控制 rule 线段从两端向内缩进多少。

注意：`rule-inset` 不会把 rule 从 gap 中心线挪开，它改变的是 rule 线段的长度。

```CSS
.layout {
  gap: 24px;
  rule: 2px solid #0f766e;
  rule-inset: 12px;
}
```

也可以分别设置行列方向：

```CSS
row-rule-inset: 12px;
column-rule-inset: 12px;
```

### `rule-break`

控制 row rule 和 column rule 在 gap 交叉点处如何连接或断开。

当 grid 同时设置了 row rule 和 column rule，并且你关心交叉点样式时，可以使用它。

```CSS
.layout {
  gap: 24px;
  row-rule: 2px solid #64748b;
  column-rule: 2px solid #64748b;
  rule-break: intersection;
}
```

这个能力比较新，目标浏览器是否支持、支持哪些值，建议用 `CSS.supports()` 实测。

## 浏览器特性检测

用 `CSS.supports()` 检测时，要用真正消费该语法的 CSS 属性：

```JavaScript
CSS.supports("column-rule", "2px solid red");
CSS.supports("row-rule", "2px solid red");
CSS.supports("rule", "2px solid red");
```

对于 grid/flex 的 gap decoration，检测 `row-rule` 往往更有参考价值。因为传统的 `column-rule` 很早就存在于多列布局里，一个浏览器可能认识 `column-rule`，但还不支持新的完整 gap decorations 行为。

CSS 里也可以用 `@supports`：

```CSS
@supports (row-rule: 1px solid red) {
  .layout {
    row-rule: 1px solid red;
  }
}
```

## 渐进增强写法

如果需要兼容旧浏览器，可以用 border 或伪元素做 fallback，再把新的 rule 写法放进 `@supports`。

```CSS
.item {
  border-inline-end: 1px solid #d0d7de;
}

@supports (row-rule: 1px solid #d0d7de) {
  .item {
    border-inline-end: 0;
  }

  .layout {
    gap: 24px;
    rule: 1px solid #d0d7de;
  }
}
```

这样旧浏览器仍然有可用的视觉分隔，新浏览器则使用真正的 gap decorations。

## Demo 文件

- `index.html`：演示导航和浏览器支持检测。
- `01-centerline.html`：可视化说明 `column-rule` 画在 gap 中心线。
- `02-overflow.html`：展示 rule 比 gap 宽时会覆盖到 item。
- `03-grid-row-column.html`：展示 `row-rule`、`column-rule` 和 `rule` 简写。
- `04-inset-breaks.html`：展示 `rule-inset` 和 rule 交叉点行为。
- `05-flex-multicol.html`：对比 flex、grid、多列文本中的 rule。

## 参考资料

- Chrome Developers：CSS Gap Decorations stable
  
  - [https://developer.chrome.com/blog/gap-decorations-stable](https://developer.chrome.com/blog/gap-decorations-stable)
- CSS Gaps Module Level 1 Editor's Draft
  
  - [https://drafts.csswg.org/css-gaps-1/](https://drafts.csswg.org/css-gaps-1/)
- MDN：`column-rule`
  
  - [https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule](https://developer.mozilla.org/en-US/docs/Web/CSS/column-rule)
