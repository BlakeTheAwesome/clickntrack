import { ref } from 'vue'
import { defineStore } from 'pinia'

export const Layouts = ['Grid', 'Hex'] as const
export type Layout = (typeof Layouts)[number]
export const ItemShapes = ['Square', 'Hex'] as const
export type ItemShape = (typeof ItemShapes)[number]

export const useLayoutStore = defineStore('layout', () => {
  const bgColor = ref('#FFFFFF')
  const cellSize = ref(48)
  const layout = ref<Layout>('Grid')
  const itemShape = ref<ItemShape>('Square')
  const gridRowLength = ref(10)

  return { bgColor, cellSize, layout, itemShape, gridRowLength }
})
