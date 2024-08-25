<script setup lang="ts">
import type { ClickCountEntry } from '@/types/ClickCountEntry'
import StoryComponent from './ClickCountEditor.vue'
import { ref } from 'vue'

function genClickCounts(): ClickCountEntry[] {
  return [
    {
      id: 1,
      color: '#0000FF',
      countsTowardsTotal: true,
    },
    {
      id: 2,
      color: '#00FF00',
      countsTowardsTotal: false,
    },
    {
      id: 3,
      color: '#FF0000',
      countsTowardsTotal: true,
    },
    {
      id: 4,
      color: '#FF00FF',
      countsTowardsTotal: false,
    },
  ]
}

const items = ref(genClickCounts())
</script>

<template>
  <Story>
    <StoryComponent v-model:items="items" />
  </Story>
</template>
