import { computed, reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import type { ClickCountEntry } from '@/types/ClickCountEntry'
import type { TrackerItem } from '@/types/trackerItem'
import { shuffle } from '@/scripts/randomUtils'
import pokemonList from '@/assets/pokemon-list.json'

type ItemState = { clickCount: number }
type IdState = Record<number, ItemState>

const defaultColours: ClickCountEntry[] = [
  { id: -1, color: '#000000', countsTowardsTotal: false },
  { id: 0, color: '#cccccc', countsTowardsTotal: false },
  { id: 1, color: '#3366E6', countsTowardsTotal: true },
  { id: 2, color: '#FF6633', countsTowardsTotal: true },
  { id: 3, color: '#66B399', countsTowardsTotal: true },
]

export const useTrackerStore = defineStore('tracker', () => {
  const idState = ref<IdState>({})
  const colours = ref(defaultColours)

  const numItems = ref(151)
  const seed = ref('')
  const shuffleItems = ref(false)

  const allGridItems = ref<TrackerItem[]>(pokemonList)
  const gridItems = computed(() => {
    const baseList: TrackerItem[] = allGridItems.value
    if (shuffleItems.value) {
      return shuffle(baseList, seed.value).slice(0, numItems.value)
    } else {
      const itemSelection = baseList.slice(0, numItems.value)
      return shuffle(itemSelection, seed.value)
    }
  })

  const minClickCount = computed(() => colours.value[0]?.id ?? 0)
  const maxClickCount = computed(() => colours.value.at(-1)?.id ?? 0)
  const clickCountMap = computed(() => new Map(colours.value.map((x) => [x.id, x])))
  const totalCount = computed(() => {
    const clickMap = clickCountMap.value
    let count = 0
    for (const state of Object.values(idState.value)) {
      const clickInfo = clickMap.get(state.clickCount)
      const increment = clickInfo?.countsTowardsTotal ? 1 : 0
      count += increment
    }
    return count
  })

  function getClickInfo(id: number) {
    const count = idState.value[id]?.clickCount ?? 0
    const colour = clickCountMap.value.get(count)?.color ?? '#000000'
    return {
      count,
      colour,
    }
  }

  function incrementClickCount(id: number) {
    let entry = idState.value[id]
    if (!entry) {
      entry = reactive({ clickCount: 0 })
      idState.value[id] = entry
    }
    entry.clickCount = Math.min(entry.clickCount + 1, maxClickCount.value)
  }

  function decrementClickCount(id: number) {
    let entry = idState.value[id]
    if (!entry) {
      entry = reactive({ clickCount: 0 })
      idState.value[id] = entry
    }
    entry.clickCount = Math.max(entry.clickCount - 1, minClickCount.value)
  }

  function initTracker(items: TrackerItem[]) {
    allGridItems.value = structuredClone(items)
    clearTracker()
  }

  function clearTracker() {
    idState.value = {}
    for (const item of gridItems.value) {
      idState.value[item.id] = reactive({ clickCount: 0 })
    }
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
    initTracker,
    colours,
    totalCount,
    gridItems,
    allGridItems,
  }
})
