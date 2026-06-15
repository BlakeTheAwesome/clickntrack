<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore'
import type { TrackerItem } from '@/types/trackerItem'
import { useBoardStore } from '@/stores/boardStore'
import { useItemDisplayStore } from '@/stores/itemDisplayStore'
const trackerStore = useTrackerStore()
const boardStore = useBoardStore()
const itemDisplayStore = useItemDisplayStore()

const props = defineProps<{
  item: TrackerItem | null
  offsetRow: boolean
  filtered?: boolean
}>()

const margins = computed(() => {
  if (boardStore.itemShape === 'Square') {
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

const overlayCol = computed(() =>
  itemDisplayStore.highlightCoversImage && trackerState.value?.count
    ? `${trackerState.value?.colour}77`
    : 'transparent',
)

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

function onMiddleClick() {
  if (itemId.value !== null) {
    trackerStore.toggleMarked(itemId.value)
  }
}

const layoutClass = computed(() => `layout-${boardStore.itemShape.toLowerCase()}`)
const showImage = computed(() => itemDisplayStore.displayType === 'Image' || itemDisplayStore.displayType === 'Both')
const showText = computed(() => itemDisplayStore.displayType === 'Text' || itemDisplayStore.displayType === 'Both')
const showMark = computed(() => trackerState.value?.marked ?? false)
const markColor = computed(() => itemDisplayStore.markColor)
const markShadowColor = computed(() => itemDisplayStore.markShadowColor)
const textColor = computed(() => itemDisplayStore.itemTextColor)
const textBackgroundColor = computed(
  () => `${itemDisplayStore.itemTextBackgroundColor}${itemDisplayStore.itemTextBackgroundOpacityByte.toString(16)}`,
)
const tooltip = computed(() =>
  itemDisplayStore.showTooltips && props.item !== null ? props.item.tooltip || props.item.displayName : null,
)

const markAlign = computed(() => {
  switch (itemDisplayStore.markLocation) {
    case 'TL':
    case 'TC':
    case 'TR':
      return 'start'
    case 'CL':
    case 'CC':
    case 'CR':
      return 'center'
    case 'BL':
    case 'BC':
    case 'BR':
      return 'end'
  }
  throw new Error('Invalid text location')
})
const markJustify = computed(() => {
  switch (itemDisplayStore.markLocation) {
    case 'TL':
    case 'CL':
    case 'BL':
      return 'start'
    case 'TC':
    case 'CC':
    case 'BC':
      return 'center'
    case 'TR':
    case 'CR':
    case 'BR':
      return 'end'
  }
  throw new Error('Invalid text location')
})

const textAlign = computed(() => {
  switch (itemDisplayStore.textLocation) {
    case 'TL':
    case 'TC':
    case 'TR':
      return 'start'
    case 'CL':
    case 'CC':
    case 'CR':
      return 'center'
    case 'BL':
    case 'BC':
    case 'BR':
      return 'end'
  }
  throw new Error('Invalid text location')
})
const textJustify = computed(() => {
  switch (itemDisplayStore.textLocation) {
    case 'TL':
    case 'CL':
    case 'BL':
      return 'start'
    case 'TC':
    case 'CC':
    case 'BC':
      return 'center'
    case 'TR':
    case 'CR':
    case 'BR':
      return 'end'
  }
  throw new Error('Invalid text location')
})
const textMargins = computed(() => {
  if (boardStore.itemShape === 'Square') {
    return `${itemDisplayStore.textMargin}px`
  }
  return `25% ${itemDisplayStore.textMargin}px`
})
const markMargins = computed(() => {
  if (boardStore.itemShape === 'Square') {
    return `${itemDisplayStore.markMargin}px`
  }
  return `25% ${itemDisplayStore.markMargin}px`
})
const textSize = computed(() => `${itemDisplayStore.textSize}px`)
const markSize = computed(() => `${itemDisplayStore.markSize}px`)

const imageMargins = computed(() => `${itemDisplayStore.imageMargin}px`)
</script>

<template>
  <div
    v-tooltip.bottom="tooltip"
    class="grid-icon"
    :class="layoutClass"
    @click="onLeftClick"
    @click.right.prevent="onRightClick"
    @click.middle.prevent="onMiddleClick"
    @mousedown.middle.prevent.stop
  >
    <template v-if="item !== null">
      <div class="gi-image-container">
        <img v-if="showImage" :src="item.img" :alt="item.displayName" />
      </div>
      <div v-if="showText" class="gi-text">
        {{ item.overlayText ?? item.displayName }}
      </div>
      <div v-if="showMark" class="gi-mark">
        {{ itemDisplayStore.markText }}
      </div>
      <div class="overlay" />
      <div class="filter-overlay" />
    </template>
  </div>
</template>

<style lang="postcss">
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

  & .gi-image-container {
    grid-area: cell;
    min-height: 0;
    min-width: 0;
    overflow: hidden;

    & img {
      height: calc(100% - v-bind(imageMargins));
      width: calc(100% - v-bind(imageMargins));
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      object-fit: contain;
    }
  }

  & .gi-text {
    grid-area: cell;
    align-self: v-bind(textAlign);
    justify-self: v-bind(textJustify);
    text-align: v-bind(textJustify);
    margin: v-bind(textMargins);
    font-weight: bold;
    color: v-bind(textColor);
    background-color: v-bind(textBackgroundColor);
    word-break: break-word;
    font-size: v-bind(textSize);
    z-index: 100;
    padding-inline: 2px;
  }

  & .gi-mark {
    grid-area: cell;
    align-self: v-bind(markAlign);
    justify-self: v-bind(markJustify);
    margin: v-bind(markMargins);
    color: v-bind(markColor);
    text-shadow: v-bind(markShadowColor) 2px 0 10px;
    font-weight: bold;
    word-break: break-word;
    line-height: 0.8em;
    font-size: v-bind(markSize);
    z-index: 100;
  }

  & .overlay {
    grid-area: cell;
    background-color: v-bind(overlayCol);
    z-index: 99;
  }

  & .filter-overlay {
    grid-area: cell;
    background-color: v-bind(filterOverlayCol);
    z-index: 101;
  }
}
</style>
