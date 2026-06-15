<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'
import { useConfirm } from 'primevue/useconfirm'
import ConfirmDialog from 'primevue/confirmdialog'

import TrackerGrid from '@/components/Grid/TrackerGrid.vue'
import TrackerStatus from '@/components/TrackerStatus.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import SettingsPanel from '@/components/SettingsPanel/SettingsPanel.vue'

import { useBoardStore } from '@/stores/boardStore'
import type { TrackerItem } from '@/types/trackerItem'
import { useKeyboardFilter } from '@/scripts/filterUtils'

const props = defineProps<{
  gridItems: readonly TrackerItem[]
}>()

const emit = defineEmits<{
  openItemEditor: []
  clearTracker: []
}>()

const boardStore = useBoardStore()
const { cellSize, layout, gridRowLength, keywordPrefix } = storeToRefs(boardStore)

const { filter, onKeydown } = useKeyboardFilter()
const confirmDialog = useConfirm()

const showSettings = ref(true)
function toggleSettings() {
  showSettings.value = !showSettings.value
}

const bgColor = computed(() => boardStore.bgColor)
const contentPadding = computed(() => {
  const minPadding = 16
  const padding = Math.max(minPadding, cellSize.value)
  return `${padding}px ${padding}px ${minPadding}px ${padding}px`
})

function clearBoard() {
  confirmDialog.require({
    message: 'Are you sure you want to clear all the clicks off the board?',
    header: 'Clear',
    icon: 'pi pi-exclamation-triangle',
    reject: () => {},
    accept: () => {
      emit('clearTracker')
    },
  })
}
</script>

<template>
  <div class="page-tracker">
    <div class="pt-header">
      <ConfirmDialog />
      <HeaderBar>
        <template #actions>
          <Button
            v-tooltip.bottom="'Clear Clicks'"
            icon="pi pi-ban"
            severity="secondary"
            text
            raised
            rounded
            aria-label="Clear"
            @click="clearBoard"
          />
          <Button
            v-tooltip.bottom="'Toggle Settings'"
            icon="pi pi-cog"
            severity="secondary"
            text
            raised
            rounded
            aria-label="Toggle Settings"
            @click="toggleSettings"
          />
        </template>
      </HeaderBar>
    </div>
    <div>
      <Splitter :key="String(showSettings)" class="pt-splitter">
        <SplitterPanel :size="75" class="pt-content" tabindex="0" @keydown="onKeydown">
          <div class="pt-grid-area">
            <TrackerGrid
              :gridItems="props.gridItems"
              :gridRowLen="gridRowLength"
              :cellSize="cellSize"
              :layout="layout"
              :filter="filter"
              :keywordPrefix="keywordPrefix"
            />
            <TrackerStatus :filter="filter" />
          </div>
        </SplitterPanel>
        <SplitterPanel v-if="showSettings" :size="35" :minSize="25">
          <SettingsPanel @openItemSetEditor="emit('openItemEditor')" />
        </SplitterPanel>
      </Splitter>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.page-tracker {
  height: 100%;
  display: grid;
  grid:
    'header' auto
    'content' 1fr / 1fr;

  .pt-content {
    background-color: v-bind(bgColor);
  }
}

.pt-splitter {
  border: none;
  height: 100%;
}

.pt-grid-area {
  width: min-content;
  padding: v-bind(contentPadding);
}

.pt-content {
  &:focus,
  &:focus-visible,
  &:focus-within {
    outline: none;
  }
}
</style>
