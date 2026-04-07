const Koa = require('koa')
const Router = require('@koa/router')
const { koaBody } = require('koa-body')
const cors = require('@koa/cors')
const path = require('path')
const fs = require('fs')

const app = new Koa()
const router = new Router()

const UPLOAD_DIR = path.join(__dirname, 'uploads')
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR)

app.use(cors())
app.use(koaBody({
  urlencoded: true,
  multipart: true,
  formidable: {
    uploadDir: UPLOAD_DIR,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024,
  }
}))

// 静态服务
router.get('/', async (ctx) => {
  ctx.type = 'html'
  ctx.body = fs.createReadStream(path.join(__dirname, 'index.html'))
})

// ── 路由 1：application/x-www-form-urlencoded ────────────────────────────────
router.post('/submit-urlencoded', async (ctx) => {
  const body = ctx.request.body
  console.log('\n[urlencoded] Content-Type:', ctx.headers['content-type'])
  console.log('解析结果:', body)
  ctx.body = {
    type: 'application/x-www-form-urlencoded',
    contentType: ctx.headers['content-type'],
    fields: body,
    note: '数据以 key=value&key=value 格式传输，特殊字符经过 percent-encoding'
  }
})

// ── 路由 2：multipart/form-data ──────────────────────────────────────────────
router.post('/submit-multipart', async (ctx) => {
  const fields = ctx.request.body
  const files = ctx.request.files || {}
  console.log('\n[multipart] Content-Type:', ctx.headers['content-type'])
  console.log('文本字段:', fields)
  console.log('文件字段:', Object.keys(files))

  const fileInfo = {}
  for (const [key, file] of Object.entries(files)) {
    const f = Array.isArray(file) ? file[0] : file
    if (f && f.size > 0) {
      fileInfo[key] = {
        originalName: f.originalFilename,
        mimeType: f.mimetype,
        size: `${(f.size / 1024).toFixed(2)} KB`,
        savedAs: path.basename(f.filepath)
      }
    }
  }
  ctx.body = {
    type: 'multipart/form-data',
    contentType: ctx.headers['content-type'],
    fields,
    files: fileInfo,
    note: '文本字段和文件各自是独立的 part，文件以二进制原样传输'
  }
})

// ── 路由 3：错误示范 - 有文件但用 urlencoded ────────────────────────────────
router.post('/submit-wrong', async (ctx) => {
  const body = ctx.request.body
  console.log('\n[wrong] Content-Type:', ctx.headers['content-type'])
  console.log('解析结果:', body)
  ctx.body = {
    type: 'application/x-www-form-urlencoded',
    contentType: ctx.headers['content-type'],
    fields: body,
    warning: '⚠ 文件字段收到的是 "[object File]" 字符串，二进制内容完全丢失！服务端无法获取文件数据。',
    explanation: 'URLSearchParams 对 File 对象调用 .toString()，得到 "[object File]"，经 percent-encoding 后变为 %5Bobject+File%5D，文件内容从未被包含在请求中。'
  }
})

// ── 路由 4：错误示范 - GET + 文件 ────────────────────────────────────────────
router.get('/submit-get', async (ctx) => {
  const query = ctx.query
  console.log('\n[get] Query String:', ctx.querystring)
  console.log('解析结果:', query)
  ctx.body = {
    method: 'GET',
    queryString: ctx.querystring,
    fields: query,
    warning: '⚠ GET 请求中 enctype 完全无效，数据拼入 URL 查询字符串，File 对象被 toString() 成 "[object File]"，二进制内容完全丢失。',
    explanation: 'GET 请求没有 body，所有字段都序列化为 URL 查询参数。URLSearchParams 对 File 对象调用 .toString() 得到 "[object File]"，文件内容从未被发送。'
  }
})

// ── 路由 5：fetch + FormData 但强制 urlencoded（Content-Type 与 body 不匹配）────
router.post('/submit-mismatch', async (ctx) => {
  const body = ctx.request.body
  const rawBody = ctx.request.rawBody

  console.log('\n[mismatch] Content-Type:', ctx.headers['content-type'])
  console.log('解析结果:', body)

  ctx.body = {
    contentType: ctx.headers['content-type'],
    parsed: body,
    rawBodyPreview: rawBody ? rawBody.slice(0, 200) + (rawBody.length > 200 ? '...' : '') : null,
    warning: '⚠ Content-Type 声明为 urlencoded，但 body 实际是 multipart 格式。服务端按 urlencoded 解析，得到乱码或空对象。',
    explanation: '手动设置 Content-Type 覆盖了浏览器自动生成的 multipart/form-data; boundary=...，导致服务端无法找到 boundary，解析完全失败。'
  }
})

app.use(router.routes()).use(router.allowedMethods())

const PORT = 3000
app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`)
  console.log('等待请求...\n')
})
