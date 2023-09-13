<script setup lang="ts">
import TrackerGrid from '@/components/Grid/TrackerGrid.vue'
import { computed, ref } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import { shuffle } from '@/scripts/randomUtils'
import pokemonList from '@/assets/pokemon-list.json'
const trackerStore = useTrackerStore()

const numItems = ref(151)
const rowLen = ref(10)
const isHex = ref(false)
const shuffleItems = ref(false)
const cellSize = ref('48px')
const filter = ref('')
const seed = ref('')

const items = computed(() => {
  if (shuffleItems.value) {
    return shuffle(pokemonList, seed.value).slice(0, numItems.value)
  } else {
    const itemSelection = pokemonList.slice(0, numItems.value)
    return shuffle(itemSelection, seed.value)
  }
})
const layout = computed(() => (isHex.value ? 'hex' : 'grid'))

function onKey(event: KeyboardEvent) {
  const key = event.key
  if (key.length == 1) {
    filter.value += key
  } else if (key == 'Backspace') {
    filter.value = filter.value.slice(0, -1)
  } else if (key == 'Escape') {
    filter.value = ''
  }
}
</script>

<template>
  <span>rowLen: <input type="number" min="1" max="1000" v-model="rowLen" /></span>
  <span>numItems: <input type="number" min="1" max="10000" v-model="numItems" /></span>
  <span>maxClicks: <input type="number" min="1" max="100" v-model="trackerStore.maxClickCount" /></span>
  <span>cellSize: <input type="text" size="8" v-model="cellSize" /></span>
  <span>seed: <input type="text" v-model="seed" /></span>
  <span>filter: <input type="filter" v-model="filter" /></span>
  <span>isHex: <input type="checkbox" v-model="isHex" /></span>
  <span>shuffleItems: <input type="checkbox" v-model="shuffleItems" /></span>

  <TrackerGrid
    class="pt-tracker-grid"
    tabindex="0"
    :gridItems="items"
    :gridRowLen="rowLen"
    :cellSize="cellSize"
    :layout="layout"
    :filter="filter"
    @keydown="onKey"
  />
</template>

<style scoped lang="postcss">
.pt-tracker-grid {
  &:focus,
  &:focus-visible,
  &:focus-within {
    outline: none;
  }
}
</style>
