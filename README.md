# 料理标签工厂 (Meal Tag Factory)

上传食物照片，AI 自动识别菜品信息并生成游戏风格的料理标签卡。

## 技术栈

| 层级 | 技术 |
|---|---|
| 前端 | Vue 3 + TypeScript + Vite + Pinia + Leafer.js |
| 后端 | Hono + TypeScript + OpenAI SDK |
| AI 模型 | 阿里云百炼 Qwen3.6-VL（视觉理解） |
| 包管理 | pnpm workspace |

## 项目结构

```
meal-tag/
├── client/                # Vue 3 前端
│   └── src/
│       ├── components/    # UI 组件
│       │   ├── DisplayPanel.vue   # 画布 + 图片上传 + 标签叠加
│       │   ├── EditorPanel.vue    # 标签属性编辑表单
│       │   ├── EditorField.vue    # 单个编辑字段
│       │   └── EditorTag.vue      # 标签卡片预览
│       ├── composables/   # 逻辑 hooks
│       │   ├── useAnalyzeImage.ts # AI 图片分析
│       │   └── useLeaferCanvas.ts # 画布渲染管理
│       ├── store/         # Pinia 状态
│       ├── types/         # TypeScript 类型
│       ├── views/         # 页面组件
│       └── assets/        # 静态资源
├── server/                # Hono 后端
│   └── src/
│       ├── index.ts       # 入口 + 路由
│       ├── services/
│       │   └── qwen.ts    # Qwen3.6 API 调用
│       └── types/         # 共享类型
├── package.json           # workspace 根配置
└── pnpm-workspace.yaml    # pnpm monorepo 配置
```

## 快速开始

### 环境要求

- Node.js >= 18
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

### 配置 API Key

```bash
# 后端
cp server/.env.example server/.env
```

编辑 `server/.env`，填入阿里云百炼 API Key：

```
DASHSCOPE_API_KEY=sk-your-api-key
```

> 获取 API Key：https://help.aliyun.com/zh/model-studio/get-api-key

### 启动开发服务器

```bash
# 同时启动前后端
pnpm dev
```

| 服务 | 地址 |
|---|---|
| 前端 (Vite) | http://localhost:5173 |
| 后端 (Hono) | http://localhost:3001 |

## 使用流程

1. 点击「上传食物图片」选择一张食物照片
2. 图片上传后，后端调用 Qwen3.6 视觉模型自动识别并填充标签信息
3. 标签卡片叠加在画布上，可 **拖拽移动**、**拖拽四角缩放**
4. 使用标签缩放滑块或编辑面板手动调整属性
5. 点击「下载最终图片」导出 PNG

## TagInfo 字段

```ts
{
  restaurantName: string   // 餐厅名称
  mealType: string         // 菜品类型
  price: number | null     // 价格（金币 G）
  description: string      // 风味描述
  energy: number | null    // 能量值 1-100
  health: number | null    // 生命值 1-100
  luck: number | null      // 运气值 1-100
  speed: number | null     // 速度值 1-100
  duration: string         // 持续时间
}
```

## API

### POST /api/analyze

上传图片进行 AI 分析。

- **Content-Type**: `multipart/form-data`
- **字段**: `image` - 图片文件
- **响应**: `TagInfo` JSON

