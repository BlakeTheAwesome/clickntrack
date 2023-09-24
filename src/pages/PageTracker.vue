<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Button from 'primevue/button'
import Splitter from 'primevue/splitter'
import SplitterPanel from 'primevue/splitterpanel'

import TrackerGrid from '@/components/Grid/TrackerGrid.vue'
import TrackerStatus from '@/components/TrackerStatus.vue'
import HeaderBar from '@/components/HeaderBar.vue'
import SettingsPanelVue from '@/components/SettingsPanel.vue'

import { useTrackerStore } from '@/stores/trackerStore'
import { useLayoutStore } from '@/stores/layoutStore'

const trackerStore = useTrackerStore()
const layoutStore = useLayoutStore()

const { cellSize, layout, itemShape, gridRowLength } = storeToRefs(layoutStore)

const filter = ref('')

function onKey(event: KeyboardEvent) {
  const key = event.key
  if (key.length == 1) {
    filter.value += key
  } else if (key == 'Backspace') {
    filter.value = filter.value.slice(0, -1)
  } else if (key == 'Escape') {
    filter.value = ''
  }
}

const showSettings = ref(true)
function toggleSettings() {
  showSettings.value = !showSettings.value
}

const bgColor = computed(() => layoutStore.bgColor)
const contentPadding = computed(() => {
  const minPadding = 16
  const padding = Math.max(minPadding, cellSize.value)
  return `${padding}px ${padding}px ${minPadding}px ${padding}px`
})
</script>

<template>
  <div class="page-tracker">
    <div class="pt-header">
      <HeaderBar>
        <template #actions>
          <Button
            v-tooltip.bottom="'Clear'"
            icon="pi pi-ban"
            severity="secondary"
            text
            raised
            rounded
            aria-label="Clear"
            @click="trackerStore.clearTracker"
          />
          <Button
            v-tooltip.bottom="'Settings'"
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
      <Splitter class="pt-splitter">
        <SplitterPanel :size="75" class="pt-content" tabindex="0" @keydown="onKey">
          <div class="pt-grid-area">
            <TrackerGrid
              :gridItems="trackerStore.gridItems"
              :gridRowLen="gridRowLength"
              :cellSize="cellSize"
              :layout="layout"
              :itemShape="itemShape"
              :filter="filter"
            />
            <TrackerStatus :items="trackerStore.gridItems" :filter="filter" />
          </div>
        </SplitterPanel>
        <SplitterPanel v-if="showSettings" :size="25" :min-size="25">
          <SettingsPanelVue class="pt-settings" />
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

  .pt-settings {
    position: sticky;
    top: 0;
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
