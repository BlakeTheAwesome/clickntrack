<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'
import { useLayoutStore } from '@/stores/layoutStore'
const trackerStore = useTrackerStore()
const layoutStore = useLayoutStore()

const props = defineProps<{
  item: TrackerItem | null
  offsetRow: boolean
  filtered?: boolean
}>()

const margins = computed(() => {
  if (layoutStore.itemShape === 'Square') {
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

const overlayCol = computed(() => layoutStore.highlightCoversImage && trackerState.value?.count ? `${trackerState.value?.colour}77` : 'transparent' )

const filterOverlayCol = computed(() => (props.item && props.filtered ? 'rgba(0, 0, 0, 0.5)' : 'transparent'))

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

const layoutClass = computed(() => `layout-${layoutStore.itemShape.toLowerCase()}`);
const showImage = computed(() => layoutStore.displayType === 'Image' || layoutStore.displayType === 'Both');
const showText = computed(() => layoutStore.displayType === 'Text' || layoutStore.displayType === 'Both');
const textColor = computed(() => `#${layoutStore.itemTextColor}`);
const tooltip = computed(() => layoutStore.showTooltips && props.item !== null ? props.item.tooltip || props.item.displayName : null);
</script>

<template>
  <div class="grid-icon" v-tooltip.bottom="tooltip" :class="layoutClass" @click="onLeftClick" @click.right.prevent="onRightClick">
    <template v-if="item !== null">
      <img v-if="showImage" :src="item.img" :alt="item.displayName" />
      <div v-if="showText" class="gi-text">{{ item.overlayText ?? item.displayName }}</div>
      <div class="overlay"></div>
      <div class="filter-overlay"></div>
    </template>
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
    min-height: 0;
    min-width: 0;
    object-fit: contain;
  }

  & .gi-text {
    grid-area: cell;
    place-self: center;
    text-align: center;
    font-weight: bold;
    color: v-bind(textColor);
    background-color: rgba(0, 0, 0, 0.5);
    word-break: break-word;
  }

  & .overlay {
    grid-area: cell;
    background-color: v-bind(overlayCol);
  }
  

  & .filter-overlay {
    grid-area: cell;
    background-color: v-bind(filterOverlayCol);
  }
}
</style>
