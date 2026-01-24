# CSS image-set() 函数详解

## 概述

`image-set()` 是一个 CSS 函数，用于根据设备的分辨率（像素密度）提供不同版本的图像。它允许浏览器根据用户设备的显示能力选择最合适的图像，从而在高分辨率屏幕上显示清晰图像，同时在普通屏幕上节省带宽。

## 语法

```CSS
background-image: image-set(
  "image-1x.png" 1x,
  "image-2x.png" 2x,
  "image-3x.png" 3x
);
```

### 参数说明

| 参数 | 说明 |
| --- | --- |
| `url` | 图像的 URL，可以使用 `url()` 函数或直接使用字符串 |
| `resolution` | 图像的分辨率描述符，如 `1x`、`2x`、`3x` 或 `1dppx`、`2dppx` 等 |
| `type()` | 可选，指定图像的 MIME 类型，用于格式协商 |

## 分辨率单位

- ​**`x`**​** 或 **​**`dppx`**: 每像素点数（dots per pixel），`1x` = `1dppx`
- ​**`dpi`**: 每英寸点数（dots per inch），`96dpi` ≈ `1x`
- ​**`dpcm`**: 每厘米点数（dots per centimeter）

## 浏览器兼容性

| 浏览器 | 支持版本 |
| --- | --- |
| Chrome | 113+ (标准), 21+ (-webkit-) |
| Firefox | 89+ (标准), 88+ (-webkit-) |
| Safari | 17+ (标准), 6+ (-webkit-) |
| Edge | 113+ |

> ​**注意**: 为了更好的兼容性，建议同时使用标准语法和 `-webkit-` 前缀。

## 与其他技术的对比

### image-set() vs srcset (HTML)

| 特性 | image-set() | srcset |
| --- | --- | --- |
| 使用场景 | CSS 背景图像 | HTML `<img>` 元素 |
| 语法位置 | CSS 属性值 | HTML 属性 |
| 格式协商 | 支持 `type()` | 不支持 |
| 尺寸描述 | 仅分辨率 | 分辨率和宽度 |

### image-set() vs media queries

```CSS
/* 使用 media queries */
.hero {
  background-image: url("hero-1x.png");
}
@media (min-resolution: 2dppx) {
  .hero {
    background-image: url("hero-2x.png");
  }
}

/* 使用 image-set() - 更简洁 */
.hero {
  background-image: image-set(
    "hero-1x.png" 1x,
    "hero-2x.png" 2x
  );
}
```

## 示例文件

1. [01-basic-usage.html](01-basic-usage.html) - 基本用法
2. [02-resolution-switching.html](02-resolution-switching.html) - 分辨率切换
3. [03-format-negotiation.html](03-format-negotiation.html) - 格式协商
4. [04-fallback-strategy.html](04-fallback-strategy.html) - 回退策略
5. [05-practical-example.html](05-practical-example.html) - 实际应用案例

## 最佳实践

1. ​**始终提供回退**: 为不支持 `image-set()` 的浏览器提供默认图像
2. ​**合理选择分辨率**: 通常 1x 和 2x 就足够，3x 仅在必要时使用
3. ​**考虑文件大小**: 高分辨率图像文件更大，注意性能影响
4. ​**使用现代格式**: 结合 `type()` 使用 WebP/AVIF 等现代格式

## 参考资源

- [MDN: image-set()](https://developer.mozilla.org/en-US/docs/Web/CSS/image/image-set)
- [CSS Images Module Level 4](https://drafts.csswg.org/css-images-4/#image-set-notation)
- [Can I Use: image-set](https://caniuse.com/css-image-set)
