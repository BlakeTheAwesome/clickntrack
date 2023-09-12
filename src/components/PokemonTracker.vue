<script setup lang="ts">
import { computed } from 'vue'
import IconPokemon from './icons/IconPokemon.vue'

const props = defineProps<{
  dexNumbers: number[]
  gridRowLen: number
  cellSize: string
  layout: 'grid' | 'hex'
}>()

const filledRadius = computed(() => {
  let radius = numHexRings.value
  let numToFill = maxCellsInHexRadius(radius)
  if (numToFill > props.dexNumbers.length) {
    radius--
  }
  return radius
})

const rows = computed(() => {
  const itemsRemaining = [...props.dexNumbers]
  const rows: (number | null)[][] = []
  if (props.layout === 'hex') {
    let radius = filledRadius.value

    const numRows = radius * 2 - 1
    const midRowIndex = radius - 1
    for (let i = 0; i < numRows; i++) {
      let itemCount = radius
      itemCount += i < midRowIndex ? i : numRows - i - 1
      const items = itemsRemaining.splice(0, itemCount)
      rows.push(items)
    }

    // First fill on the right
    if (itemsRemaining.length > 0) {
      radius++
      const numToAdd = Math.min(rows.length, itemsRemaining.length)
      for (let i = 0; i < numToAdd; i++) {
        rows[i].push(itemsRemaining.shift() as number)
      }
      for (let i = numToAdd; i < rows.length; i++) {
        rows[i].push(null)
      }
    }

    // Next fill along the bottom
    if (itemsRemaining.length > 0) {
      const numToAdd = Math.min(radius - 1, itemsRemaining.length)
      const row: (number | null)[] = itemsRemaining.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      rows.push(row)
    }

    // Next fill on the top
    if (itemsRemaining.length > 0) {
      const numToAdd = Math.min(radius - 1, itemsRemaining.length)
      const row: (number | null)[] = itemsRemaining.splice(0, numToAdd)
      while (row.length < radius - 1) {
        row.push(null)
      }
      rows.unshift(row)
    }

    // Fill along the right again
    if (itemsRemaining.length > 0) {
      radius++
      const numToAdd = Math.min(rows.length, itemsRemaining.length)
      for (let i = 0; i < numToAdd; i++) {
        rows[i].push(itemsRemaining.shift() as number)
      }
      for (let i = numToAdd; i < rows.length; i++) {
        rows[i].push(null)
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
    if (maxCellsInHexRadius(radius) >= props.dexNumbers.length) {
      break
    }
    radius++
  }
  return radius
})

const rowLen = computed(() => {
  return rows.value.reduce((val, row) => Math.max(val, row.length), -Infinity)
})
</script>

<template>
  <div class="pokemon-tracker">
    <div :class="`pt-grid layout-${layout}`" @click.right.prevent="">
      <template v-for="(row, rowIdx) in rows" :key="rowIdx">
        <template v-for="(dexNum, dexIdx) in row" :key="`${rowIdx}-${dexIdx}`">
          <IconPokemon :dexNum="dexNum" :layout="layout" :offsetRow="rowIdx % 2 === (offsetOdd ? 1 : 0)" />
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
