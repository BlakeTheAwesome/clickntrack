import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ClickCountEntry } from '@/types/ClickCountEntry'

type ItemState = { clickCount: number }
type IdState = Map<number, ItemState>

const defaultColours: ClickCountEntry[] = [
  { id: -1, color: '#000000', countsTowardsTotal: false },
  { id: 0, color: '#cccccc', countsTowardsTotal: true },
  { id: 1, color: '#3366E6', countsTowardsTotal: true },
  { id: 2, color: '#FF6633', countsTowardsTotal: true },
  { id: 3, color: '#66B399', countsTowardsTotal: true },
]

export const useTrackerStore = defineStore('tracker', () => {
  const idState = ref<IdState>(new Map())
  const colours = ref(defaultColours)

  const numItems = ref(151)
  const seed = ref('')
  const shuffleItems = ref(false)

  const minClickCount = computed(() => colours.value[0]?.id ?? 0)
  const maxClickCount = computed(() => colours.value.at(-1)?.id ?? 0)
  const clickCountMap = computed(() => new Map(colours.value.map((x) => [x.id, x])))
  const totalCount = computed(() => {
    const clickMap = clickCountMap.value
    let count = 0
    for (const state of idState.value.values()) {
      const clickInfo = clickMap.get(state.clickCount)
      const increment = clickInfo?.countsTowardsTotal ? 1 : 0
      count += increment
    }
    return count
  })

  function getClickInfo(id: number) {
    const count = idState.value.get(id)?.clickCount ?? 0
    const colour = clickCountMap.value.get(count)?.color ?? '#000000'
    return {
      count,
      colour,
    }
  }

  function incrementClickCount(id: number) {
    let entry = idState.value.get(id)
    if (!entry) {
      entry = reactive({ clickCount: 0 })
      idState.value.set(id, entry)
    }
    entry.clickCount = Math.min(entry.clickCount + 1, maxClickCount.value)
  }

  function decrementClickCount(id: number) {
    let entry = idState.value.get(id)
    if (!entry) {
      entry = reactive({ clickCount: 0 })
      idState.value.set(id, entry)
    }
    entry.clickCount = Math.max(entry.clickCount - 1, minClickCount.value)
  }

  function clearTracker() {
    idState.value.forEach((state) => (state.clickCount = 0))
  }

  return {
    getClickInfo,
    incrementClickCount,
    decrementClickCount,
    idState,
    numItems,
    seed,
    shuffleItems,
    clearTracker,
    colours,
    totalCount,
  }
})
