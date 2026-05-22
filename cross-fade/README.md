# CSS `cross-fade()` 函数详解和示例

这个目录是一组用于学习 CSS `cross-fade()` 的示例。你可以直接在浏览器中打开 `index.html`，再进入各个 HTML 页面观察效果。

> 兼容性提醒：截至 2026 年 5 月，`cross-fade()` 仍不是一个可以无脑用于所有浏览器的 Baseline 特性。MDN 明确标记为 Limited availability，并说明标准语法和当前实现语法不同。实际项目中建议始终提供 fallback。

## 文件说明

- `index.html`：示例入口页，并检测当前浏览器是否支持旧语法和标准语法。
- `01-basic-slider.html`：用滑块控制两张图的混合百分比。
- `02-percentages.html`：并排展示 0%、25%、50%、75%、100% 的效果。
- `03-tint-and-highlight.html`：把图片和色彩图层混合，用于调色、暗角、强调区域。
- `04-standard-syntax.html`：展示 CSS Images Level 4 标准语法，包括多个图像参数。
- `05-progressive-enhancement.html`：展示推荐的渐进增强写法。
- `assets/`：本地 SVG 素材，避免依赖外部图片服务。
- `shared.css`：示例页的通用样式。

## `cross-fade()` 是什么

`cross-fade()` 是 CSS 的图像函数，返回值属于 CSS `<image>` 类型。它的作用是把两个或多个图像按照指定百分比混合成一个新的图像值。

因为它返回的是 `<image>`，所以理论上可以用在任何接受 CSS 图像的地方，例如：

```CSS
.box {
  background-image: cross-fade(url("a.png") 50%, url("b.png") 50%);
}
```

常见用途：

- 在两个背景图之间生成一个中间状态。
- 把图片和颜色、渐变、遮罩图混合，做调色效果。
- 生成 hover、选中态、主题切换中的中间图像。
- 在不额外叠加 DOM 的情况下，完成一些简单的图像处理。

## 两套语法：标准语法和旧实现语法

学习 `cross-fade()` 最容易混乱的地方，是规范语法和浏览器已实现语法不一致。

### 1. 标准语法

CSS Images Module Level 4 定义的标准语法大致是：

```CSS
cross-fade( <image-or-color> <percentage>?, <image-or-color> <percentage>? ... )
```

示例：

```CSS
background-image: cross-fade(
  url("mountain.svg") 75%,
  url("city.svg") 25%
);
```

百分比写在每个图像后面，表示这个图像保留多少不透明度权重。

标准语法还允许两个以上的图像：

```CSS
background-image: cross-fade(
  url("red.png") 33.33%,
  url("green.png") 33.33%,
  url("blue.png") 33.33%
);
```

也可以省略某些百分比。省略位置没有限制，不是只能省略最后一个，也不是只能省略一个：

```CSS
background-image: cross-fade(
  url("mountain.svg") 65%,
  url("city.svg")
);
```

这里第二张图省略了百分比。规范规则是：把已声明的百分比加起来，从 `100%` 中减掉，剩余部分平均分配给所有省略百分比的参数。所以第二张图会得到 `35%`。

### 2. 旧实现语法

当前更容易在 Chromium/Safari 系浏览器中看到效果的是旧语法：

```CSS
background-image: -webkit-cross-fade(
  url("mountain.svg"),
  url("city.svg"),
  75%
);
```

旧语法的特点：

- 只支持两个图像参数。
- 百分比是第三个参数。
- 第三个百分比表示第一张图的保留量。
- 第二张图自动使用剩余比例。
- 在 Chromium 等 Blink 浏览器中通常需要 `-webkit-` 前缀。

也就是说，在 Chrome/Edge 这类 Chromium 浏览器中，旧语法通常要写成 `-webkit-cross-fade(...)`，而不是无前缀的 `cross-fade(...)`。无前缀的 `cross-fade(...)` 对应的是标准语法，参数写法也不一样。

例如：

```CSS
background-image: -webkit-cross-fade(url("a.png"), url("b.png"), 25%);
```

这表示：

- `a.png` 保留 `25%`
- `b.png` 保留 `75%`

## 百分比规则

在最常见的两图混合场景中，可以把百分比理解为第一张图的不透明度：

```CSS
-webkit-cross-fade(url("white.png"), url("black.png"), 0%);   /* 完全是 black.png */
-webkit-cross-fade(url("white.png"), url("black.png"), 25%);  /* 25% white + 75% black */
-webkit-cross-fade(url("white.png"), url("black.png"), 50%);  /* 50% white + 50% black */
-webkit-cross-fade(url("white.png"), url("black.png"), 75%);  /* 75% white + 25% black */
-webkit-cross-fade(url("white.png"), url("black.png"), 100%); /* 完全是 white.png */
```

标准语法中可以写得更明确：

```CSS
cross-fade(url("white.png") 25%, url("black.png") 75%);
```

也可以省略第二个百分比：

```CSS
cross-fade(url("white.png") 25%, url("black.png"));
```

## 与 `opacity`、多背景、`background-blend-mode` 的区别

`cross-fade()` 不是设置元素透明度，也不是简单的背景叠加。

### 和 `opacity` 的区别

`opacity` 作用在整个元素上，包括文字、边框、子元素等：

```CSS
.card {
  opacity: .5;
}
```

`cross-fade()` 只生成一个图像值，通常只影响 `background-image` 这一层：

```CSS
.card {
  background-image: cross-fade(url("a.png") 50%, url("b.png") 50%);
}
```

### 和多背景的区别

多背景会把多个背景层叠在一起：

```CSS
.box {
  background-image: url("overlay.png"), url("photo.png");
}
```

`cross-fade()` 会先把图像混合成一个结果图像：

```CSS
.box {
  background-image: cross-fade(url("overlay.png") 20%, url("photo.png") 80%);
}
```

### 和 `background-blend-mode` 的区别

`background-blend-mode` 控制多层背景之间的混合算法，例如 `multiply`、`screen`、`overlay`：

```CSS
.box {
  background-image: linear-gradient(#f00, #00f), url("photo.png");
  background-blend-mode: multiply;
}
```

`cross-fade()` 的重点是按百分比做透明度混合。它不是 Photoshop 式的混合模式选择器。

## 推荐的渐进增强写法

因为兼容性仍然不统一，生产代码必须先写普通图片作为 fallback。Chrome/Edge 当前主要依赖带前缀的旧语法 `-webkit-cross-fade()`；Safari 对标准语法支持更靠前，但实际项目仍建议同时考虑 fallback。教学示例里可以同时保留标准语法和旧语法，如果你的目标是让当前 Chromium/Safari 更稳定地显示效果，建议把 `-webkit-cross-fade()` 放在最后覆盖：

```CSS
.hero {
  --mix: 60%;

  /* 1. 所有浏览器都能显示的 fallback */
  background-image: url("fallback.svg");

  /* 2. 标准语法，表达规范写法 */
  background-image: cross-fade(
    url("a.svg") var(--mix),
    url("b.svg")
  );

  /* 3. 当前更常见、实际更容易绘制成功的旧实现语法 */
  background-image: -webkit-cross-fade(
    url("a.svg"),
    url("b.svg"),
    var(--mix)
  );
}
```

也可以用 `@supports` 分开写，代码意图更清楚：

```CSS
.hero {
  --mix: 60%;
  background-image: url("fallback.svg");
}

@supports (background-image: cross-fade(url("a.svg") 50%, url("b.svg") 50%)) {
  .hero {
    background-image: cross-fade(url("a.svg") var(--mix), url("b.svg"));
  }
}

@supports (background-image: -webkit-cross-fade(url("a.svg"), url("b.svg"), 50%)) {
  .hero {
    background-image: -webkit-cross-fade(url("a.svg"), url("b.svg"), var(--mix));
  }
}
```

这个仓库的 `05-progressive-enhancement.html` 就使用了这种方式。

## 使用 CSS 自定义属性控制比例

`cross-fade()` 的百分比可以配合 CSS 自定义属性使用：

```CSS
.preview {
  --mix: 40%;
  background-image: -webkit-cross-fade(url("a.svg"), url("b.svg"), var(--mix));
}
```

再通过 JavaScript 或交互状态修改变量：

```JavaScript
document.querySelector(".preview").style.setProperty("--mix", "75%");
```

这适合做滑块、主题切换、局部预览等效果。`01-basic-slider.html` 和 `03-tint-and-highlight.html` 都演示了这个模式。

## 标准语法中的省略百分比

标准语法允许省略参数百分比。省略规则比“省略最后一个”更灵活：

- 可以省略任意位置的百分比。
- 可以只省略一个，也可以省略多个。
- 如果省略多个，剩余比例会平均分配给所有省略项。
- 如果已写出的百分比总和超过 `100%`，用于补全省略项的剩余比例按 `0%` 计算。

规则可以这样理解：

1. 先统计已经写出来的百分比。
2. 用 `100%` 减去已经写出的总和；如果结果小于 `0%`，按 `0%` 处理。
3. 把剩余值平均分配给没有写百分比的图像。

例如：

```CSS
cross-fade(url("a.png") 20%, url("b.png"), url("c.png"));
```

结果是：

- `a.png`：`20%`
- `b.png`：`40%`
- `c.png`：`40%`

省略项不必放在最后。例如：

```CSS
cross-fade(url("a.png"), url("b.png") 30%, url("c.png"));
```

已写出的比例是 `30%`，剩余 `70%` 平均分给 `a.png` 和 `c.png`。结果是：

- `a.png`：`35%`
- `b.png`：`30%`
- `c.png`：`35%`

如果完全不写百分比：

```CSS
cross-fade(url("a.png"), url("b.png"), url("c.png"));
```

三个图像会平均分配，大约各 `33.33%`。

如果已写出的百分比总和超过 `100%`，省略项会先补成 `0%`：

```CSS
cross-fade(url("a.png") 80%, url("b.png") 40%, url("c.png"));
```

这里 `80% + 40% = 120%`，已经超过 `100%`，所以 `c.png` 的省略百分比补为 `0%`。随后绘制阶段还会按照规范处理总和超过 `100%` 的情况。

## 当百分比总和不是 100% 时

标准规范还定义了更复杂的情况：

- 如果总和小于 `100%`，剩余部分相当于透明图像参与混合。
- 如果总和大于 `100%`，绘制时会按比例归一化。

例如：

```CSS
cross-fade(url("a.png") 75%, url("b.png") 75%);
```

两个百分比总和是 `150%`。标准规范会把绘制权重归一化处理。不过注意，旧实现语法没有这种能力，因为旧语法只能接收两个图像和一个百分比。

## 常见坑

### 1. 忘记提供 fallback

错误示例：

```CSS
.box {
  background-image: cross-fade(url("a.png") 50%, url("b.png") 50%);
}
```

在不支持标准语法的浏览器中，这条声明会被忽略，背景可能变成空白。

更稳妥：

```CSS
.box {
  background-image: url("b.png");
  background-image: cross-fade(url("a.png") 50%, url("b.png") 50%);
  background-image: -webkit-cross-fade(url("a.png"), url("b.png"), 50%);
}
```

### 2. 把旧语法和标准语法混在一起

这是旧语法：

```CSS
-webkit-cross-fade(url("a.png"), url("b.png"), 50%);
```

这是标准语法：

```CSS
cross-fade(url("a.png") 50%, url("b.png") 50%);
```

下面这种写法不是标准语法：

```CSS
cross-fade(url("a.png"), url("b.png"), 50%);
```

虽然某些文档或浏览器历史实现中能看到类似形式，但写现代代码时应该明确区分。

### 3. 以为它会自动产生动画

`cross-fade()` 只描述某一个时刻的混合图像。它本身不会自动动画。

如果要动画，你需要改变百分比，例如：

```CSS
.box {
  --mix: 0%;
  background-image: -webkit-cross-fade(url("a.png"), url("b.png"), var(--mix));
}
```

再通过 JavaScript、CSS 动画或交互改变 `--mix`。由于不同浏览器对在图像函数中动画自定义属性的支持不完全一致，教学和生产中用 JavaScript 更新变量通常更直观。

### 4. 把重要信息只放在背景图里

背景图不会被屏幕阅读器作为内容朗读。如果混合后的图像承载了重要信息，应在 HTML 中提供文字说明，或使用语义化内容。

## 浏览器兼容性建议

实践建议：

- 做学习和实验：优先用 Chrome、Edge 或 Safari 打开这些 demo。
- 做生产项目：始终提供普通 `url()` fallback。
- 面向多浏览器：不要只依赖标准 `cross-fade()`，也不要假设 Firefox 已支持。
- 需要精确跨浏览器视觉一致性：考虑用两个元素叠加并分别控制 `opacity`，这是更传统也更可控的方式。

## 传统双层 `opacity` 替代方案

如果你需要在所有现代浏览器中稳定做两张图的淡入淡出，可以使用伪元素或两个 DOM 层：

```CSS
.photo {
  position: relative;
  background-image: url("a.png");
}

.photo::after {
  content: "";
  position: absolute;
  inset: 0;
  background-image: url("b.png");
  background-size: cover;
  background-position: center;
  opacity: .4;
}
```

这个方法不是 `cross-fade()`，但兼容性更好，适合需要稳定上线的效果。

## 参考资料

- MDN：[https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/cross-fade](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/cross-fade)
- CSS Images Module Level 4：[https://drafts.csswg.org/css-images-4/#cross-fade-function](https://drafts.csswg.org/css-images-4/#cross-fade-function)

MDN 说明了 `cross-fade()` 可用于按透明度混合两个或多个图像，并提示标准语法和当前实现语法不同。CSS Images Level 4 草案定义了 `cross-fade()` 的正式语法、百分比规则、绘制和尺寸计算规则。
