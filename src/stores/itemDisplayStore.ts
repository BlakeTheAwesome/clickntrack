import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AnchorLocation, DisplayType } from '@/types/layoutTypes'

export const useItemDisplayStore = defineStore('itemDisplay', () => {
  const displayType = ref<DisplayType>('Image')
  const showTooltips = ref(true)
  const imageMargin = ref(0)
  const highlightCoversImage = ref(false)
  const textLocation = ref<AnchorLocation>('CC')
  const textMargin = ref(0)
  const itemTextColor = ref('#ffffff')
  const itemTextBackgroundColor = ref('#000000')
  const itemTextBackgroundOpacityByte = ref(200)
  const textSize = ref(16)
  const markText = ref('★')
  const markLocation = ref<AnchorLocation>('TL')
  const markSize = ref(20)
  const markMargin = ref(0)
  const markColor = ref('#ffffff')
  const markShadowColor = ref('#000000')

  return {
    displayType,
    showTooltips,
    imageMargin,
    highlightCoversImage,
    textLocation,
    textMargin,
    itemTextColor,
    itemTextBackgroundColor,
    itemTextBackgroundOpacityByte,
    textSize,
    markText,
    markLocation,
    markSize,
    markMargin,
    markColor,
    markShadowColor,
  }
})
