import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AnchorLocation, DisplayType, ItemShape, Layout } from '@/types/layoutTypes'

export const useLayoutStore = defineStore('layout', () => {
  const bgColor = ref('#FFFFFF')
  const itemTextColor = ref('#ffffff')
  const markColor = ref('#ffffff')
  const markShadowColor = ref('#000000')
  const markText = ref('★')
  const itemTextBackgroundColor = ref('#000000')
  const itemTextBackgroundOpacityByte = ref(200)
  const cellSize = ref(48)
  const layout = ref<Layout>('Grid')
  const itemShape = ref<ItemShape>('Square')
  const displayType = ref<DisplayType>('Image')
  const markLocation = ref<AnchorLocation>('TL')
  const textLocation = ref<AnchorLocation>('CC')
  const gridRowLength = ref(10)
  const imageMargin = ref(0)
  const textMargin = ref(0)
  const markMargin = ref(0)
  const showTooltips = ref(true)
  const textSize = ref(16)
  const markSize = ref(20)
  const highlightCoversImage = ref(false)
  const keywordPrefix = ref(':')

  return {
    bgColor,
    itemTextColor,
    itemTextBackgroundColor,
    itemTextBackgroundOpacityByte,
    cellSize,
    layout,
    itemShape,
    displayType,
    gridRowLength,
    showTooltips,
    highlightCoversImage,
    textLocation,
    textMargin,
    imageMargin,
    textSize,
    markLocation,
    markText,
    markSize,
    markColor,
    markShadowColor,
    markMargin,
    keywordPrefix,
  }
})
