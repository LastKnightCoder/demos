# CSS shape-outside 属性

## 简介

`shape-outside` 是一个 CSS 属性，用于定义浮动元素周围的文本环绕形状。默认情况下，文本会沿着浮动元素的矩形边界框（margin-box）进行环绕，而 `shape-outside` 允许你自定义环绕的形状，使文本可以沿着圆形、椭圆、多边形甚至图片的轮廓进行排列。

## 基本语法

```CSS
shape-outside: none | <basic-shape> | <shape-box> | <image>;
```

`shape-outside` 接受四种类型的值：

1. ​**none** — 默认值，不应用任何自定义形状，文字按矩形边界环绕
2. ​**基本形状函数** — `circle()`、`ellipse()`、`polygon()`、`inset()`
3. ​**盒模型关键字** — `margin-box`、`border-box`、`padding-box`、`content-box`
4. ​**图片** — `url()` 或 CSS 渐变（`linear-gradient`、`radial-gradient` 等）

---

## 前提条件

`shape-outside` 有严格的生效条件，缺一不可：

```CSS
.element {
  float: left;          /* 必须：元素必须浮动 */
  width: 200px;         /* 必须：需要明确的宽度 */
  height: 200px;        /* 必须：需要明确的高度 */
  shape-outside: circle(50%);
}
```

- ​**必须设置 **​**`float`** — `shape-outside` 只对浮动元素生效。对非浮动元素设置此属性不会有任何效果。
- ​**必须有确定的尺寸** — 元素必须有明确的 `width` 和 `height`，因为形状函数中的百分比值需要参照元素尺寸来计算。
- ​**只影响行内内容的环绕** — `shape-outside` 只改变周围行内内容（文本、inline/inline-block 元素）的排列方式，不会影响块级元素的定位。

---

## 基本形状函数详解

### circle()

定义一个圆形的环绕区域。

```CSS
shape-outside: circle(<radius> at <position>);
```

​**参数说明：**

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `<radius>` | 圆的半径，可以是长度值、百分比或关键字 | `50%`、`100px` |
| `at <position>` | 圆心位置，可选，默认为元素中心 | `at 50% 50%`、`at center` |

​**半径关键字：**

- `closest-side` — 使用圆心到最近边的距离作为半径
- `farthest-side` — 使用圆心到最远边的距离作为半径

​**百分比计算方式：** 圆的半径百分比基于参考框的宽高计算：`sqrt(width² + height²) / sqrt(2)`。对于正方形元素，50% 就等于边长的一半。

```CSS
/* 基本圆形，半径为元素对角线的 50% */
shape-outside: circle(50%);

/* 使用具体像素值 */
shape-outside: circle(100px);

/* 指定圆心在左上角 */
shape-outside: circle(50% at 0% 0%);

/* 使用关键字 */
shape-outside: circle(closest-side at 30% 50%);
```

​**典型用法：** 配合 `border-radius: 50%` 使元素显示为圆形，并让文字沿圆形边缘环绕。

---

### ellipse()

定义一个椭圆形的环绕区域，与 `circle()` 类似但有两个独立的半径。

```CSS
shape-outside: ellipse(<rx> <ry> at <position>);
```

​**参数说明：**

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `<rx>` | 水平半径（X 轴方向） | `50%`、`120px` |
| `<ry>` | 垂直半径（Y 轴方向） | `50%`、`80px` |
| `at <position>` | 椭圆中心位置，可选 | `at 50% 50%` |

​**半径关键字同样适用：** `closest-side` 和 `farthest-side` 可分别应用于水平和垂直方向。

```CSS
/* 宽扁椭圆 */
shape-outside: ellipse(60% 40%);

/* 窄高椭圆 */
shape-outside: ellipse(40% 60%);

/* 使用关键字组合 */
shape-outside: ellipse(closest-side farthest-side at 50% 50%);
```

​**与 circle 的区别：** 当元素不是正方形时，`circle(50%)` 仍然生成正圆（基于对角线计算），而 `ellipse(50% 50%)` 会生成贴合元素宽高的椭圆。如果元素是正方形，两者效果一样。

---

### polygon()

定义任意多边形的环绕区域，通过一系列顶点坐标描述形状。

```CSS
shape-outside: polygon(<fill-rule>, <point1>, <point2>, ..., <pointN>);
```

​**参数说明：**

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `<fill-rule>` | 填充规则，可选，默认 `nonzero` | `nonzero`、`evenodd` |
| `<point>` | 顶点坐标，格式为 `x% y%` 或 `Xpx Ypx` | `50% 0%` |

​**坐标系：** 以元素的参考框左上角为原点 (0% 0%)，右下角为 (100% 100%)。

```CSS
/* 三角形 */
shape-outside: polygon(50% 0%, 0% 100%, 100% 100%);

/* 菱形 */
shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);

/* L 形 */
shape-outside: polygon(0% 0%, 50% 0%, 50% 50%, 100% 50%, 100% 100%, 0% 100%);

/* 混合使用百分比和像素 */
shape-outside: polygon(0px 0px, 200px 0px, 150px 300px, 0px 300px);
```

​**配合 **​**`clip-path`**​** 使用：** `polygon()` 定义的是环绕形状，元素本身仍然是矩形。如果希望元素的可见形状也变成多边形，需要使用相同值设置 `clip-path`：

```CSS
.element {
  float: left;
  width: 200px;
  height: 200px;
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

---

### inset()

定义一个从元素边缘向内收缩的矩形环绕区域，可以带圆角。

```CSS
shape-outside: inset(<top> <right> <bottom> <left> round <border-radius>);
```

​**参数说明：**

| 参数 | 说明 | 示例 |
| --- | --- | --- |
| `<top/right/bottom/left>` | 从各边向内缩进的距离，遵循 margin 简写规则 | `10px`、`10px 20px` |
| `round <border-radius>` | 可选，矩形的圆角，语法同 `border-radius` | `round 20px`、`round 50%` |

```CSS
/* 四边各缩进 10px */
shape-outside: inset(10px);

/* 上下 10px，左右 20px */
shape-outside: inset(10px 20px);

/* 带圆角 */
shape-outside: inset(0px round 20px);

/* 圆角矩形，模拟胶囊形状 */
shape-outside: inset(0px round 50px);

/* round 50% 等效于 circle/ellipse */
shape-outside: inset(0px round 50%);
```

​**使用场景：** 当元素有 `border-radius` 时，默认的矩形环绕不会跟随圆角，文字会在圆角处留出多余空白。使用 `inset(0px round <同样的圆角值>)` 可以让文字贴合圆角环绕。

---

## 盒模型关键字

盒模型关键字让文字沿着元素的某一个盒子边界环绕，在元素有 `border-radius` 时尤其有用：

```CSS
shape-outside: margin-box;  /* 默认值，沿外边距框环绕 */
shape-outside: border-box;  /* 沿边框外边缘环绕 */
shape-outside: padding-box; /* 沿内边距外边缘环绕 */
shape-outside: content-box; /* 沿内容框环绕 */
```

​**与 border-radius 配合：** 当元素设置了 `border-radius` 时，这些盒模型关键字会让环绕形状跟随对应盒子的圆角形状，而不是简单的矩形。

```CSS
.rounded-card {
  float: left;
  width: 200px;
  height: 200px;
  border-radius: 30px;
  shape-outside: border-box; /* 文字会沿圆角边缘环绕 */
}
```

​**各盒子的区别：**

```
┌─────────────────── margin-box ───────────────────┐
│  ┌─────────────── border-box ──────────────────┐ │
│  │  ┌─────────── padding-box ────────────────┐ │ │
│  │  │  ┌─────── content-box ──────────────┐  │ │ │
│  │  │  │                                  │  │ │ │
│  │  │  └──────────────────────────────────┘  │ │ │
│  │  └────────────────────────────────────────┘ │ │
│  └─────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

盒模型关键字也可以与基本形状函数组合，作为形状的参考框：

```CSS
/* 以 content-box 为参考框计算圆形 */
shape-outside: circle(50%) content-box;

/* 以 border-box 为参考框计算多边形 */
shape-outside: polygon(0% 0%, 100% 0%, 100% 100%) border-box;
```

---

## 图片形状

使用图片的 Alpha 通道（透明度信息）来定义环绕形状。

```CSS
shape-outside: url('shape.png');
shape-outside: url('shape.svg');
shape-outside: linear-gradient(...);
shape-outside: radial-gradient(...);
```

​**工作原理：** 浏览器读取图片的每个像素，根据 `shape-image-threshold` 的设定，将 Alpha 值超过阈值的区域视为形状内部，低于阈值的区域视为形状外部。文字只能出现在形状外部。

​**支持的图片来源：**

- 外部图片文件（PNG、SVG 等，必须符合 CORS 同源策略）
- Data URI 内联图片
- CSS 渐变函数（`linear-gradient`、`radial-gradient`、`conic-gradient`）

```CSS
/* 外部 PNG（需要同源或 CORS 头） */
shape-outside: url('silhouette.png');

/* 内联 SVG */
shape-outside: url('data:image/svg+xml,<svg>...</svg>');

/* CSS 径向渐变：中心圆形不透明，外围透明 */
shape-outside: radial-gradient(circle, black 50%, transparent 50%);

/* CSS 线性渐变：左半不透明，右半透明 */
shape-outside: linear-gradient(to right, black 50%, transparent 50%);
```

​**CORS 限制：** 使用外部图片时，图片必须与页面同源，或者图片服务器必须返回正确的 CORS 响应头 (`Access-Control-Allow-Origin`)。否则浏览器无法读取像素数据，形状不会生效。使用 CSS 渐变或 Data URI 可以绕过此限制。

---

## 配合使用的 CSS 属性

### shape-margin

在 `shape-outside` 定义的形状外部添加额外间距，让文字不会紧贴形状边缘。

```CSS
shape-margin: <length> | <percentage>;
```

​**特点：**

- 间距沿形状轮廓均匀扩展（不是矩形的 margin）
- 值不能为负数
- 百分比相对于元素包含块的行内尺寸（通常是宽度）计算
- 扩展后的形状会被限制在元素的 margin-box 内，不会超出

```CSS
.circle-element {
  float: left;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  shape-outside: circle(50%);
  shape-margin: 15px; /* 文字与圆形保持 15px 距离 */
}
```

​**shape-margin vs margin：**

| 对比项 | margin | shape-margin |
| --- | --- | --- |
| 作用目标 | 元素的矩形盒子 | shape-outside 定义的形状 |
| 扩展形状 | 矩形扩展 | 沿轮廓均匀扩展 |
| 适用条件 | 任何元素 | 必须已设置 shape-outside |
| 对尖角的影响 | 无 | 会将尖角变为圆滑 |

---

### shape-image-threshold

当使用图片或渐变作为 `shape-outside` 的值时，设置 Alpha 通道的提取阈值。

```CSS
shape-image-threshold: <number>; /* 0.0 到 1.0 */
```

​**工作原理：**

- 值为 0.0 — 完全透明的像素也被视为形状内部（几乎所有区域都算形状）
- 值为 0.5 — Alpha > 50% 的像素被视为形状内部（推荐的默认值）
- 值为 1.0 — 只有完全不透明的像素才被视为形状内部

```CSS
.gradient-shape {
  float: left;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #333 0%, transparent 70%);
  shape-outside: radial-gradient(circle, black 0%, transparent 70%);
  shape-image-threshold: 0.5; /* Alpha > 50% 的区域为形状 */
}
```

​**调节效果：** 对于有渐变过渡的图片，调整 threshold 值可以控制形状的大小——值越小形状越大（更多区域被纳入），值越大形状越小（只有高不透明度区域纳入）。

---

### clip-path（配合使用）

`clip-path` 不属于 shape-outside 的一部分，但在使用 `polygon()` 时几乎必须配合使用。

​**原因：** `shape-outside` 只改变文字的环绕路径，不改变元素的可见形状。如果元素仍然显示为矩形，而文字却沿着多边形环绕，视觉上会不协调。

```CSS
.diamond {
  float: left;
  width: 200px;
  height: 200px;
  background: #667eea;

  /* clip-path 裁切可见形状 */
  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);

  /* shape-outside 定义文字环绕形状，使用相同的值 */
  shape-outside: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
}
```

---

### float（前提条件）

`shape-outside` 的硬性前提，元素必须浮动：

```CSS
float: left;  /* 文字从右侧环绕 */
float: right; /* 文字从左侧环绕 */
```

没有 float 时 shape-outside 完全不生效。目前没有其他布局方式（如 flexbox、grid）可以替代 float 来触发 shape-outside。

---

### border-radius（配合使用）

当使用 `circle()`、`ellipse()` 或 `inset(... round ...)` 时，通常需要让元素的可见形状与环绕形状匹配：

```CSS
.circle {
  float: left;
  width: 200px;
  height: 200px;
  border-radius: 50%;           /* 可见形状为圆 */
  shape-outside: circle(50%);   /* 环绕形状为圆 */
}

.rounded-rect {
  float: left;
  width: 200px;
  height: 150px;
  border-radius: 20px;              /* 可见形状为圆角矩形 */
  shape-outside: inset(0 round 20px); /* 环绕形状跟随圆角 */
}
```

---

## 使用场景

### 1. 杂志风格排版

让文本沿着圆形头像环绕，模拟印刷媒体的排版效果：

```CSS
.avatar {
  float: left;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  shape-outside: circle(50%);
  shape-margin: 15px;
}
```

### 2. 图片轮廓环绕

让文字紧贴产品图片的实际轮廓而非矩形边框，适合电商展示：

```CSS
.product-image {
  float: left;
  width: 300px;
  height: 400px;
  shape-outside: url('product-silhouette.png');
  shape-image-threshold: 0.5;
  shape-margin: 10px;
}
```

### 3. 创意几何布局

使用多边形创建不规则的文本流动效果：

```CSS
.decorative {
  float: right;
  width: 200px;
  height: 300px;
  clip-path: polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%);
  shape-outside: polygon(0% 0%, 100% 20%, 100% 80%, 0% 100%);
  shape-margin: 12px;
}
```

### 4. 对角线/斜切布局

使用渐变或多边形创建现代感的斜切分割：

```CSS
.diagonal-section {
  float: left;
  width: 50%;
  height: 400px;
  shape-outside: polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%);
  clip-path: polygon(0% 0%, 100% 0%, 80% 100%, 0% 100%);
}
```

---

## 注意事项

### 形状必须覆盖可见区域

`shape-outside` 定义的形状如果小于元素的可见区域，文字会侵入可见元素内部。始终确保形状 >= 可见边界：

```CSS
/* 错误：形状比可见圆形小，文字会覆盖到圆上 */
.bad {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  shape-outside: circle(30%); /* 形状太小！ */
}

/* 正确：形状匹配可见区域，用 shape-margin 控制间距 */
.good {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  shape-outside: circle(50%);
  shape-margin: 15px;
}
```

### 不影响元素自身的渲染

`shape-outside` 只影响周围内容的排列方式，不会改变元素自身的外观、大小或位置。元素本身仍然占据矩形空间（除非配合 `clip-path`）。

### 浮动容器需要清除浮动

使用 shape-outside 的浮动元素仍然遵循浮动规则，父容器需要清除浮动（clearfix）来正确包含内容：

```CSS
.container::after {
  content: "";
  display: block;
  clear: both;
}
```

### 动画支持

`shape-outside` 支持在相同类型的形状之间进行 CSS 动画/过渡（如从一个 circle 过渡到另一个 circle），但不支持在不同类型之间过渡（如从 circle 到 polygon）。

```CSS
.element {
  shape-outside: circle(50%);
  transition: shape-outside 0.3s ease;
}
.element:hover {
  shape-outside: circle(40%);
}
```

### 浏览器兼容性

- Chrome 37+、Firefox 62+、Safari 10.1+、Edge 79+ 均已支持
- IE 浏览器完全不支持
- 移动端：iOS Safari 10.3+、Android Chrome 37+

---

## 示例文件

| 文件 | 说明 |
| --- | --- |
| [01-circle.html](./01-circle.html) | 使用 `circle()` 创建圆形环绕 |
| [02-ellipse.html](./02-ellipse.html) | 使用 `ellipse()` 创建椭圆环绕 |
| [03-polygon.html](./03-polygon.html) | 使用 `polygon()` 创建多边形环绕 |
| [04-inset.html](./04-inset.html) | 使用 `inset()` 创建圆角矩形环绕 |
| [05-image.html](./05-image.html) | 使用图片 Alpha 通道定义环绕形状 |
| [06-shape-margin.html](./06-shape-margin.html) | 使用 `shape-margin` 控制文字与形状的间距 |
| [07-multiple-shapes.html](./07-multiple-shapes.html) | 组合多个形状的综合示例 |
