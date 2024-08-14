<script setup lang="ts">
import { useRouter } from 'vue-router'

import PageItemEditorLayout from '@/pages/PageItemEditorLayout.vue'

import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'

import pokemonList from '@/assets/pokemon-list.json'
import sm64List from '@/assets/sm64-list.json'
import bingoList from '@/assets/bingo-list.json'

const trackerStore = useTrackerStore()
const router = useRouter()

const presets = [
  { label: 'Pokemon', items: pokemonList },
  { label: 'SM64', items: sm64List },
  { label: 'Bingo', items: bingoList },
] as const

function exportJson(items: readonly TrackerItem[]) {
  const dataStr = JSON.stringify(items, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileDefaultName = 'data.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  document.removeChild(linkElement)
}
</script>

<template>
  <PageItemEditorLayout
    v-model:grid-items="trackerStore.allGridItems"
    :presets="presets"
    @init-tracker="trackerStore.initTracker($event)"
    @return-home="router.push({ name: 'tracker' })"
    @export-items="exportJson"
  />
</template>
