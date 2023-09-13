<script setup lang="ts">
import PokemonTracker from '@/components/PokemonTracker.vue'
import { computed, ref } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import { shuffle } from '@/scripts/randomUtils'
const trackerStore = useTrackerStore()

const numItems = ref(151)
const rowLen = ref(10)
const isHex = ref(false)
const cellSize = ref('48px')
const seed = ref('')

const items = computed(() => {
  const itemSelection = new Array(numItems.value).fill(0).map((_, i) => i + 1)
  return shuffle(itemSelection, seed.value)
})
const layout = computed(() => (isHex.value ? 'hex' : 'grid'))
</script>

<template>
  <span>rowLen: <input type="number" min="1" max="1000" v-model="rowLen" /></span>
  <span>numItems: <input type="number" min="1" max="10000" v-model="numItems" /></span>
  <span>maxClicks: <input type="number" min="1" max="100" v-model="trackerStore.maxClickCount" /></span>
  <span>cellSize: <input type="text" size="8" v-model="cellSize" /></span>
  <span>seed: <input type="text" v-model="seed" /></span>
  <span>isHex: <input type="checkbox" v-model="isHex" /></span>

  <PokemonTracker :dexNumbers="items" :gridRowLen="rowLen" :cellSize="cellSize" :layout="layout" />
</template>
