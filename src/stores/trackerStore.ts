import { computed, reactive, ref } from 'vue'
import { defineStore, type StoreState } from 'pinia'
import type { ClickCountEntry } from '@/types/ClickCountEntry'
import type { TrackerItem } from '@/types/trackerItem'
import { shuffle } from '@/scripts/randomUtils'
import pokemonList from '@/assets/pokemon-list.json'

type ItemState = { clickCount: number; marked: boolean }
type IdState = Record<number, ItemState>

const defaultColours: ClickCountEntry[] = [
  { id: -1, color: '#000000', countsTowardsTotal: false },
  { id: 0, color: '#cccccc', countsTowardsTotal: false },
  { id: 1, color: '#3366E6', countsTowardsTotal: true },
  { id: 2, color: '#FF6633', countsTowardsTotal: true },
  { id: 3, color: '#66B399', countsTowardsTotal: true },
]

function newItem(): ItemState {
  return {
    clickCount: 0,
    marked: false,
  }
}

export const useTrackerStore = defineStore('tracker', () => {
  const idState = ref<IdState>({})
  const colours = ref(defaultColours)

  const numItems = ref(151)
  const seed = ref('')
  const shuffleItems = ref(true)

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
  const clickTotalsMap = computed(() => {
    const ret: Record<number, { total: number; info: ClickCountEntry }> = {}
    for (const entry of clickCountMap.value.values()) {
      if (entry.countsTowardsTotal) {
        ret[entry.id] = { total: 0, info: entry }
      }
    }

    const clickMap = clickCountMap.value
    for (const state of Object.values(idState.value)) {
      const entry = ret[state.clickCount]
      if (!entry) {
        if (!clickMap.has(state.clickCount)) {
          console.warn(`Unexpected click value: state.clickCount`)
        }
        continue
      }

      entry.total++
    }
    return ret
  })

  const totalCount = computed(() => {
    const totalsMap = clickTotalsMap.value
    let count = 0
    for (const entry of Object.values(totalsMap)) {
      count += entry.total
    }
    return count
  })

  function getOrCreateItem(id: number): ItemState {
    let entry = idState.value[id]
    if (!entry) {
      entry = reactive(newItem())
      idState.value[id] = entry
    }
    return entry
  }

  function getClickInfo(id: number) {
    const state = idState.value[id]
    const count = state?.clickCount ?? 0
    const colour = clickCountMap.value.get(count)?.color ?? '#000000'
    const marked = state?.marked

    return {
      count,
      colour,
      marked,
    }
  }

  function incrementClickCount(id: number) {
    const entry = getOrCreateItem(id)
    entry.clickCount = Math.min(entry.clickCount + 1, maxClickCount.value)
  }

  function decrementClickCount(id: number) {
    const entry = getOrCreateItem(id)
    entry.clickCount = Math.max(entry.clickCount - 1, minClickCount.value)
  }

  function toggleMarked(id: number) {
    const entry = getOrCreateItem(id)
    entry.marked = !entry.marked
  }

  function initTracker(items: readonly TrackerItem[]) {
    allGridItems.value = structuredClone(items) as TrackerItem[]
    clearTracker()
  }

  function clearTracker() {
    idState.value = {}
    for (const item of gridItems.value) {
      idState.value[item.id] = reactive(newItem())
    }
  }

  type TrackerStoreState = StoreState<ReturnType<typeof useTrackerStore>>
  function exportToJsonObj() {
    const store = useTrackerStore()
    const fieldsToOmit = ['idState']
    // cloning state using JSON.stringify as structured clone doesn't
    // work with store state
    const state = JSON.parse(JSON.stringify(store.$state)) as Record<string, unknown>
    for (const field of fieldsToOmit) {
      delete state[field]
    }

    const storeObj = {
      [store.$id]: state,
    } as const
    return storeObj
  }

  function importFromJsonObj(obj: Record<string, unknown>) {
    try {
      const store = useTrackerStore()
      if (!(store.$id in obj)) {
        return
      }
      const state = obj[store.$id] as Partial<TrackerStoreState> | undefined
      if (!state) {
        return
      }
      store.$patch(state)
      store.clearTracker()
    } catch (err) {
      throw new Error('Unable to load tracker store from string', {
        cause: err,
      })
    }
  }

  return {
    getClickInfo,
    incrementClickCount,
    decrementClickCount,
    toggleMarked,
    clearTracker,
    initTracker,
    exportToJsonObj,
    importFromJsonObj,
    idState,
    numItems,
    seed,
    shuffleItems,
    colours,
    clickTotalsMap,
    totalCount,
    gridItems,
    allGridItems,
  }
})
