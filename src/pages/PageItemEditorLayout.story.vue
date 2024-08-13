<script setup lang="ts">
import { ref } from 'vue'
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './PageItemEditorLayout.vue'

import { useTrackerStore } from '@/stores/trackerStore'

import pokemonList from '@/assets/pokemon-list.json'
import sm64List from '@/assets/sm64-list.json'
import bingoList from '@/assets/bingo-list.json'

const trackerStore = useTrackerStore()

const presets = [
  { label: 'Pokemon', items: pokemonList },
  { label: 'SM64', items: sm64List },
  { label: 'Bingo', items: bingoList },
] as const

const gridItems = ref(trackerStore.allGridItems)
</script>

<template>
  <Story>
    <StoryComponent v-on="logEmits(StoryComponent)" v-model:grid-items="gridItems" :presets="presets" />
  </Story>
</template>
