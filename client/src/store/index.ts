import type { TagInfo } from '@/types'
import { createPinia } from 'pinia'

export const store = createPinia()

export const useTagStore = defineStore('meal', () => {
  const defaultTagInfo: TagInfo = {
    restaurantName: '',
    mealType: '',
    price: null,
    description: '',
    energy: null,
    health: null,
    luck: null,
    speed: null,
    duration: '',
  }

  const tagInfo = reactive<TagInfo>({ ...defaultTagInfo })

  const tagImageUrl = ref('')

  const resetTagInfo = () => {
    Object.assign(tagInfo, defaultTagInfo)
    tagImageUrl.value = ''
  }

  return {
    tagInfo,
    tagImageUrl,
    resetTagInfo,
  }
})
