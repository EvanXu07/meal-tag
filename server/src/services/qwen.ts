import OpenAI from 'openai'
import type { TagInfo } from '../types'

const client = new OpenAI({
  apiKey: process.env.DASHSCOPE_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
})

const SYSTEM_PROMPT = `你是一个美食分析专家。请根据用户提供的食物图片，参考星露谷物语，分析并返回以下信息的JSON格式：

{
  "restaurantName": "餐厅名称（如能识别，否则根据食物风格起一个合适的名字）",
  "mealType": "菜品名称（如：鱼香肉丝、红烧肉、青椒肉丝等）",
  "price": 价格数字（单位是RMB，根据现实合理估算，纯数字，不要带单位）,
  "description": "风味描述小字（15字以内，要吸引人）",
  "energy": 能量值（1-100的整数，根据食物的热量和饱腹感判断）,
  "health": 生命值（1-100的整数，根据食物的营养健康程度判断）,
  "luck": 运气值（1-10的整数，根据食物的精致程度和稀有度判断）,
  "speed": 速度值（1-10的整数，根据食物吃起来是否快捷方便判断）,
  "duration": "持续时间（如：0-1小时之间，返回的结构为00:00）"
}

注意：
- price、energy、health、luck、speed 必须是纯数字，不能为null
- 如果图片中没有食物，请将各个字段填为合理的默认值
- 只返回JSON，不要包含任何其他文字`

export async function analyzeImage(imageBase64: string, mimeType: string): Promise<TagInfo> {
  const dataUrl = `data:${mimeType};base64,${imageBase64}`

  const response = await client.chat.completions.create({
    model: 'qwen3-vl-flash',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: [
          {
            type: 'image_url',
            image_url: { url: dataUrl },
          },
          { type: 'text', text: '请分析这张食物图片' },
        ],
      },
    ],
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('Qwen API 返回内容为空')
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    throw new Error('无法从 Qwen 返回中解析 JSON')
  }

  const parsed = JSON.parse(jsonMatch[0]) as TagInfo

  return {
    restaurantName: parsed.restaurantName || '',
    mealType: parsed.mealType || '',
    price: typeof parsed.price === 'number' ? parsed.price : null,
    description: parsed.description || '',
    energy: typeof parsed.energy === 'number' ? parsed.energy : null,
    health: typeof parsed.health === 'number' ? parsed.health : null,
    luck: typeof parsed.luck === 'number' ? parsed.luck : null,
    speed: typeof parsed.speed === 'number' ? parsed.speed : null,
    duration: parsed.duration || '',
  }
}
