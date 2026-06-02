import { useTagStore } from '@/store'

// 上传图片到后端，返回 TagInfo 写入 Pinia
export function useAnalyzeImage() {
  const { tagInfo, resetTagInfo } = useTagStore()
  const analyzing = ref(false)

  const analyzeFoodImage = async (file: File) => {
    // 清空旧数据
    resetTagInfo()
    analyzing.value = true
    try {
      const formData = new FormData()
      formData.append('image', file)

      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || '分析失败')
      }

      const data = await res.json()
      Object.assign(tagInfo, data)
    }
    catch (err) {
      console.error('AI 分析失败:', err)
    }
    finally {
      analyzing.value = false
    }
  }

  return { analyzing, analyzeFoodImage }
}
