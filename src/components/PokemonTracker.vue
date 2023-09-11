<script setup lang="ts">
import { computed } from 'vue'
import IconPokemon from './icons/IconPokemon.vue'

const props = defineProps<{
  dexNumbers: number[]
  rowLen: number
  cellSize: string
  layout: 'grid' | 'hex'
}>()

const rows = computed(() => {
  const rows = []
  for (let i = 0; i < props.dexNumbers.length; i += props.rowLen) {
    rows.push(props.dexNumbers.slice(i, i + props.rowLen))
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
</script>

<template>
  <div class="pokemon-tracker">
    <div :class="`pt-grid layout-${layout}`">
      <template v-for="(row, rowIdx) in rows" :key="rowIdx">
        <IconPokemon
          v-for="dexNum in row"
          :key="dexNum"
          :dexNum="dexNum"
          :layout="layout"
          :offsetRow="rowIdx % 2 === 1"
        />
      </template>
    </div>
  </div>
</template>

<style scoped>
.pt-grid {
  display: grid;
  grid-template-columns: repeat(v-bind(rowLen), v-bind(cellSize));
  grid-auto-rows: v-bind(cellSize);

  &.layout-hex {
    grid-auto-rows: calc(v-bind(cellSize) * 0.75);
    border: 2px solid white;
  }
  grid-gap: v-bind(padding);
}
</style>
