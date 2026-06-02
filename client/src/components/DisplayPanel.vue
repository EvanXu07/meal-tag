<script setup lang="ts">
import { Button, Slider } from '@pixelium/web-vue/es'
import { useAnalyzeImage } from '@/composables/useAnalyzeImage'
import { useLeaferCanvas } from '@/composables/useLeaferCanvas'

const { analyzing, analyzeFoodImage } = useAnalyzeImage()
const { zoom, init, loadImage, resetPosition, download } = useLeaferCanvas()

const fileInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
  init('leaf-canvas')
})

function handleUploadClick() {
  if (analyzing.value)
    return
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file)
    return

  loadImage(file)
  await analyzeFoodImage(file)
  target.value = ''
}
</script>

<template>
  <div class="display-panel">
    <div class="panel-top">
      <div class="panel-zoom">
        <img src="@/assets/images/zoom.png" alt="zoom">
        <div>标签缩放</div>
        <div class="panel-slider">
          <Slider v-model="zoom" :tooltip="false" :max="200" />
        </div>
        <div class="panel-value">
          {{ (zoom / 100).toFixed(2) }}
        </div>
      </div>

      <div class="panel-reset">
        <Button color="#90521F" shape="round" @click="resetPosition">
          重置位置
        </Button>
      </div>

      <div class="panel-tip">
        鼠标按住标签卡片即可拖动位置
      </div>
    </div>

    <div class="panel-content">
      <div id="leaf-canvas" class="leaf-canvas" />
    </div>

    <div class="panel-bottom">
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        style="display: none"
        @change="handleFileChange"
      >
      <Button color="#90521F" shape="round" @click="handleUploadClick">
        {{ analyzing ? '分析中...' : '上传食物图片' }}
      </Button>
      <Button color="#538A2C" shape="round" @click="download">
        下载最终图片
      </Button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.display-panel {
  width: 770px;
  height: 716px;
  margin-left: 20px;
  border-radius: 14px;
  border: 2px solid #855d39;
  background-color: #321f0e;
  box-shadow: 0 0 4px 2px #855d39;
  padding: 12px;

  :deep(.px-button) {
    border-width: 0;
    font-size: 12px;
    color: #f6c87d;
    min-width: 104px;
    justify-content: center;
  }

  .panel-top {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #f6c87d;
    .panel-zoom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #90521f;
      height: 38px;
      width: 310px;
      padding: 0 20px;
      border-radius: 18px;
      border: 4px solid #30281f;
      img {
        width: 20px;
        height: 20px;
        margin-left: -10px;
      }
      .panel-slider {
        width: 160px;
        :deep(.px-slider-thumb) {
          width: 20px;
          height: 20px;
        }
      }
      .panel-value {
        width: 20px;
        font-weight: bold;
      }
    }
    .panel-tip {
      margin-left: 60px;
      font-size: 12px;
      color: #f6c87d;
    }
  }

  .panel-reset {
    margin-left: 60px;
  }

  .panel-content {
    width: 100%;
    height: 580px;
    margin-top: 12px;
    border: 12px solid rgb(0, 0, 0, 0.01);
    border-image: url('@/assets/images/card-bg.png') 15 stretch;
    background-color: #000;
    overflow: hidden;
    .leaf-canvas {
      width: 100%;
      height: 100%;
    }
  }

  .panel-bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 14px;
    gap: 20px;
  }
}
</style>
