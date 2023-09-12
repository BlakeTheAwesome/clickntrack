<script setup lang="ts">
import { computed, ref } from 'vue'
import PokemonTracker from '@/components/PokemonTracker.vue'
const numItems = ref(151)
const rowLen = ref(10)
const isHex = ref(false)
const cellSize = ref('3rem')

const dexNumbers = computed(() => new Array(numItems.value).fill(0).map((_, i) => i + 1))
const layout = computed(() => (isHex.value ? 'hex' : 'grid'))
</script>

<template>
  <span>rowLen: <input type="number" v-model="rowLen" /></span>
  <span>numItems: <input type="number" v-model="numItems" /></span>
  <span>isHex: <input type="checkbox" v-model="isHex" /></span>

  <PokemonTracker :dexNumbers="dexNumbers" :gridRowLen="rowLen" :cellSize="cellSize" :layout="layout" />
</template>
