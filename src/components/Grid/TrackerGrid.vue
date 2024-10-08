<script setup lang="ts">
import { computed } from 'vue'
import GridIcon from './GridIcon.vue'
import { getIdsToFilterOut } from '@/scripts/filterUtils'
import type { TrackerItem } from '@/types/trackerItem'
import { type Layout, useLayoutStore } from '@/stores/layoutStore'
const layoutStore = useLayoutStore()

// Add a 'search key' prop here
const props = defineProps<{
  gridItems: readonly TrackerItem[]
  gridRowLen: number
  cellSize: number
  filter?: string
  keywordPrefix: string
  layout: Layout
}>()

const filledRadius = computed(() => {
  let radius = numHexRings.value
  let numToFill = maxCellsInHexRadius(radius)
  if (numToFill > props.gridItems.length) {
    radius--
  }
  return radius
})

const EmptyCell = Symbol('EmptyCell')

type ItemRow = (TrackerItem | null)[]
const rows = computed<ItemRow[]>(() => {
  if (props.layout === 'Hex') {
    type PlaceholderItem = typeof EmptyCell | null
    const placeholderRows: PlaceholderItem[][] = []
    const placeholders = new Array<PlaceholderItem>(props.gridItems.length).fill(EmptyCell)
    let radius = filledRadius.value

    const numRows = radius * 2 - 1
    const midRowIndex = radius - 1
    for (let i = 0; i < numRows; i++) {
      let itemCount = radius
      itemCount += i < midRowIndex ? i : numRows - i - 1
      const items = placeholders.splice(0, itemCount)
      placeholderRows.push(items)
    }

    // First fill on the right
    if (placeholders.length > 0) {
      radius++
      const numToAdd = Math.min(placeholderRows.length, placeholders.length)
      for (let i = 0; i < numToAdd; i++) {
        placeholderRows[i].push(placeholders.shift() as PlaceholderItem)
      }
      for (let i = numToAdd; i < placeholderRows.length; i++) {
        placeholderRows[i].push(null)
      }
    }

    // Next fill along the bottom
    if (placeholders.length > 0) {
      const numToAdd = Math.min(radius - 1, placeholders.length)
      const row = placeholders.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      placeholderRows.push(row)
    }

    // Next fill on the top
    if (placeholders.length > 0) {
      const numToAdd = Math.min(radius - 1, placeholders.length)
      const row = placeholders.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      placeholderRows.unshift(row)
    }

    // Fill along the right again
    if (placeholders.length > 0) {
      radius++
      const numToAdd = Math.min(placeholderRows.length, placeholders.length)
      for (let i = 0; i < numToAdd; i++) {
        placeholderRows[i].push(placeholders.shift() as PlaceholderItem)
      }
      for (let i = numToAdd; i < placeholderRows.length; i++) {
        placeholderRows[i].push(null)
      }
    }

    const rows: ItemRow[] = []
    const itemsRemaining = [...props.gridItems]
    for (const placeholderRow of placeholderRows) {
      const row = new Array<TrackerItem | null>(placeholderRow.length)
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== null) {
          row[i] = itemsRemaining.shift() ?? null
        }
      }
      rows.push(row)
    }
    console.assert(itemsRemaining.length === 0, 'Not all items were placed in the grid')

    const expectedRowLength = rows.reduce((val, row) => Math.max(val, row.length), -Infinity)
    for (const row of rows) {
      let fillEnd = true
      while (row.length < expectedRowLength) {
        if (fillEnd) {
          row.push(null)
        } else {
          row.unshift(null)
        }
        fillEnd = !fillEnd
      }
    }
    return rows
  } else {
    const rows: ItemRow[] = []
    const itemsRemaining = [...props.gridItems]
    for (let i = 0; i < itemsRemaining.length; i += props.gridRowLen) {
      rows.push(itemsRemaining.slice(i, i + props.gridRowLen))
    }
    return rows
  }
})

const padding = computed(() => {
  const basePadding = 2
  const hexPadding = Math.ceil(basePadding * 0.75) + 1
  switch (layoutStore.itemShape) {
    case 'Hex':
      return `${basePadding}px ${hexPadding}px`
    case 'Square':
    default:
      return `${basePadding}px`
  }
})

function maxCellsInHexRadius(radius: number) {
  const radExcCenter = radius - 1
  return 1 + 3 * radExcCenter * (radExcCenter + 1)
}

const offsetOdd = computed(() => {
  let longestRowIndex = 0
  let numElements = 0
  for (let i = 0; i < rows.value.length; i++) {
    const row = rows.value[i]
    const nonNullCount = row.filter((val) => val !== null).length
    if (nonNullCount >= numElements) {
      longestRowIndex = i
      numElements = nonNullCount
    }
  }
  return longestRowIndex % 2 === 1
})

const numHexRings = computed(() => {
  let radius = 1

  while (true) {
    if (maxCellsInHexRadius(radius) >= props.gridItems.length) {
      break
    }
    radius++
  }
  return radius
})

const rowLen = computed(() => {
  return rows.value.reduce((val, row) => Math.max(val, row.length), -Infinity)
})

const filteredIds = computed(() => {
  if (!props.filter) {
    return new Set()
  }
  return getIdsToFilterOut(props.filter, props.keywordPrefix, props.gridItems)
})

const cellSizeStr = computed(() => `${props.cellSize}px`)

const margins = computed(() => {
  if (layoutStore.itemShape === 'Square') {
    return '0'
  }
  const halfCellSize = Math.floor(props.cellSize / 2)
  const eighthCellSize = Math.floor(props.cellSize / 8)
  return `${eighthCellSize}px -${halfCellSize}px ${eighthCellSize}px ${halfCellSize}px`
})
</script>

<template>
  <div :class="`tracker-grid layout-${layout.toLowerCase()}`">
    <div :class="`tg-grid layout-${layout.toLowerCase()}`" @click.right.prevent="">
      <template v-for="(row, rowIdx) in rows" :key="rowIdx">
        <template v-for="(item, itemIdx) in row" :key="`${item?.id}-${itemIdx}`">
          <GridIcon
            :item="item"
            :offsetRow="rowIdx % 2 === (offsetOdd ? 1 : 0)"
            :filtered="filteredIds.has(item?.id)"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.tracker-grid {
  width: min-content;
  margin: v-bind(margins);
}
.tg-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(rowLen), v-bind(cellSizeStr));
  grid-auto-rows: v-bind(cellSizeStr);
  width: min-content;

  &.layout-hex {
    grid-auto-rows: calc(v-bind(cellSizeStr) * 0.75);
  }
  gap: v-bind(padding);
}
</style>
