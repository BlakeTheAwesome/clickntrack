<script setup lang="ts">
import StoryComponent from './TrackerGrid.vue'
import { useTrackerStore } from '@/stores/trackerStore'
import SetLayoutStore from '@/components/Debug/SetLayoutStore.vue'
const trackerStore = useTrackerStore()
</script>

<template>
  <Story>
    <Variant title="Square Grid">
      <SetLayoutStore item-shape="Square" />
      <StoryComponent
        :grid-items="trackerStore.gridItems"
        :grid-row-len="10"
        :cell-size="48"
        layout="Grid"
        :filter="''"
      />
    </Variant>
    <Variant title="Hex Grid">
      <SetLayoutStore item-shape="Hex" />
      <StoryComponent
        :grid-items="trackerStore.gridItems"
        :grid-row-len="10"
        :cell-size="48"
        layout="Hex"
        :filter="''"
      />
    </Variant>
  </Story>
</template>
