# HTML FormData 事件学习指南

## 简介

`formdata` 事件是 HTML 表单的一个事件，当表单构造 `FormData` 对象时触发。它允许你在表单数据被发送之前拦截并修改数据，是一种优雅的方式来动态添加或修改表单数据。

## 基本语法

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  // event.formData 是 FormData 对象
  const formData = event.formData;

  // 可以添加、修改或删除数据
  formData.append('extraField', 'extraValue');
});
```

## 触发时机

`formdata` 事件在以下情况下触发：

1. ​**表单提交时** - 在 `submit` 事件之后，数据发送之前
2. ​**使用 **​**`new FormData(form)`**​** 时** - 当以表单元素作为参数构造 FormData 对象时

```JAVASCRIPT
// 触发方式 1：表单提交
form.submit();

// 触发方式 2：构造 FormData 对象
const formData = new FormData(form);
```

​**重要：** 直接使用 `new FormData()` 不传入表单元素时，不会触发 `formdata` 事件。

## 事件对象属性

### `event.formData`

`FormDataEvent` 对象包含一个 `formData` 属性，它是一个 `FormData` 对象，包含表单中所有字段的数据。

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  const formData = event.formData;

  // FormData 常用方法
  formData.append('key', 'value');     // 添加数据
  formData.set('key', 'newValue');     // 设置/覆盖数据
  formData.delete('key');              // 删除数据
  formData.get('key');                 // 获取数据
  formData.has('key');                 // 检查是否存在
  formData.getAll('key');              // 获取所有同名数据
});
```

## 使用场景

### 1. 添加额外数据

在表单提交时添加不在表单中的数据，如时间戳、用户 ID、设备信息等。

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  event.formData.append('timestamp', Date.now());
  event.formData.append('userAgent', navigator.userAgent);
});
```

### 2. 数据转换和格式化

在提交前对数据进行转换或格式化。

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  // 将多个字段合并为一个
  const firstName = event.formData.get('firstName');
  const lastName = event.formData.get('lastName');
  event.formData.set('fullName', `${firstName} ${lastName}`);
});
```

### 3. 数据验证和清理

在提交前清理或规范化数据。

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  // 去除空格
  const email = event.formData.get('email');
  event.formData.set('email', email.trim().toLowerCase());
});
```

### 4. 条件性添加数据

根据条件动态添加数据。

```JAVASCRIPT
form.addEventListener('formdata', (event) => {
  if (someCondition) {
    event.formData.append('specialFlag', 'true');
  }
});
```

### 5. 与自定义元素配合

让自定义元素参与表单提交。

```JAVASCRIPT
class CustomInput extends HTMLElement {
  connectedCallback() {
    this.closest('form')?.addEventListener('formdata', (event) => {
      event.formData.append(this.name, this.value);
    });
  }
}
```

## 与 submit 事件的区别

| 特性 | submit 事件 | formdata 事件 |
| --- | --- | --- |
| 触发时机 | 表单提交时 | FormData 构造时 |
| 可取消 | 是 (`preventDefault()`) | 否 |
| 访问 FormData | 需要手动创建 | 直接通过 `event.formData` |
| 用途 | 阻止提交、验证 | 修改提交数据 |

```JAVASCRIPT
// submit 事件 - 用于验证和阻止提交
form.addEventListener('submit', (event) => {
  if (!isValid) {
    event.preventDefault();
  }
});

// formdata 事件 - 用于修改数据
form.addEventListener('formdata', (event) => {
  event.formData.append('extra', 'data');
});
```

## 事件顺序

当表单提交时，事件触发顺序为：

1. `submit` 事件
2. `formdata` 事件
3. 数据发送

```JAVASCRIPT
form.addEventListener('submit', () => console.log('1. submit'));
form.addEventListener('formdata', () => console.log('2. formdata'));
// 3. 数据发送到服务器
```

## 演示文件

本项目包含以下演示文件：

1. ​**01-basic-formdata.html** - 基础用法演示
  
  - formdata 事件的基本使用
  - 查看 FormData 内容
2. ​**02-modify-data.html** - 修改表单数据
  
  - 修改现有字段
  - 删除字段
  - 数据格式化
3. ​**03-add-extra-data.html** - 添加额外数据
  
  - 添加时间戳
  - 添加设备信息
  - 添加计算字段
4. ​**04-trigger-timing.html** - 触发时机演示
  
  - submit vs formdata 事件顺序
  - new FormData() 触发
  - 不同场景的触发情况
5. ​**05-practical-use.html** - 实际应用场景
  
  - 自定义元素参与表单
  - 复杂数据处理
  - 与 fetch API 配合

## 浏览器支持

| 浏览器 | 版本 |
| --- | --- |
| Chrome | 77+ |
| Edge | 79+ |
| Firefox | 72+ |
| Safari | 15+ |

## 注意事项

### 1. 不能取消事件

`formdata` 事件不能被取消（`preventDefault()` 无效）。如果需要阻止表单提交，应该在 `submit` 事件中处理。

```JAVASCRIPT
// ✗ 错误 - 无法阻止
form.addEventListener('formdata', (event) => {
  event.preventDefault(); // 无效
});

// ✓ 正确 - 在 submit 事件中阻止
form.addEventListener('submit', (event) => {
  event.preventDefault(); // 有效
});
```

### 2. 只在有表单参数时触发

```JAVASCRIPT
// ✓ 触发 formdata 事件
const formData = new FormData(form);

// ✗ 不触发 formdata 事件
const formData = new FormData();
```

### 3. 事件监听器的添加时机

确保在表单提交之前添加事件监听器。

```JAVASCRIPT
// ✓ 正确 - 在提交前添加
form.addEventListener('formdata', handler);
form.submit();

// ✗ 错误 - 在提交后添加
form.submit();
form.addEventListener('formdata', handler); // 太晚了
```

## 参考资源

- [MDN Web Docs - FormDataEvent](https://developer.mozilla.org/en-US/docs/Web/API/FormDataEvent)
- [HTML Standard - FormData Event](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-formdata-event)
- [Can I Use - FormData Event](https://caniuse.com/mdn-api_htmlformelement_formdata_event)
