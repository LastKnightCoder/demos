const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 静态文件服务
app.use('/examples', express.static(path.join(__dirname, 'examples')));

// 首页路由
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Form Submit Demo</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 800px;
          margin: 50px auto;
          padding: 20px;
          line-height: 1.6;
        }
        h1 { color: #333; }
        .demo-list {
          list-style: none;
          padding: 0;
        }
        .demo-list li {
          margin: 15px 0;
        }
        .demo-list a {
          display: block;
          padding: 15px 20px;
          background: #f0f0f0;
          color: #333;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.3s;
        }
        .demo-list a:hover {
          background: #e0e0e0;
          transform: translateX(5px);
        }
        .description {
          background: #f9f9f9;
          padding: 15px;
          border-left: 4px solid #4CAF50;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <h1>HTML Form submit() vs requestSubmit() 演示</h1>

      <div class="description">
        <p>本项目演示了 HTML Form 元素的 <code>submit()</code> 和 <code>requestSubmit()</code> 两个方法的区别。</p>
        <p><strong>主要区别：</strong></p>
        <ul>
          <li><code>submit()</code> - 直接提交，绕过验证和事件</li>
          <li><code>requestSubmit()</code> - 模拟点击，触发完整的验证和事件流程</li>
        </ul>
      </div>

      <h2>示例列表</h2>
      <ul class="demo-list">
        <li>
          <a href="/examples/01-basic-comparison.html">
            <strong>01 - 基础对比示例</strong><br>
            直观展示 submit() 和 requestSubmit() 的基本区别
          </a>
        </li>
        <li>
          <a href="/examples/02-validation-demo.html">
            <strong>02 - 表单验证示例</strong><br>
            演示两种方法在表单验证中的不同行为
          </a>
        </li>
        <li>
          <a href="/examples/03-event-handling.html">
            <strong>03 - 事件处理示例</strong><br>
            展示 submit 事件和 preventDefault() 的使用
          </a>
        </li>
        <li>
          <a href="/examples/04-react-demo.html">
            <strong>04 - React + Tailwind 综合示例</strong><br>
            使用 React 和 Tailwind CSS 的完整实战示例
          </a>
        </li>
      </ul>

      <div class="description" style="border-left-color: #2196F3; margin-top: 40px;">
        <p><strong>查看文档：</strong></p>
        <p>详细的 API 说明和最佳实践请查看 <a href="https://github.com/yourusername/form-submit-demo/blob/main/README.md" target="_blank">README.md</a></p>
      </div>
    </body>
    </html>
  `);
});

// 表单提交处理路由
app.post('/submit-form', (req, res) => {
  console.log('收到表单提交:', req.body);

  // 模拟处理延迟
  setTimeout(() => {
    res.json({
      success: true,
      message: '表单提交成功！',
      data: req.body,
      timestamp: new Date().toISOString()
    });
  }, 500);
});

// 用户注册示例路由
app.post('/api/register', (req, res) => {
  const { username, email, password } = req.body;

  console.log('注册请求:', { username, email });

  // 模拟验证逻辑
  if (username === 'admin') {
    return res.status(400).json({
      success: false,
      message: '用户名已存在'
    });
  }

  setTimeout(() => {
    res.json({
      success: true,
      message: `用户 ${username} 注册成功！`,
      user: {
        id: Date.now(),
        username,
        email
      }
    });
  }, 800);
});

// 404 处理
app.use((req, res) => {
  res.status(404).send(`
    <!DOCTYPE html>
    <html lang="zh-CN">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>404 - 页面未找到</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
          max-width: 600px;
          margin: 100px auto;
          padding: 20px;
          text-align: center;
        }
        h1 { color: #e74c3c; font-size: 72px; margin: 0; }
        p { color: #666; font-size: 18px; }
        a { color: #3498db; text-decoration: none; }
        a:hover { text-decoration: underline; }
      </style>
    </head>
    <body>
      <h1>404</h1>
      <p>页面未找到</p>
      <p><a href="/">返回首页</a></p>
    </body>
    </html>
  `);
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`\n🚀 服务器启动成功！`);
  console.log(`📍 访问地址: http://localhost:${PORT}`);
  console.log(`\n可用的示例页面:`);
  console.log(`  - http://localhost:${PORT}/examples/01-basic-comparison.html`);
  console.log(`  - http://localhost:${PORT}/examples/02-validation-demo.html`);
  console.log(`  - http://localhost:${PORT}/examples/03-event-handling.html`);
  console.log(`  - http://localhost:${PORT}/examples/04-react-demo.html`);
  console.log(`\n按 Ctrl+C 停止服务器\n`);
});
