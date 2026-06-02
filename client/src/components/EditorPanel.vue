<script setup lang="ts">
import descriptionIcon from '@/assets/images/description.png'
import durationIcon from '@/assets/images/duration.png'
import energyIcon from '@/assets/images/energy.png'
import healthIcon from '@/assets/images/health.png'
import luckIcon from '@/assets/images/luck.png'
import mealIcon from '@/assets/images/meal.png'
import priceIcon from '@/assets/images/price.png'
import restaurantIcon from '@/assets/images/restaurant.png'
import speedIcon from '@/assets/images/speed.png'
import { useTagStore } from '@/store'

const { tagInfo } = useTagStore()
</script>

<template>
  <div class="editor-panel">
    <EditorField v-model="tagInfo.restaurantName" label="餐厅名称" :icon="restaurantIcon" />

    <div class="field-row">
      <EditorField v-model="tagInfo.mealType" label="菜品类型" :icon="mealIcon" />
      <EditorField v-model="tagInfo.price" label="价格（G）" type="number" :icon="priceIcon" />
    </div>

    <EditorField v-model="tagInfo.description" label="描述（风味小字）" type="textarea" :icon="descriptionIcon" />

    <div class="field-row">
      <EditorField v-model="tagInfo.energy" label="能量" type="number" :icon="energyIcon" />
      <EditorField v-model="tagInfo.health" label="生命值" type="number" :icon="healthIcon" />
      <EditorField v-model="tagInfo.luck" label="运气" type="number" :icon="luckIcon" />
      <EditorField v-model="tagInfo.speed" label="速度" type="number" :icon="speedIcon" />
    </div>

    <EditorField v-model="tagInfo.duration" label="持续时间" :icon="durationIcon" />

    <EditorTag />
  </div>
</template>

<style lang="scss" scoped>
.editor-panel {
  width: 470px;
  height: 716px;
  border-radius: 14px;
  border: 2px solid #491500;
  background-color: #90521F;
  box-shadow: 0 0 4px 2px #491500;
  box-sizing: border-box;
  padding: 20px;

  .field-row {
    display: flex;
    gap: 20px;

    :deep(.editor-content) {
      flex: 1;
    }
  }
}
</style>
