import { ref } from 'vue'
import { defineStore } from 'pinia'

export const Layouts = ['Grid', 'Hex'] as const
export type Layout = (typeof Layouts)[number]
export const ItemShapes = ['Square', 'Hex'] as const
export type ItemShape = (typeof ItemShapes)[number]
export const DisplayTypes = ['Image', 'Text', 'Both'] as const
export type DisplayType = (typeof DisplayTypes)[number]
export const TextLocations = ['TL', 'TC', 'TR', 'CL', 'CC', 'CR', 'BL', 'BC', 'BR'] as const
export type TextLocation = (typeof TextLocations)[number]

export const useLayoutStore = defineStore('layout', () => {
  const bgColor = ref('#FFFFFF')
  const itemTextColor = ref('#000000')
  const cellSize = ref(48)
  const layout = ref<Layout>('Grid')
  const itemShape = ref<ItemShape>('Square')
  const displayType = ref<DisplayType>('Image')
  const textLocation = ref<TextLocation>('CC')
  const gridRowLength = ref(10)
  const imageMargin = ref(0)
  const showTooltips = ref(true)
  const highlightCoversImage = ref(false)

  return {
    bgColor,
    itemTextColor,
    cellSize,
    layout,
    itemShape,
    displayType,
    gridRowLength,
    showTooltips,
    highlightCoversImage,
    textLocation,
    imageMargin,
  }
})
