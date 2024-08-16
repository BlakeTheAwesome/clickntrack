<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './PageTrackerLayout.vue'

import { useTrackerStore } from '@/stores/trackerStore'

const trackerStore = useTrackerStore()
</script>

<template>
  <Story>
    <StoryComponent :gridItems="trackerStore.gridItems" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
