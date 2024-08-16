<script setup lang="ts">
import StoryComponent from './TrackerGrid.vue'
import { useTrackerStore } from '@/stores/trackerStore'
import SetLayoutStore from '@/components/Debug/SetLayoutStore.vue'
const trackerStore = useTrackerStore()
</script>

<template>
  <Story>
    <Variant title="Square Grid">
      <SetLayoutStore itemShape="Square" />
      <StoryComponent
        :gridItems="trackerStore.gridItems"
        :gridRowLen="10"
        :cellSize="48"
        layout="Grid"
        :filter="''"
      />
    </Variant>
    <Variant title="Hex Grid">
      <SetLayoutStore itemShape="Hex" />
      <StoryComponent
        :gridItems="trackerStore.gridItems"
        :gridRowLen="10"
        :cellSize="48"
        layout="Hex"
        :filter="''"
      />
    </Variant>
  </Story>
</template>
