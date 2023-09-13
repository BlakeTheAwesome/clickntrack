<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'
const trackerStore = useTrackerStore()

const props = defineProps<{
  item: TrackerItem | null
  layout: 'grid' | 'hex'
  offsetRow: boolean
}>()

const margins = computed(() => {
  if (props.layout === 'grid') {
    return '0'
  }
  if (props.offsetRow) {
    return '-12.5% calc(50% + 1px) -12.5% calc(-50% - 1px)'
  }
  return '-12.5% calc(0%) -12.5% calc(0%)'
})

const itemId = computed(() => props.item?.id ?? null)

const trackerState = computed(() => (itemId.value === null ? null : trackerStore.getClickInfo(itemId.value)))

const bgCol = computed(() => trackerState.value?.colour ?? 'transparent')

function onLeftClick() {
  if (itemId.value !== null) {
    trackerStore.incrementClickCount(itemId.value)
  }
}

function onRightClick() {
  if (itemId.value !== null) {
    trackerStore.decrementClickCount(itemId.value)
  }
}
</script>

<template>
  <div :class="`grid-icon layout-${layout}`" @click="onLeftClick" @click.right.prevent="onRightClick">
    <img v-if="item !== null" :src="item.img" :alt="item.displayName" />
  </div>
</template>

<style scoped lang="postcss">
.grid-icon {
  display: grid;
  place-content: center;
  background-color: v-bind(bgCol);
  margin: v-bind(margins);
  user-select: none;
  cursor: pointer;

  &.layout-hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>
