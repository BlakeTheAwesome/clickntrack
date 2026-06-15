<script setup lang="ts">
import { ref } from 'vue'
import type { SettingsExport } from '@/types/settingsExport'
import StoryComponent from './ImportDialog.vue'

const fullExport: SettingsExport = {
  version: 1,
  name: 'My Settings',
  board: {
    bgColor: '#ffffff',
    layout: 'Grid',
    itemShape: 'Square',
    gridRowLength: 10,
    cellSize: 48,
    keywordPrefix: ':',
    filterTextColor: '#666666',
    totalTextColor: '#992222',
    totalDisplayType: 'single-total',
  },
  itemDisplay: {
    displayType: 'Image',
    showTooltips: true,
    imageMargin: 0,
    highlightCoversImage: false,
    textLocation: 'CC',
    textMargin: 0,
    itemTextColor: '#ffffff',
    itemTextBackgroundColor: '#000000',
    itemTextBackgroundOpacityByte: 200,
    textSize: 16,
    markText: '★',
    markLocation: 'TL',
    markSize: 20,
    markMargin: 0,
    markColor: '#ffffff',
    markShadowColor: '#000000',
  },
  colors: [
    { id: -1, color: '#cccccc', countsTowardsTotal: false },
    { id: 0, color: '#ff0000', countsTowardsTotal: true },
    { id: 1, color: '#00ff00', countsTowardsTotal: true },
  ],
  itemSelection: {
    numItems: 151,
    seed: '',
    shuffleItems: true,
  },
  itemSet: [
    { id: 0, displayName: 'Bulbasaur' },
    { id: 1, displayName: 'Ivysaur' },
    { id: 2, displayName: 'Venusaur' },
  ],
}

const itemSetOnly: SettingsExport = {
  version: 1,
  itemSet: [
    { id: 0, displayName: 'Bulbasaur' },
    { id: 1, displayName: 'Ivysaur' },
    { id: 2, displayName: 'Venusaur' },
  ],
}

const colorsWithWarning: SettingsExport = {
  version: 1,
  colors: [
    { id: 1, color: '#ff0000', countsTowardsTotal: true },
    { id: 2, color: '#00ff00', countsTowardsTotal: false },
    { id: 3, color: '#0000ff', countsTowardsTotal: true },
  ],
}

const visibleFull = ref(true)
const visibleItemSet = ref(true)
const visibleColors = ref(true)
</script>

<template>
  <Story>
    <Variant title="Full Export">
      <button @click="visibleFull = true">Reopen</button>
      <StoryComponent v-model:visible="visibleFull" :data="fullExport" />
    </Variant>
    <Variant title="Item Set Only">
      <button @click="visibleItemSet = true">Reopen</button>
      <StoryComponent v-model:visible="visibleItemSet" :data="itemSetOnly" />
    </Variant>
    <Variant title="Colors with Warning">
      <button @click="visibleColors = true">Reopen</button>
      <StoryComponent v-model:visible="visibleColors" :data="colorsWithWarning" />
    </Variant>
  </Story>
</template>
