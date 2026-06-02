<script setup lang="ts">
import { snapdom } from '@zumer/snapdom'
import { useTagStore } from '@/store'

const { tagImageUrl } = storeToRefs(useTagStore())
const { tagInfo } = useTagStore()
const tagEl = ref<HTMLDivElement | null>(null)

const hasTitle = computed(() =>
  !!tagInfo.restaurantName || !!tagInfo.mealType,
)

const hasDetail = computed(() =>
  !!tagInfo.description
  || tagInfo.energy !== null
  || tagInfo.health !== null
  || tagInfo.luck !== null
  || tagInfo.speed !== null
  || !!tagInfo.duration
  || tagInfo.price !== null,
)

// 标签转成图片
async function captureTag() {
  await nextTick()
  await new Promise(resolve => setTimeout(resolve, 50))

  const el = tagEl.value
  if (!el)
    return

  const canvas = await (await snapdom(el, { scale: 2, embedFonts: true })).toCanvas()
  tagImageUrl.value = canvas.toDataURL()
}

onMounted(() => {
  captureTag()
})

watch(() => ({ ...tagInfo }), () => {
  captureTag()
}, { deep: true })
</script>

<template>
  <div v-if="hasTitle || hasDetail" ref="tagEl" class="editor-tag">
    <div v-if="hasTitle" class="tag-title">
      <div class="tag-restaurantName">
        {{ tagInfo.restaurantName }}
      </div>
      <div class="tag-mealType">
        {{ tagInfo.mealType }}
      </div>
    </div>
    <div v-if="hasDetail" class="tag-detail">
      <div v-if="tagInfo.description" class="tag-description">
        {{ tagInfo.description }}
      </div>
      <div v-if="tagInfo.energy !== null" class="tag-energy tag-cell">
        <img src="@/assets/images/energy.png" alt="energy">
        <span>+{{ tagInfo.energy }}</span>能量
      </div>
      <div v-if="tagInfo.health !== null" class="tag-health tag-cell">
        <img src="@/assets/images/health.png" alt="health">
        <span>+{{ tagInfo.health }}</span>生命
      </div>
      <div v-if="tagInfo.luck !== null" class="tag-luck tag-cell">
        <img src="@/assets/images/luck.png" alt="luck">
        <span>+{{ tagInfo.luck }}</span>运气
      </div>
      <div v-if="tagInfo.speed !== null" class="tag-speed tag-cell">
        <img src="@/assets/images/speed.png" alt="speed">
        <span>+{{ tagInfo.speed }}</span>速度
      </div>
      <div v-if="tagInfo.duration" class="tag-duration tag-cell">
        <img src="@/assets/images/duration.png" alt="duration">
        <span>{{ tagInfo.duration }}</span>时间
      </div>
      <div v-if="tagInfo.price !== null" class="tag-price tag-cell">
        <span>{{ tagInfo.price }}</span>
        <img src="@/assets/images/price.png" alt="price">
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.editor-tag {
  width: 180px;
  margin-top: 26px;
  border-radius: 8px;
  background-color: #f1b670;
  color: #321F0E;
  font-weight: bold;
  word-break: break-word;
  .tag-title, .tag-detail {
    border: 8px solid rgb(0, 0, 0, 0.01);
    border-image: url('@/assets/images/card-bg.png') 15 stretch;
    padding: 4px;
  }
  .tag-detail {
    margin-top: -8px;
    font-size: 12px;
    div + div {
      margin-top: 2px;
    }
    span {
      font-size: 18px;
      font-weight: bold;
      padding-right: 14px;
    }
  }

  .tag-restaurantName {
    font-size: 20px;
    font-weight: bold;
  }
  .tag-mealType {
    font-size: 14px;
    color: #90521F;
  }
  .tag-description {
    font-size: 12px;
  }

  .tag-cell {
    display: flex;
    align-items: center;
    img {
      width: 20px;
      height: 20px;
      margin-right: 8px;
    }
  }
}
</style>
