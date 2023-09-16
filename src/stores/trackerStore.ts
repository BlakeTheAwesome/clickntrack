import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'

type ItemState = { clickCount: number }
type IdState = Record<number, ItemState>

const defaultColours = [
  'black',
  '#cccccc',
  '#3366E6',
  '#FF6633',
  '#FFB399',
  '#FF33FF',
  '#FFFF99',
  '#00B3E6',
  '#E6B333',
  '#999966',
  '#99FF99',
  '#B34D4D',
  '#80B300',
]

export const useTrackerStore = defineStore('tracker', () => {
  const idState = reactive<IdState>({})
  const maxClickCount = ref(2)
  const colours = reactive(defaultColours)

  const numItems = ref(151)
  const seed = ref('')
  const shuffleItems = ref(false)

  function getClickInfo(id: number) {
    const count = idState[id]?.clickCount ?? 0
    const colour = colours[count + 1] ?? '#000000'
    return {
      count,
      colour,
    }
  }

  function incrementClickCount(id: number) {
    if (!idState[id]) {
      idState[id] = reactive({ clickCount: 0 })
    }
    idState[id].clickCount = Math.min(idState[id].clickCount + 1, maxClickCount.value)
  }

  function decrementClickCount(id: number) {
    if (!idState[id]) {
      idState[id] = reactive({ clickCount: 0 })
    }
    idState[id].clickCount = Math.max(idState[id].clickCount - 1, -1)
  }

  return { getClickInfo, incrementClickCount, decrementClickCount, maxClickCount, numItems, seed, shuffleItems }
})
