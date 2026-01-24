# File System Access API 学习指南

## 概述

File System Access API 是一组现代浏览器 API，允许 Web 应用程序直接与用户本地文件系统进行交互。主要包含以下三个核心方法：

- `showOpenFilePicker()` - 打开文件选择器，选择一个或多个文件
- `showSaveFilePicker()` - 打开保存文件对话框
- `showDirectoryPicker()` - 打开目录选择器，选择一个文件夹

## 浏览器兼容性

| 浏览器 | 支持情况 |
| --- | --- |
| Chrome | 86+ ✅ |
| Edge | 86+ ✅ |
| Opera | 72+ ✅ |
| Firefox | ❌ 不支持 |
| Safari | ❌ 不支持 |

> ​**注意**：这些 API 只能在安全上下文（HTTPS 或 localhost）中使用，且必须由用户手势（如点击）触发。

---

## showOpenFilePicker()

### 语法

```JAVASCRIPT
const fileHandles = await window.showOpenFilePicker(options);
```

### 参数 (options)

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `multiple` | boolean | 是否允许选择多个文件，默认 `false` |
| `excludeAcceptAllOption` | boolean | 是否排除"所有文件"选项，默认 `false` |
| `types` | array | 允许选择的文件类型数组 |
| `startIn` | string | 起始目录，可选值：`desktop`、`documents`、`downloads`、`music`、`pictures`、`videos` |

### types 配置示例

```JAVASCRIPT
const options = {
  types: [
    {
      description: '图片文件',
      accept: {
        'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
      }
    },
    {
      description: '文本文件',
      accept: {
        'text/plain': ['.txt', '.md']
      }
    }
  ]
};
```

### 返回值

返回一个 `Promise`，解析为 `FileSystemFileHandle` 对象数组。

---

## showSaveFilePicker()

`showSaveFilePicker()` 方法用于显示一个文件保存对话框，允许用户选择保存文件的位置和文件名。

### 语法

```JAVASCRIPT
const fileHandle = await window.showSaveFilePicker();
const fileHandle = await window.showSaveFilePicker(options);
```

### 参数 (options)

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `excludeAcceptAllOption` | boolean | 否 | 是否排除"所有文件"选项，默认 `false` |
| `suggestedName` | string | 否 | 建议的文件名，会预填充到保存对话框中 |
| `types` | array | 否 | 允许保存的文件类型数组 |
| `startIn` | string | FileSystemHandle | 否 | 起始目录 |
| `id` | string | 否 | 用于记住用户上次选择的目录 |

### types 配置

`types` 数组中的每个对象包含：

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `description` | string | 文件类型描述，显示在文件类型下拉菜单中 |
| `accept` | object | MIME 类型到文件扩展名数组的映射 |

### 返回值

返回一个 `Promise<FileSystemFileHandle>`，解析为用户选择的保存位置的文件句柄。

### 可能抛出的异常

| 异常类型 | 触发条件 |
| --- | --- |
| `AbortError` | 用户取消了保存对话框 |
| `SecurityError` | 不在安全上下文中调用，或不是由用户手势触发 |
| `TypeError` | `types` 配置无效 |

### 基本示例

```JAVASCRIPT
// 最简单的用法
async function saveFile(content) {
  const handle = await window.showSaveFilePicker();
  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();
}
```

### 带选项的示例

```JAVASCRIPT
// 保存文本文件
async function saveTextFile(content) {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'document.txt',
    types: [{
      description: '文本文件',
      accept: {
        'text/plain': ['.txt']
      }
    }]
  });

  const writable = await handle.createWritable();
  await writable.write(content);
  await writable.close();

  return handle.name;  // 返回用户选择的文件名
}

// 保存 JSON 文件
async function saveJsonFile(data) {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'data.json',
    types: [{
      description: 'JSON 文件',
      accept: {
        'application/json': ['.json']
      }
    }]
  });

  const writable = await handle.createWritable();
  await writable.write(JSON.stringify(data, null, 2));
  await writable.close();
}

// 保存图片（Blob）
async function saveImage(blob, suggestedName = 'image.png') {
  const handle = await window.showSaveFilePicker({
    suggestedName,
    types: [{
      description: '图片文件',
      accept: {
        'image/png': ['.png'],
        'image/jpeg': ['.jpg', '.jpeg'],
        'image/webp': ['.webp']
      }
    }]
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
```

### 多种文件类型选择

```JAVASCRIPT
// 允许用户选择保存为多种格式
async function exportDocument(content) {
  const handle = await window.showSaveFilePicker({
    suggestedName: 'document',
    types: [
      {
        description: 'Markdown 文件',
        accept: { 'text/markdown': ['.md'] }
      },
      {
        description: '纯文本文件',
        accept: { 'text/plain': ['.txt'] }
      },
      {
        description: 'HTML 文件',
        accept: { 'text/html': ['.html'] }
      }
    ]
  });

  // 根据用户选择的扩展名决定保存格式
  const ext = handle.name.split('.').pop().toLowerCase();
  let outputContent = content;

  if (ext === 'html') {
    outputContent = `<!DOCTYPE html><html><body>${content}</body></html>`;
  }

  const writable = await handle.createWritable();
  await writable.write(outputContent);
  await writable.close();

  return { name: handle.name, format: ext };
}
```

### 与 showOpenFilePicker 配合使用

```JAVASCRIPT
// 打开文件 -> 编辑 -> 另存为
async function openEditSave() {
  // 1. 打开文件
  const [openHandle] = await window.showOpenFilePicker({
    types: [{
      description: '文本文件',
      accept: { 'text/plain': ['.txt', '.md'] }
    }]
  });

  const file = await openHandle.getFile();
  let content = await file.text();

  // 2. 编辑内容
  content = content.toUpperCase();

  // 3. 另存为新文件
  const saveHandle = await window.showSaveFilePicker({
    suggestedName: `${file.name.replace(/\.[^.]+$/, '')}_modified.txt`,
    types: [{
      description: '文本文件',
      accept: { 'text/plain': ['.txt'] }
    }]
  });

  const writable = await saveHandle.createWritable();
  await writable.write(content);
  await writable.close();

  console.log(`文件已保存为: ${saveHandle.name}`);
}
```

### 保存 Canvas 内容

```JAVASCRIPT
// 将 Canvas 保存为图片
async function saveCanvas(canvas) {
  const blob = await new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });

  const handle = await window.showSaveFilePicker({
    suggestedName: 'canvas-image.png',
    types: [{
      description: 'PNG 图片',
      accept: { 'image/png': ['.png'] }
    }]
  });

  const writable = await handle.createWritable();
  await writable.write(blob);
  await writable.close();
}
```

### 错误处理最佳实践

```JAVASCRIPT
async function safeSaveFile(content, options = {}) {
  try {
    const handle = await window.showSaveFilePicker({
      suggestedName: options.suggestedName || 'untitled.txt',
      types: options.types || [{
        description: '文本文件',
        accept: { 'text/plain': ['.txt'] }
      }]
    });

    const writable = await handle.createWritable();

    try {
      await writable.write(content);
      await writable.close();
      return { success: true, fileName: handle.name };
    } catch (writeError) {
      // 写入失败时尝试中止
      await writable.abort();
      throw writeError;
    }
  } catch (err) {
    if (err.name === 'AbortError') {
      // 用户取消，不是错误
      return { success: false, cancelled: true };
    }
    return { success: false, error: err.message };
  }
}

// 使用示例
const result = await safeSaveFile('Hello, World!', {
  suggestedName: 'greeting.txt'
});

if (result.success) {
  console.log(`文件已保存: ${result.fileName}`);
} else if (result.cancelled) {
  console.log('用户取消了保存');
} else {
  console.error(`保存失败: ${result.error}`);
}
```

---

## FileSystemFileHandle 详解

`FileSystemFileHandle` 是文件句柄对象，代表文件系统中的一个文件。通过它可以读取文件内容、写入数据、查询和请求权限。

### 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `kind` | string | 始终为 `"file"` |
| `name` | string | 文件名（包含扩展名） |

### 方法详解

#### 1. getFile()

获取文件的 `File` 对象，用于读取文件内容。

```JAVASCRIPT
const [fileHandle] = await showOpenFilePicker();

// 获取 File 对象
const file = await fileHandle.getFile();

// File 对象属性
console.log(file.name);         // 文件名
console.log(file.size);         // 文件大小（字节）
console.log(file.type);         // MIME 类型
console.log(file.lastModified); // 最后修改时间戳

// 读取文件内容的几种方式
const text = await file.text();           // 读取为文本
const arrayBuffer = await file.arrayBuffer(); // 读取为 ArrayBuffer
const blob = await file.slice(0, 100);    // 读取部分内容
```

#### 2. createWritable()

创建一个 `FileSystemWritableFileStream`，用于写入文件内容。

```JAVASCRIPT
const [fileHandle] = await showOpenFilePicker();

// 创建可写流
const writable = await fileHandle.createWritable();

// 写入方式一：直接写入字符串
await writable.write('Hello, World!');

// 写入方式二：写入 Blob
await writable.write(new Blob(['Hello'], { type: 'text/plain' }));

// 写入方式三：使用配置对象
await writable.write({
  type: 'write',
  position: 0,      // 写入位置
  data: 'Hello'     // 写入内容
});

// 定位到指定位置
await writable.write({
  type: 'seek',
  position: 10
});

// 截断文件
await writable.write({
  type: 'truncate',
  size: 100
});

// 必须关闭流才能保存更改
await writable.close();
```

#### 3. queryPermission() / requestPermission()

查询和请求文件访问权限。

```JAVASCRIPT
const [fileHandle] = await showOpenFilePicker();

// 查询当前权限状态
const readPermission = await fileHandle.queryPermission({ mode: 'read' });
const writePermission = await fileHandle.queryPermission({ mode: 'readwrite' });

// 权限状态值：'granted' | 'denied' | 'prompt'
console.log(readPermission);  // 'granted'
console.log(writePermission); // 'prompt'

// 请求写入权限
if (writePermission !== 'granted') {
  const result = await fileHandle.requestPermission({ mode: 'readwrite' });
  if (result === 'granted') {
    // 用户授予了权限，可以写入文件
    const writable = await fileHandle.createWritable();
    // ...
  }
}
```

### 完整示例：读取并修改文件

```JAVASCRIPT
async function editFile() {
  // 1. 选择文件
  const [fileHandle] = await showOpenFilePicker({
    types: [{
      description: '文本文件',
      accept: { 'text/plain': ['.txt'] }
    }]
  });

  // 2. 读取原内容
  const file = await fileHandle.getFile();
  let content = await file.text();

  // 3. 修改内容
  content = content.toUpperCase();

  // 4. 请求写入权限
  const permission = await fileHandle.requestPermission({ mode: 'readwrite' });
  if (permission !== 'granted') {
    throw new Error('需要写入权限');
  }

  // 5. 写回文件
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();

  console.log('文件已保存');
}
```

---

## showDirectoryPicker()

### 语法

```JAVASCRIPT
const directoryHandle = await window.showDirectoryPicker(options);
```

### 参数 (options)

| 参数 | 类型 | 说明 |
| --- | --- | --- |
| `id` | string | 用于记住用户选择的目录 |
| `mode` | string | 权限模式：`read`（只读）或 `readwrite`（读写） |
| `startIn` | string | 起始目录 |

### 返回值

返回一个 `Promise`，解析为 `FileSystemDirectoryHandle` 对象。

---

## FileSystemDirectoryHandle 详解

`FileSystemDirectoryHandle` 是目录句柄对象，代表文件系统中的一个目录。通过它可以遍历目录内容、获取子文件/子目录、创建和删除条目。

### 属性

| 属性 | 类型 | 说明 |
| --- | --- | --- |
| `kind` | string | 始终为 `"directory"` |
| `name` | string | 目录名 |

### 方法详解

---

#### 1. entries()

返回一个异步迭代器，用于遍历目录中的所有条目（文件和子目录）。

​**语法**

```JAVASCRIPT
dirHandle.entries()
```

​**参数**

无

​**返回值**

返回一个 `AsyncIterableIterator<[string, FileSystemHandle]>`，每次迭代产生一个数组：

- `[0]` - 条目名称（string）
- `[1]` - 条目句柄（`FileSystemFileHandle` 或 `FileSystemDirectoryHandle`）

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker();

for await (const [name, handle] of dirHandle.entries()) {
  console.log(`名称: ${name}`);
  console.log(`类型: ${handle.kind}`);  // 'file' 或 'directory'
}
```

---

#### 2. keys()

返回一个异步迭代器，用于遍历目录中所有条目的名称。

​**语法**

```JAVASCRIPT
dirHandle.keys()
```

​**参数**

无

​**返回值**

返回一个 `AsyncIterableIterator<string>`，每次迭代产生条目名称字符串。

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker();

const names = [];
for await (const name of dirHandle.keys()) {
  names.push(name);
}
console.log('目录内容:', names);
```

---

#### 3. values()

返回一个异步迭代器，用于遍历目录中所有条目的句柄。

​**语法**

```JAVASCRIPT
dirHandle.values()
```

​**参数**

无

​**返回值**

返回一个 `AsyncIterableIterator<FileSystemHandle>`，每次迭代产生：

- `FileSystemFileHandle` - 如果条目是文件
- `FileSystemDirectoryHandle` - 如果条目是目录

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker();

for await (const handle of dirHandle.values()) {
  if (handle.kind === 'file') {
    const file = await handle.getFile();
    console.log(`文件: ${handle.name}, 大小: ${file.size}`);
  } else {
    console.log(`目录: ${handle.name}/`);
  }
}
```

---

#### 4. getFileHandle(name, options)

获取目录中指定名称的文件句柄。可选择在文件不存在时创建新文件。

​**语法**

```JAVASCRIPT
const fileHandle = await dirHandle.getFileHandle(name);
const fileHandle = await dirHandle.getFileHandle(name, options);
```

​**参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 要获取的文件名（不能包含路径分隔符 `/` 或 `\`） |
| `options` | object | 否 | 配置选项 |
| `options.create` | boolean | 否 | 默认 `false`。设为 `true` 时，如果文件不存在则创建新文件 |

​**返回值**

返回一个 `Promise<FileSystemFileHandle>`，解析为文件句柄对象。

​**可能抛出的异常**

| 异常类型 | 触发条件 |
| --- | --- |
| `NotFoundError` | 文件不存在且 `create` 为 `false` |
| `TypeMismatchError` | 指定名称的条目存在但不是文件（是目录） |
| `TypeError` | `name` 包含无效字符（如 `/`、`\`、`:`） |
| `NotAllowedError` | 没有足够的权限（`create: true` 需要写入权限） |

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker({ mode: 'readwrite' });

// 获取已存在的文件
try {
  const fileHandle = await dirHandle.getFileHandle('config.json');
  const file = await fileHandle.getFile();
  const content = JSON.parse(await file.text());
  console.log(content);
} catch (err) {
  if (err.name === 'NotFoundError') {
    console.log('文件不存在');
  } else if (err.name === 'TypeMismatchError') {
    console.log('这是一个目录，不是文件');
  }
}

// 创建新文件（如果不存在）
const newFileHandle = await dirHandle.getFileHandle('data.txt', {
  create: true
});

// 写入内容
const writable = await newFileHandle.createWritable();
await writable.write('Hello, World!');
await writable.close();
```

---

#### 5. getDirectoryHandle(name, options)

获取目录中指定名称的子目录句柄。可选择在子目录不存在时创建。

​**语法**

```JAVASCRIPT
const subDirHandle = await dirHandle.getDirectoryHandle(name);
const subDirHandle = await dirHandle.getDirectoryHandle(name, options);
```

​**参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 要获取的子目录名（不能包含路径分隔符） |
| `options` | object | 否 | 配置选项 |
| `options.create` | boolean | 否 | 默认 `false`。设为 `true` 时，如果目录不存在则创建 |

​**返回值**

返回一个 `Promise<FileSystemDirectoryHandle>`，解析为子目录句柄对象。

​**可能抛出的异常**

| 异常类型 | 触发条件 |
| --- | --- |
| `NotFoundError` | 目录不存在且 `create` 为 `false` |
| `TypeMismatchError` | 指定名称的条目存在但不是目录（是文件） |
| `TypeError` | `name` 包含无效字符 |
| `NotAllowedError` | 没有足够的权限 |

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker({ mode: 'readwrite' });

// 获取已存在的子目录
try {
  const srcDir = await dirHandle.getDirectoryHandle('src');
  console.log('src 目录存在');
} catch (err) {
  if (err.name === 'NotFoundError') {
    console.log('src 目录不存在');
  }
}

// 创建新子目录
const distDir = await dirHandle.getDirectoryHandle('dist', {
  create: true
});

// 递归创建嵌套目录结构
async function mkdirp(rootHandle, path) {
  const parts = path.split('/').filter(Boolean);
  let current = rootHandle;
  for (const part of parts) {
    current = await current.getDirectoryHandle(part, { create: true });
  }
  return current;
}

// 创建 src/components/ui 目录
const uiDir = await mkdirp(dirHandle, 'src/components/ui');
```

---

#### 6. removeEntry(name, options)

删除目录中指定名称的文件或子目录。

​**语法**

```JAVASCRIPT
await dirHandle.removeEntry(name);
await dirHandle.removeEntry(name, options);
```

​**参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `name` | string | 是 | 要删除的条目名称 |
| `options` | object | 否 | 配置选项 |
| `options.recursive` | boolean | 否 | 默认 `false`。设为 `true` 时，递归删除目录及其所有内容 |

​**返回值**

返回一个 `Promise<undefined>`，删除成功时解析为 `undefined`。

​**可能抛出的异常**

| 异常类型 | 触发条件 |
| --- | --- |
| `NotFoundError` | 指定名称的条目不存在 |
| `InvalidModificationError` | 尝试删除非空目录但 `recursive` 为 `false` |
| `NotAllowedError` | 没有写入权限 |
| `NoModificationAllowedError` | 条目被锁定或正在使用中 |

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker({ mode: 'readwrite' });

// 删除单个文件
try {
  await dirHandle.removeEntry('temp.txt');
  console.log('文件已删除');
} catch (err) {
  if (err.name === 'NotFoundError') {
    console.log('文件不存在');
  }
}

// 删除空目录
await dirHandle.removeEntry('empty-folder');

// 递归删除非空目录（危险操作！）
await dirHandle.removeEntry('node_modules', {
  recursive: true  // 删除目录及其所有内容
});
```

---

#### 7. resolve(possibleDescendant)

计算从当前目录到指定句柄的相对路径。用于确定一个文件或目录是否在当前目录内。

​**语法**

```JAVASCRIPT
const path = await dirHandle.resolve(possibleDescendant);
```

​**参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `possibleDescendant` | FileSystemHandle | 是 | 要解析路径的文件或目录句柄 |

​**返回值**

返回一个 `Promise`，解析为：

- `string[]` - 如果 `possibleDescendant` 是当前目录的后代，返回路径数组（从当前目录到目标的各级名称）
- `null` - 如果 `possibleDescendant` 不是当前目录的后代

​**示例**

```JAVASCRIPT
const dirHandle = await showDirectoryPicker();

// 获取子目录和文件
const srcDir = await dirHandle.getDirectoryHandle('src');
const componentsDir = await srcDir.getDirectoryHandle('components');
const fileHandle = await componentsDir.getFileHandle('Button.tsx');

// 解析相对路径
const pathToFile = await dirHandle.resolve(fileHandle);
console.log(pathToFile);  // ['src', 'components', 'Button.tsx']

const pathToDir = await dirHandle.resolve(componentsDir);
console.log(pathToDir);   // ['src', 'components']

// 检查是否为后代
const otherDir = await showDirectoryPicker();
const isDescendant = await dirHandle.resolve(otherDir);
if (isDescendant === null) {
  console.log('不是当前目录的后代');
}

// 实用函数：获取完整路径字符串
async function getRelativePath(rootHandle, handle) {
  const parts = await rootHandle.resolve(handle);
  return parts ? parts.join('/') : null;
}

const relativePath = await getRelativePath(dirHandle, fileHandle);
console.log(relativePath);  // 'src/components/Button.tsx'
```

---

#### 8. isSameEntry(other)

比较两个句柄是否指向同一个文件系统条目。

​**语法**

```JAVASCRIPT
const isSame = await dirHandle.isSameEntry(other);
```

​**参数**

| 参数 | 类型 | 必填 | 说明 |
| --- | --- | --- | --- |
| `other` | FileSystemHandle | 是 | 要比较的另一个句柄 |

​**返回值**

返回一个 `Promise<boolean>`：

- `true` - 两个句柄指向同一个条目
- `false` - 两个句柄指向不同条目

​**示例**

```JAVASCRIPT
const dirHandle1 = await showDirectoryPicker();
const dirHandle2 = await showDirectoryPicker();

// 检查用户是否选择了同一个目录
const isSame = await dirHandle1.isSameEntry(dirHandle2);
if (isSame) {
  console.log('选择了相同的目录');
} else {
  console.log('选择了不同的目录');
}

// 实用场景：避免重复处理
const processedHandles = [];

async function processIfNew(handle) {
  for (const processed of processedHandles) {
    if (await handle.isSameEntry(processed)) {
      console.log('已处理过，跳过');
      return;
    }
  }
  processedHandles.push(handle);
  // 处理逻辑...
}
```

### 完整示例：递归遍历目录树

```JAVASCRIPT
async function walkDirectory(dirHandle, path = '') {
  const entries = [];

  for await (const entry of dirHandle.values()) {
    const entryPath = path ? `${path}/${entry.name}` : entry.name;

    if (entry.kind === 'file') {
      const file = await entry.getFile();
      entries.push({
        type: 'file',
        name: entry.name,
        path: entryPath,
        size: file.size,
        lastModified: file.lastModified
      });
    } else {
      entries.push({
        type: 'directory',
        name: entry.name,
        path: entryPath,
        children: await walkDirectory(entry, entryPath)
      });
    }
  }

  return entries;
}

// 使用示例
const dirHandle = await showDirectoryPicker();
const tree = await walkDirectory(dirHandle);
console.log(JSON.stringify(tree, null, 2));
```

### 完整示例：在目录中搜索文件

```JAVASCRIPT
async function findFiles(dirHandle, pattern, results = []) {
  const regex = new RegExp(pattern);

  for await (const entry of dirHandle.values()) {
    if (entry.kind === 'file') {
      if (regex.test(entry.name)) {
        results.push(entry);
      }
    } else {
      // 递归搜索子目录
      await findFiles(entry, pattern, results);
    }
  }

  return results;
}

// 使用示例：查找所有 .js 文件
const dirHandle = await showDirectoryPicker();
const jsFiles = await findFiles(dirHandle, '\\.js$');

for (const fileHandle of jsFiles) {
  console.log(fileHandle.name);
}
```

---

## 使用场景

### 1. 文本编辑器

允许用户打开、编辑和保存本地文本文件。

### 2. 图片处理应用

选择本地图片进行编辑、滤镜处理等。

### 3. 代码编辑器

打开整个项目目录，实现类似 VS Code 的文件浏览功能。

### 4. 文件管理器

浏览和管理本地文件夹内容。

### 5. 批量文件处理

选择多个文件进行批量重命名、格式转换等操作。

### 6. 数据导入导出

从本地文件导入数据或将数据导出到本地文件。

---

## 演示文件列表

| 文件 | 说明 |
| --- | --- |
| [01-basic-file-picker.html](./01-basic-file-picker.html) | 基础文件选择器 |
| [02-multiple-files.html](./02-multiple-files.html) | 多文件选择 |
| [03-file-type-filter.html](./03-file-type-filter.html) | 文件类型过滤 |
| [04-directory-picker.html](./04-directory-picker.html) | 目录选择器 |
| [05-text-editor.html](./05-text-editor.html) | 简易文本编辑器 |
| [06-image-viewer.html](./06-image-viewer.html) | 图片查看器 |
| [07-directory-tree.html](./07-directory-tree.html) | 递归遍历目录树 |
| [08-file-search.html](./08-file-search.html) | 文件搜索工具 |
| [09-save-file.html](./09-save-file.html) | 文件保存演示 |

---

## 安全注意事项

1. ​**用户手势要求**：必须由用户主动触发（如点击按钮）
2. ​**安全上下文**：只能在 HTTPS 或 localhost 环境下使用
3. ​**权限管理**：浏览器会记住用户的权限选择
4. ​**沙箱限制**：无法访问系统敏感目录

## 参考资料

- [MDN - File System Access API](https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API)
- [W3C File System Access 规范](https://wicg.github.io/file-system-access/)
- [Chrome Developers - File System Access](https://developer.chrome.com/articles/file-system-access/)
