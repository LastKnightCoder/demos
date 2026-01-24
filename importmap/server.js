import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 3000;

// 为 importmap.json 设置正确的 MIME 类型
app.get('*.importmap.json', (req, res, next) => {
    res.type('application/importmap+json');
    next();
});

// 也可以为特定文件设置
app.get('/importmap.json', (req, res) => {
    res.type('application/importmap+json');
    res.sendFile(join(__dirname, 'importmap.json'));
});

// 动态生成 importmap 的示例
app.get('/dynamic-importmap.json', (req, res) => {
    const env = req.query.env || 'production';

    const importMap = {
        imports: {
            // 根据环境返回不同的配置
            "lodash": env === 'development'
                ? "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.js"
                : "https://cdn.jsdelivr.net/npm/lodash-es@4.17.21/lodash.min.js",
            "dayjs": "https://esm.sh/dayjs@1.11.10",
            "uuid": "https://esm.sh/uuid@9",
            "nanoid": "https://esm.sh/nanoid@5",
            // 本地模块
            "@/": "./modules/",
            "utils": "./modules/utils.js"
        }
    };

    res.type('application/importmap+json');
    res.json(importMap);
});

// 静态文件服务
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        // 为 .js 文件设置正确的 MIME 类型
        if (path.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        }
    }
}));

// 首页路由
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════════════════════╗
║           Import Maps 演示服务器已启动                      ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║  服务器地址: http://localhost:${PORT}                        ║
║                                                            ║
║  可用页面:                                                  ║
║  • http://localhost:${PORT}/                - 首页导航       ║
║  • http://localhost:${PORT}/01-basic-usage.html             ║
║  • http://localhost:${PORT}/02-scopes.html                  ║
║  • http://localhost:${PORT}/03-external-importmap.html      ║
║  • http://localhost:${PORT}/04-multiple-versions.html       ║
║  • http://localhost:${PORT}/05-practical-example.html       ║
║  • http://localhost:${PORT}/06-external-demo.html - 外部演示 ║
║                                                            ║
║  Import Map 端点:                                           ║
║  • /importmap.json          - 静态 importmap               ║
║  • /dynamic-importmap.json  - 动态 importmap               ║
║    └─ ?env=development      - 开发环境配置                  ║
║    └─ ?env=production       - 生产环境配置                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `);
});
