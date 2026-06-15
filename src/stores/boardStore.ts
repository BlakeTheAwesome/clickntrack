import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ItemShape, Layout, TotalDisplayType } from '@/types/layoutTypes'

export const useBoardStore = defineStore('board', () => {
  const bgColor = ref('#FFFFFF')
  const layout = ref<Layout>('Grid')
  const itemShape = ref<ItemShape>('Square')
  const gridRowLength = ref(10)
  const cellSize = ref(48)
  const keywordPrefix = ref(':')
  const filterTextColor = ref('#666666')
  const totalTextColor = ref('#992222')
  const totalDisplayType = ref<TotalDisplayType>('single-total')

  return {
    bgColor,
    layout,
    itemShape,
    gridRowLength,
    cellSize,
    keywordPrefix,
    filterTextColor,
    totalTextColor,
    totalDisplayType,
  }
})
