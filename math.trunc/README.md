# Math.trunc()

`Math.trunc()` 是 JavaScript 内置的数学函数，用于**截断**一个数字的小数部分，直接返回其整数部分，不进行任何四舍五入。

---

## 语法

```js
Math.trunc(value)
```

| 参数 | 说明 |
|------|------|
| `value` | 任意数字（或可被转换为数字的值） |

**返回值：** 去掉小数部分后的整数。若参数无法转换为数字，则返回 `NaN`。

---

## 与其他取整方法的区别

| 方法 | 说明 | `4.7` | `-4.7` |
|------|------|-------|--------|
| `Math.trunc()` | 截断小数，向零取整 | `4` | `-4` |
| `Math.floor()` | 向下取整（向 -∞） | `4` | `-5` |
| `Math.ceil()` | 向上取整（向 +∞） | `5` | `-4` |
| `Math.round()` | 四舍五入 | `5` | `-5` |

> **关键区别：** `Math.trunc()` 始终朝 **零的方向** 截断，负数时与 `Math.floor()` 结果不同。

---

## 基础示例

```js
Math.trunc(4.9)    // 4
Math.trunc(4.1)    // 4
Math.trunc(-4.9)   // -4   ← 注意：不是 -5
Math.trunc(-4.1)   // -4
Math.trunc(0.9)    // 0
Math.trunc(-0.9)   // -0
Math.trunc(5)      // 5    （整数原样返回）
Math.trunc(NaN)    // NaN
Math.trunc('abc')  // NaN
Math.trunc('3.7')  // 3    （字符串会先转换为数字）
Math.trunc(null)   // 0
Math.trunc(undefined) // NaN
```

---

## 常见使用场景

### 1. 提取整数部分（不关心正负）

```js
const price = 19.99;
const intPart = Math.trunc(price); // 19
```

### 2. 判断数字的正负号

```js
function sign(n) {
  if (n === 0) return 0;
  return Math.trunc(n) === n ? n / Math.abs(n) : Math.trunc(n / Math.abs(n));
}
// 实际上 ES6 提供了 Math.sign()，但 trunc 常被用于辅助实现
```

### 3. 截断像素值（UI 计算）

```js
const rawWidth = containerWidth / columns; // 例如 33.333...
const pixelWidth = Math.trunc(rawWidth);   // 33，避免亚像素渲染
```

### 4. 游戏开发：坐标取整

```js
const tileX = Math.trunc(player.x / tileSize); // 快速定位所在格子
const tileY = Math.trunc(player.y / tileSize);
```

### 5. 时间格式化

```js
const totalSeconds = 125.8;
const minutes = Math.trunc(totalSeconds / 60); // 2
const seconds = Math.trunc(totalSeconds % 60); // 5
console.log(`${minutes}:${seconds.toString().padStart(2, '0')}`); // "2:05"
```

### 6. 分页计算

```js
const totalItems = 101;
const pageSize = 10;
const totalPages = Math.trunc(totalItems / pageSize) + (totalItems % pageSize > 0 ? 1 : 0);
// 11 页
```

---

## 浏览器兼容性

| Chrome | Firefox | Safari | Edge | Node.js |
|--------|---------|--------|------|---------|
| 38+ | 25+ | 7.1+ | 12+ | 0.12+ |

> IE 不支持 `Math.trunc()`，如需兼容 IE，可使用 polyfill：
> ```js
> Math.trunc = Math.trunc || function(x) { return x < 0 ? Math.ceil(x) : Math.floor(x); };
> ```

---

## 演示

打开 [index.html](./index.html) 查看交互式演示效果。
