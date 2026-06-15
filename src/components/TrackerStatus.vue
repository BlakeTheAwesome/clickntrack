<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useTrackerStore } from '@/stores/trackerStore'
import { useBoardStore } from '@/stores/boardStore'
import { computed } from 'vue'

const trackerStore = useTrackerStore()
const boardStore = useBoardStore()
const { totalCount, clickTotalsMap } = storeToRefs(trackerStore)
const { filterTextColor, totalTextColor, totalDisplayType } = storeToRefs(boardStore)

defineProps<{
  filter: string
}>()

const showTotal = computed(() => {
  switch (totalDisplayType.value) {
    case 'single-total':
    case 'both':
      return true
  }
  return false
})

const showIndividualCounts = computed(() => {
  switch (totalDisplayType.value) {
    case 'individual-counts':
    case 'both':
      return true
  }
  return false
})
</script>

<template>
  <div class="tracker-status font-comic">
    <span class="ts-filter ts-grow">{{ filter }}</span>
    <span v-if="showTotal" class="ts-count">
      <span>Total: {{ totalCount }}</span>
      <span v-if="showIndividualCounts">&nbsp;&nbsp;</span>
    </span>
    <template v-if="showIndividualCounts">
      <span v-for="(entry, id) in clickTotalsMap" :key="id" :style="`color:${entry.info.color};`">{{
        entry.total
      }}</span>
    </template>
  </div>
</template>

<style scoped lang="postcss">
.tracker-status {
  font-size: 1.5rem;
  display: flex;
  flex-direction: row;
  padding-top: 0.5rem;
  gap: 1rem;
}

.ts-filter {
  color: v-bind(filterTextColor);
}

.ts-count {
  color: v-bind(totalTextColor);
}

.ts-grow {
  flex-grow: 1;
}
</style>
