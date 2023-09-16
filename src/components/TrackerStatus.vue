<script setup lang="ts">
import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'
import { computed } from 'vue'

const trackerStore = useTrackerStore()

const props = defineProps<{
  items: TrackerItem[]
  filter: string
}>()

const totalCount = computed(() => {
  let count = 0
  for (const item of props.items) {
    if (trackerStore.getClickInfo(item.id).count != 0) {
      count++
    }
  }
  return count
})
</script>

<template>
  <div class="tracker-status">
    <span class="ts-filter">{{ filter }}</span>
    <span class="ts-count">Total: {{ totalCount }}</span>
  </div>
</template>

<style scoped lang="postcss">
.tracker-status {
  font-family: 'Brush Script MT', cursive;
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-top: 0.5rem;
}

.ts-filter {
  color: #666;
}

.ts-count {
  color: #922;
}
</style>
