<script setup lang="ts">
import StoryComponent from './GridIcon.vue'
import { useTrackerStore } from '@/stores/trackerStore'
import SetLayoutStore from '@/components/Debug/SetLayoutStore.vue'
import { computed } from 'vue'
const trackerStore = useTrackerStore()

const item = computed(() => trackerStore.gridItems[0])

// Could potentially add more variants here with 'SetLayoutStore' configuring
</script>

<template>
  <Story>
    <Variant title="Square">
      <SetLayoutStore itemShape="Square" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
    <Variant title="Hex">
      <SetLayoutStore itemShape="Hex" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
    <Variant title="Hex Filtered">
      <SetLayoutStore itemShape="Hex" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="true" />
    </Variant>
  </Story>
</template>
