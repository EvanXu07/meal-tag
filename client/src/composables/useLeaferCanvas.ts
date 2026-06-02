import type { Leafer as LeaferType, UI } from 'leafer-ui'
import { Frame, Leafer, Image as LeaferImage } from 'leafer-ui'
import { useTagStore } from '@/store'
import '@leafer-in/export'

// 画布尺寸
const CANVAS_W = 722
const CANVAS_H = 556
// 标签与图片边缘的间距
const TAG_MARGIN = 30

// Leafer 画布管理：背景图载入、可拖拽标签叠加、缩放、导出
export function useLeaferCanvas() {
  const { tagImageUrl } = storeToRefs(useTagStore())

  // 标签缩放比例，100 = 原始大小
  const zoom = ref(100)

  let leafer: LeaferType | null = null
  // 用户上传的背景图
  let bgImage: UI | null = null
  // 可拖拽的标签容器
  let tagFrame: Frame | null = null
  // 标签图片
  let tagImg: UI | null = null

  // 背景图在画布中的位置与尺寸
  let imgX = 0
  let imgY = 0
  let imgW = 0
  let imgH = 0

  // 根据缩放值调整标签大小，并修正越界
  const applyZoom = (val: number) => {
    if (!tagFrame)
      return
    const scale = val / 100
    tagFrame.scaleX = scale
    tagFrame.scaleY = scale

    const w = (tagFrame.width ?? 0) * scale
    const h = (tagFrame.height ?? 0) * scale
    const fx = tagFrame.x ?? 0
    const fy = tagFrame.y ?? 0

    if (fx < 0)
      tagFrame.x = 0
    if (fy < 0)
      tagFrame.y = 0
    if (fx + w > CANVAS_W)
      tagFrame.x = CANVAS_W - w
    if (fy + h > CANVAS_H)
      tagFrame.y = CANVAS_H - h
  }

  // 根据 store 中的 tagImageUrl 构建可拖拽标签
  const buildTag = () => {
    // 记录旧位置，重建时尽量保持原位
    const prevX = tagFrame?.x
    const prevY = tagFrame?.y

    if (tagFrame) {
      tagFrame.remove()
      tagFrame = null
    }
    if (tagImg) {
      tagImg.remove()
      tagImg = null
    }

    if (!tagImageUrl.value)
      return

    const img = new window.Image()
    img.onload = () => {
      // 标签显示为原始尺寸的一半
      const wi = img.naturalWidth / 2
      const hi = img.naturalHeight / 2

      // 默认位置：背景图右下角向左偏移 TAG_MARGIN
      const baseX = imgW ? imgX : 0
      const baseY = imgW ? imgY + imgH : CANVAS_H

      const posX = prevX ?? baseX + TAG_MARGIN
      const posY = prevY ?? baseY - hi - TAG_MARGIN

      // 用 Frame 包裹，支持拖拽
      tagFrame = new Frame({
        x: posX,
        y: posY,
        width: wi,
        height: hi,
        draggable: true,
        cursor: 'move',
        // 限制拖拽范围不超出画布
        dragBounds: { x: 0, y: 0, width: CANVAS_W, height: CANVAS_H },
        dragBoundsType: 'outer',
      })

      tagImg = new LeaferImage({
        url: tagImageUrl.value,
        width: wi,
        height: hi,
      })
      tagFrame.add(tagImg)

      // 应用当前缩放
      const scale = zoom.value / 100
      tagFrame.scaleX = scale
      tagFrame.scaleY = scale

      // 修正越界
      const sw = wi * scale
      const sh = hi * scale
      const tx = tagFrame.x ?? 0
      const ty = tagFrame.y ?? 0
      if (tx < 0)
        tagFrame.x = 0
      if (ty < 0)
        tagFrame.y = 0
      if (tx + sw > CANVAS_W)
        tagFrame.x = CANVAS_W - sw
      if (ty + sh > CANVAS_H)
        tagFrame.y = CANVAS_H - sh

      leafer?.add(tagFrame)
    }
    img.src = tagImageUrl.value
  }

  // 初始化 Leafer 实例并构建初始标签
  const init = (containerId: string) => {
    leafer = new Leafer({
      view: containerId,
      width: CANVAS_W,
      height: CANVAS_H,
    })
    buildTag()
  }

  // 载入用户上传的图片，等比缩放居中显示
  const loadImage = (file: File) => {
    const url = URL.createObjectURL(file)

    const nativeImg = new window.Image()
    nativeImg.onload = () => {
      const nw = nativeImg.naturalWidth
      const nh = nativeImg.naturalHeight
      // 等比缩放，不超出画布
      const scale = Math.min(CANVAS_W / nw, CANVAS_H / nh)
      imgW = nw * scale
      imgH = nh * scale
      // 居中放置
      imgX = (CANVAS_W - imgW) / 2
      imgY = (CANVAS_H - imgH) / 2

      if (bgImage)
        bgImage.remove()
      bgImage = new LeaferImage({ url, x: imgX, y: imgY, width: imgW, height: imgH })
      leafer?.add(bgImage)
      buildTag()
    }
    nativeImg.src = url
  }

  // 重置标签到默认位置和大小
  const resetPosition = () => {
    zoom.value = 100

    if (!tagFrame)
      return

    tagFrame.scaleX = 1
    tagFrame.scaleY = 1

    const baseX = imgW ? imgX : 0
    const baseY = imgW ? imgY + imgH : CANVAS_H

    tagFrame.x = baseX + TAG_MARGIN
    tagFrame.y = baseY - (tagFrame.height ?? 0) - TAG_MARGIN
  }

  // 导出画布为 PNG 并触发下载
  const download = () => {
    if (!leafer)
      return
    leafer.export('png', { quality: 1 }).then((data) => {
      const a = document.createElement('a')
      a.download = '料理标签.png'
      a.href = data.data
      a.click()
    })
  }

  // tagImageUrl 变化时重建标签
  watch(tagImageUrl, () => {
    buildTag()
  })

  // zoom 变化时调整标签缩放
  watch(zoom, (val) => {
    applyZoom(val)
  })

  return {
    zoom,
    init,
    loadImage,
    buildTag,
    resetPosition,
    download,
  }
}
