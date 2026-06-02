import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { serve } from '@hono/node-server'
import { analyzeImage } from './services/qwen'
import type { TagInfo } from './types'

const app = new Hono()

app.use('/*', cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
}))

app.post('/api/analyze', async (c) => {
  try {
    const formData = await c.req.formData()
    const file = formData.get('image')

    if (!file || !(file instanceof File)) {
      return c.json({ error: '请上传图片文件' }, 400)
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString('base64')
    const mimeType = file.type || 'image/jpeg'

    const tagInfo: TagInfo = await analyzeImage(base64, mimeType)

    return c.json(tagInfo)
  }
  catch (err) {
    const message = err instanceof Error ? err.message : '服务器内部错误'
    console.error('分析失败:', err)
    return c.json({ error: message }, 500)
  }
})

const port = Number(process.env.PORT) || 3001
console.log(`Server running at http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port,
})
