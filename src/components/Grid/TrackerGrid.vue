<script setup lang="ts">
import { computed } from 'vue'
import GridIcon from './GridIcon.vue'
import { getIdsToFilterOut } from '@/scripts/filterUtils'
import type { TrackerItem } from '@/types/trackerItem'

// Add a 'search key' prop here
const props = defineProps<{
  gridItems: TrackerItem[]
  gridRowLen: number
  cellSize: string
  filter?: string
  layout: 'grid' | 'hex'
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

const rows = computed(() => {
  const placeholders = new Array(props.gridItems.length).fill(EmptyCell)
  const rows: (TrackerItem | null)[][] = []
  if (props.layout === 'hex') {
    let radius = filledRadius.value

    const numRows = radius * 2 - 1
    const midRowIndex = radius - 1
    for (let i = 0; i < numRows; i++) {
      let itemCount = radius
      itemCount += i < midRowIndex ? i : numRows - i - 1
      const items = placeholders.splice(0, itemCount)
      rows.push(items)
    }

    // First fill on the right
    if (placeholders.length > 0) {
      radius++
      const numToAdd = Math.min(rows.length, placeholders.length)
      for (let i = 0; i < numToAdd; i++) {
        rows[i].push(placeholders.shift() as TrackerItem)
      }
      for (let i = numToAdd; i < rows.length; i++) {
        rows[i].push(null)
      }
    }

    // Next fill along the bottom
    if (placeholders.length > 0) {
      const numToAdd = Math.min(radius - 1, placeholders.length)
      const row = placeholders.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      rows.push(row)
    }

    // Next fill on the top
    if (placeholders.length > 0) {
      const numToAdd = Math.min(radius - 1, placeholders.length)
      const row = placeholders.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      rows.unshift(row)
    }

    // Fill along the right again
    if (placeholders.length > 0) {
      radius++
      const numToAdd = Math.min(rows.length, placeholders.length)
      for (let i = 0; i < numToAdd; i++) {
        rows[i].push(placeholders.shift() as TrackerItem)
      }
      for (let i = numToAdd; i < rows.length; i++) {
        rows[i].push(null)
      }
    }

    const itemsRemaining = [...props.gridItems]
    for (const row of rows) {
      for (let i = 0; i < row.length; i++) {
        if (row[i] !== null) {
          row[i] = itemsRemaining.shift() as TrackerItem
        }
      }
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
  } else {
    const itemsRemaining = [...props.gridItems]
    for (let i = 0; i < itemsRemaining.length; i += props.gridRowLen) {
      rows.push(itemsRemaining.slice(i, i + props.gridRowLen))
    }
  }
  return rows
})

const padding = computed(() => {
  const paddingVal = 2
  switch (props.layout) {
    case 'hex':
      return `${paddingVal}px calc(${paddingVal}px * 0.75)`
    case 'grid':
    default:
      return `${paddingVal}px`
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
  // eslint-disable-next-line no-constant-condition
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
  return getIdsToFilterOut(props.filter, props.gridItems)
})
</script>

<template>
  <div class="tracker-grid">
    <div :class="`pt-grid layout-${layout}`" @click.right.prevent="">
      <template v-for="(row, rowIdx) in rows" :key="rowIdx">
        <template v-for="(item, itemIdx) in row" :key="`${item?.id}-${itemIdx}`">
          <GridIcon
            :item="item"
            :layout="layout"
            :offsetRow="rowIdx % 2 === (offsetOdd ? 1 : 0)"
            :filtered="filteredIds.has(item?.id)"
          />
        </template>
      </template>
    </div>
  </div>
</template>

<style scoped>
.pt-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(rowLen), v-bind(cellSize));
  grid-auto-rows: v-bind(cellSize);
  margin: v-bind(cellSize);

  &.layout-hex {
    grid-auto-rows: calc(v-bind(cellSize) * 0.75);
    border: 2px solid white;
  }
  grid-gap: v-bind(padding);
}
</style>
