<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'
import type { ItemShape } from '@/stores/layoutStore'
const trackerStore = useTrackerStore()

const props = defineProps<{
  item: TrackerItem | null
  itemShape: ItemShape
  offsetRow: boolean
  filtered?: boolean
}>()

const margins = computed(() => {
  if (props.itemShape === 'Square') {
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

const overlayCol = computed(() => (props.item && props.filtered ? 'rgba(0, 0, 0, 0.5)' : 'transparent'))

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
  <div :class="`grid-icon layout-${itemShape.toLowerCase()}`" @click="onLeftClick" @click.right.prevent="onRightClick">
    <img v-if="item !== null" :src="item.img" :alt="item.displayName" />
    <div class="overlay"></div>
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
  grid: 'cell' 1fr / 1fr;

  &.layout-hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  & img {
    grid-area: cell;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  & .overlay {
    grid-area: cell;
    background-color: v-bind(overlayCol);
  }
}
</style>
