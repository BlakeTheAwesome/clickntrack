<script setup lang="ts">
import PokemonTracker from '@/components/PokemonTracker.vue'
const dexNumbers = new Array(151).fill(0).map((_, i) => i + 1)
const rowLen = 10
</script>

<template>
  <PokemonTracker :dexNumbers="dexNumbers" :rowLen="rowLen" cellSize="3rem" layout="hex" />
</template>
