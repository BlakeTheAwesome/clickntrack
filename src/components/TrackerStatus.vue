<script setup lang="ts">
import { useTrackerStore } from '@/stores/trackerStore'
const trackerStore = useTrackerStore()

defineProps<{
  filter: string
}>()
</script>

<template>
  <div class="tracker-status font-comic">
    <span class="ts-filter">{{ filter }}</span>
    <span class="ts-count">Total: {{ trackerStore.totalCount }}</span>
  </div>
</template>

<style scoped lang="postcss">
.tracker-status {
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
