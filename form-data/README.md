# Form Data 编码方式：application/x-www-form-urlencoded vs multipart/form-data

## 概述

当 HTML 表单提交数据时，浏览器需要将表单字段序列化成某种格式发送给服务器。HTTP 协议中最常用的两种编码方式是：

- `application/x-www-form-urlencoded`（默认）
- `multipart/form-data`

---

## 1. application/x-www-form-urlencoded

### 原理

这是 HTML 表单的​**默认编码方式**。数据被编码为键值对，格式类似 URL 查询字符串：

```
key1=value1&key2=value2&key3=hello+world
```

- 空格被编码为 `+` 或 `%20`
- 特殊字符（如 `&`、`=`、`#`）被 percent-encoding（百分号编码）转义
- 整个 body 是一个连续的字符串

### HTTP 请求示例

```HTTP
POST /submit HTTP/1.1
Host: localhost:3000
Content-Type: application/x-www-form-urlencoded
Content-Length: 27

username=alice&password=123
```

### 特点

| 特性 | 说明 |
| --- | --- |
| 数据类型 | 纯文本键值对 |
| 文件上传 | ❌ 不支持 |
| 编码开销 | 非 ASCII 字符会膨胀（中文每字符变成 9 字节） |
| 解析复杂度 | 简单，服务端直接按 `&` 和 `=` 分割 |
| 适用场景 | 登录表单、搜索框、简单文本提交 |

### 编码示例

原始数据：

```
username = 张三
message  = hello world & bye
```

编码后：

```
username=%E5%BC%A0%E4%B8%89&message=hello+world+%26+bye
```

---

## 2. multipart/form-data

### 原理

数据被分割成多个​**部分（parts）**，每个字段占一个 part，各 part 之间用随机生成的 ​**boundary（边界字符串）** 分隔。

每个 part 包含：

- 自己的 `Content-Disposition` 头（含字段名）
- 可选的 `Content-Type` 头（文件类型）
- 字段值或文件二进制内容

### HTTP 请求示例

```HTTP
POST /upload HTTP/1.1
Host: localhost:3000
Content-Type: multipart/form-data; boundary=----WebKitFormBoundaryABC123
Content-Length: 348

------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="username"

alice
------WebKitFormBoundaryABC123
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg

<binary data of photo.jpg>
------WebKitFormBoundaryABC123--
```

注意最后的 boundary 末尾有 `--`，表示结束。

### 特点

| 特性 | 说明 |
| --- | --- |
| 数据类型 | 文本 + 二进制均可 |
| 文件上传 | ✅ 支持，可上传多个文件 |
| 编码开销 | 二进制数据原样传输，无额外膨胀 |
| 解析复杂度 | 较复杂，需按 boundary 分割 |
| 适用场景 | 文件上传、混合文本+文件的表单 |

---

## 3. Content-Disposition 详解

### 3.0 语义

`Content-Disposition` 字面意思是"内容的处置方式"，核心语义是：​**告诉接收方应该如何对待这段内容**。

它本质上是一个​**元数据头**，不描述内容本身（那是 `Content-Type` 的职责），而是描述​**内容的用途和归属**。

它回答的问题取决于方向：

- 响应方向（服务端 → 浏览器）：*"你收到这段内容后，应该展示它，还是存到磁盘？"* — 语义是​**处置指令**
- multipart 方向（浏览器 → 服务端）：*"这个 part 属于哪个表单字段？"* — 语义是​**字段归属标注**

| 核心语义 |
| --- |
| HTTP 响应头 | 处置指令（展示 or 下载） |
| multipart part 头 | 字段归属标注（这段数据是谁的） |

两个场景用的是同一个头名，但语义侧重完全不同。

---

`Content-Disposition` 是一个通用头部，出现在两个完全不同的场景，含义也不同。

### 3.1 场景一：HTTP 响应头（控制下载行为）

服务端在响应中设置此头，告诉浏览器如何处理返回的内容。

```
Content-Disposition: inline
Content-Disposition: attachment
Content-Disposition: attachment; filename="report.pdf"
Content-Disposition: attachment; filename*=UTF-8''%E6%8A%A5%E5%91%8A.pdf
```

| 值 | 含义 |
| --- | --- |
| `inline` | 在浏览器内直接展示（默认行为，如图片、PDF 预览） |
| `attachment` | 触发下载，不在浏览器内展示 |
| `attachment; filename="xxx"` | 下载并指定默认文件名 |

​**filename 与 filename* 的区别：**

- `filename="xxx"` — 旧语法，只支持 ASCII，非 ASCII 字符行为未定义（各浏览器处理不一致）
- `filename*=UTF-8''xxx` — RFC 5987 语法，支持任意字符，`UTF-8''` 是固定前缀，后面是 percent-encoded 的文件名

```HTTP
HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename="fallback.pdf"; filename*=UTF-8''%E6%8A%A5%E5%91%8A2024.pdf
```

浏览器优先使用 `filename*`，不支持时回退到 `filename`。

Node.js 中设置下载响应：

```JS
// Koa
ctx.set('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent('报告.pdf')}`)
ctx.body = fileStream
```

---

### 3.2 场景二：multipart/form-data 的 part 头部

这是本文的核心场景。在 `multipart/form-data` 请求体中，​**每个 part 必须有一个 ​**​**`Content-Disposition`​**​**​ 头**，固定以 `form-data` 开头，后跟参数。

#### 语法结构

```
Content-Disposition: form-data; name="<字段名>"
Content-Disposition: form-data; name="<字段名>"; filename="<文件名>"
```

#### 参数说明

| 参数 | 必填 | 说明 |
| --- | --- | --- |
| `form-data` | ✅ | 固定值，标识这是表单数据 |
| `name` | ✅ | 对应 HTML `<input name="...">` 的字段名 |
| `filename` | 文件时必填 | 上传文件的原始文件名 |
| `filename*` | 可选 | RFC 5987 编码的文件名，用于非 ASCII 文件名 |

#### 完整请求体示例（逐行解析）

```
POST /upload HTTP/1.1
Content-Type: multipart/form-data; boundary=----Boundary7MA4YWxkTrZu0gW

------Boundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="username"
                     ↑ 固定值   ↑ 字段名，对应 <input name="username">

alice
↑ 字段值，纯文本，无需编码

------Boundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="avatar"; filename="photo.jpg"
Content-Type: image/jpeg
              ↑ 文件 part 需要额外的 Content-Type 说明 MIME 类型

<JPEG 二进制数据...>

------Boundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="doc"; filename*=UTF-8''%E6%8A%A5%E5%91%8A.pdf
Content-Type: application/pdf
              ↑ 中文文件名用 filename* 避免乱码

<PDF 二进制数据...>

------Boundary7MA4YWxkTrZu0gW--
↑ boundary 末尾加 -- 表示整个 multipart 结束
```

#### 文本字段 vs 文件字段的区别

```
文本字段：
  Content-Disposition: form-data; name="title"
  （无 Content-Type，值是纯文本）

文件字段：
  Content-Disposition: form-data; name="file"; filename="data.csv"
  Content-Type: text/csv
  （有 filename 参数 + 独立的 Content-Type）
```

#### 多文件上传（`<input multiple>`）

同一个 `name` 可以出现多个 part：

```
------Boundary
Content-Disposition: form-data; name="photos"; filename="a.jpg"
Content-Type: image/jpeg
<binary>

------Boundary
Content-Disposition: form-data; name="photos"; filename="b.jpg"
Content-Type: image/jpeg
<binary>
------Boundary--
```

服务端解析后 `photos` 是一个数组。

---

### 3.3 两个场景的对比

| 响应头中 | multipart part 头中 |
| --- | --- |
| 出现位置 | HTTP Response Headers | 每个 part 的头部 |
| 固定类型值 | `inline` / `attachment` | `form-data` |
| `name` 参数 | 无 | 必须有（字段名） |
| `filename` 参数 | 下载文件名 | 上传文件的原始名 |
| 作用 | 控制浏览器展示/下载 | 标识表单字段归属 |

---

## 4. 核心区别对比

| 对比维度 | application/x-www-form-urlencoded | multipart/form-data |
| --- | --- | --- |
| 默认行为 | HTML `<form>` 默认 | 需显式指定 `enctype` |
| 文件上传 | 不支持 | 支持 |
| 二进制数据 | 不支持 | 支持 |
| 中文/特殊字符 | percent-encoding，体积膨胀 | 原样传输，无膨胀 |
| 请求体格式 | 单一字符串 `k=v&k=v` | 多段结构，有 boundary |
| 请求体大小 | 小（纯文本场景） | 稍大（有 boundary 开销） |
| 服务端解析 | 简单 | 需要专门的 multipart 解析库 |
| 适用场景 | 登录、搜索、简单表单 | 文件上传、富表单 |

### 何时选哪个？

```
只有文本字段？
  └─ 用 application/x-www-form-urlencoded（默认，简单）

有文件上传？
  └─ 必须用 multipart/form-data

有大量非 ASCII 文本（如中文）且无文件？
  └─ 两者均可，multipart 传输效率略高
     但 urlencoded 更通用，通常仍是首选
```

---

## 4. 浏览器原生 form 提交的策略

### 4.1 enctype 属性

HTML `<form>` 通过 `enctype` 属性指定编码方式，共三个合法值：

```HTML
<!-- 默认，不写就是这个 -->
<form method="POST" enctype="application/x-www-form-urlencoded">

<!-- 有文件上传时必须用这个 -->
<form method="POST" enctype="multipart/form-data">

<!-- 几乎不用，仅调试用途，值之间用换行分隔，不做任何编码 -->
<form method="POST" enctype="text/plain">
```

`method="GET"` 时 `enctype` 无效，数据永远拼到 URL 查询字符串，body 为空。

### 4.2 有文件但 enctype 设为 urlencoded 会怎样

浏览器​**不会报错，也不会自动切换编码方式**，它会按 urlencoded 规则处理文件字段，结果是：

```
# <input type="file" name="avatar"> 选了 photo.jpg
avatar=%5Bobject+File%5D   ← File 对象被 toString() 成 "[object File]"，二进制内容完全丢失
```

具体行为：

- `URLSearchParams` 对 `File` 对象调用 `.toString()`，得到字符串 `"[object File]"`
- 该字符串经 percent-encoding 后变为 `%5Bobject+File%5D`
- 文件的二进制内容从未出现在请求中

这是一个​**静默失败**，没有任何警告或错误。因此只要表单中有 `<input type="file">`，就必须显式声明 `enctype="multipart/form-data"`。

### 4.3 浏览器的编码选择逻辑

```
form 提交时：
  method="GET"
    └─ 忽略 enctype，数据拼到 URL ?key=value
  method="POST"
    └─ 按 enctype 编码 body
         未指定 enctype → application/x-www-form-urlencoded
         enctype="multipart/form-data" → multipart 编码
         enctype="text/plain" → 换行分隔，无编码（不推荐）
```

浏览器​**不会**根据是否有文件字段自动切换 enctype，完全由开发者负责声明正确的值。

---

## 5. 在 JavaScript 中手动构造

### fetch + urlencoded

```JS
const body = new URLSearchParams({
  username: 'alice',
  password: '123456'
})

fetch('/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body: body.toString()
})
```

### fetch + multipart/form-data

```JS
const formData = new FormData()
formData.append('username', 'alice')
formData.append('avatar', fileInput.files[0])

// 注意：不要手动设置 Content-Type，浏览器会自动加上 boundary
fetch('/upload', {
  method: 'POST',
  body: formData
})
```

---

## 5. 运行演示

### 安装依赖

```BASH
npm install
```

### 启动服务器

```BASH
node server.js
```

### 打开演示页面

浏览器访问 `http://localhost:3000`，或直接打开 `index.html`（需先启动服务器）。

---

## 参考资料

- [MDN: Sending form data](https://developer.mozilla.org/en-US/docs/Learn/Forms/Sending_and_retrieving_form_data)
- [RFC 7578: multipart/form-data](https://datatracker.ietf.org/doc/html/rfc7578)
- [WHATWG: URL encoding](https://url.spec.whatwg.org/#application/x-www-form-urlencoded)
