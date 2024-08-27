<script setup lang="ts">
import { computed } from 'vue'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'

import { useLayoutStore } from '@/stores/layoutStore'
import { Layouts, ItemShapes, DisplayTypes, AnchorLocations } from '@/types/layoutTypes'
import { useTrackerStore } from '@/stores/trackerStore'

import ClickCountEditor from './ClickCountEditor.vue'
import SettingsTextItem from './SettingsTextItem.vue'
import SettingsNumberItem from './SettingsNumberItem.vue'
import SettingsCheckboxItem from './SettingsCheckboxItem.vue'
import SettingsColorItem from './SettingsColorItem.vue'
import SettingsSelectItem from './SettingsSelectItem.vue'
import SettingsSliderItem from './SettingsSliderItem.vue'
import SettingsButtonItem from './SettingsButtonItem.vue'

const emit = defineEmits<{
  openItemSetEditor: []
}>()

const layoutStore = useLayoutStore()
const trackerStore = useTrackerStore()

function openItemEditor() {
  emit('openItemSetEditor')
}

const showTextSettings = computed(() => {
  switch (layoutStore.displayType) {
    case 'Text':
    case 'Both':
      return true
  }
  return false
})

const showImageSettings = computed(() => {
  switch (layoutStore.displayType) {
    case 'Image':
    case 'Both':
      return true
  }
  return false
})
</script>

<template>
  <div class="settings-panel">
    <Tabs value="board">
      <TabList>
        <Tab value="board">Board</Tab>
        <Tab value="display">Display</Tab>
        <Tab value="items">Item Setup</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="board">
          <div class="sp-tab-content">
            <SettingsSelectItem
              v-model="layoutStore.layout"
              placeholder="Select a layout"
              label="Layout"
              :items="Layouts"
            />
            <template v-if="layoutStore.layout === 'Grid'">
              <SettingsNumberItem
                v-model="layoutStore.gridRowLength"
                label="Grid Row Length"
                :min="1"
                :max="1000"
                mode="decimal"
                showButtons
              />
            </template>
            <SettingsSelectItem v-model="layoutStore.itemShape" label="Item Shape" :items="ItemShapes" />
            <SettingsNumberItem
              v-model="layoutStore.cellSize"
              label="Item Size"
              :min="1"
              :max="1000"
              mode="decimal"
              showButtons
            />
            <SettingsTextItem
              v-model="layoutStore.keywordPrefix"
              label="Keyword Prefix (default ':')"
              placeholder="<none>"
              maxlength="1"
            />
          </div>
        </TabPanel>
        <TabPanel value="display">
          <div class="sp-tab-content">
            <SettingsColorItem v-model="layoutStore.bgColor" label="Background Color" />
            <SettingsCheckboxItem v-model="layoutStore.showTooltips" label="Show Tooltips" />
            <ClickCountEditor v-model:items="trackerStore.colours" />
          </div>
        </TabPanel>
        <TabPanel value="items">
          <div class="sp-tab-content">
            <SettingsButtonItem label="Open Item Set Editor" @click="openItemEditor" />
            <SettingsNumberItem
              v-model="trackerStore.numItems"
              label="Item Count"
              :min="1"
              :max="10000"
              mode="decimal"
              showButtons
            />
            <SettingsTextItem v-model="trackerStore.seed" label="Seed" />
            <SettingsCheckboxItem v-model="trackerStore.shuffleItems" label="Shuffle Available Items" />
            <SettingsTextItem v-model="layoutStore.markText" label="Mark Icon" />
            <SettingsSelectItem v-model="layoutStore.markLocation" label="Mark Position" :items="AnchorLocations" />
            <SettingsNumberItem
              v-model="layoutStore.markSize"
              label="Mark Size"
              :min="1"
              :max="100"
              mode="decimal"
              showButtons
            />
            <SettingsNumberItem
              v-model="layoutStore.markMargin"
              label="Mark Margin"
              :min="-100"
              :max="1000"
              mode="decimal"
              showButtons
            />
            <SettingsColorItem v-model="layoutStore.markColor" label="Mark Color" />
            <SettingsColorItem v-model="layoutStore.markShadowColor" label="Mark Shadow Color" />
            <SettingsSelectItem v-model="layoutStore.displayType" label="Display Type" :items="DisplayTypes" />
            <template v-if="showTextSettings">
              <SettingsSelectItem v-model="layoutStore.textLocation" label="Text Position" :items="AnchorLocations" />
              <SettingsNumberItem
                v-model="layoutStore.textMargin"
                label="Text Margin"
                :min="-100"
                :max="1000"
                mode="decimal"
                showButtons
              />
            </template>
            <template v-if="showImageSettings">
              <SettingsNumberItem
                v-model="layoutStore.imageMargin"
                label="Image Margin"
                :min="-1000"
                :max="1000"
                mode="decimal"
                showButtons
              />
              <template v-if="showTextSettings">
                <SettingsColorItem v-model="layoutStore.itemTextColor" label="Image Text Color" />
                <SettingsColorItem v-model="layoutStore.itemTextBackgroundColor" label="Image Text Background Color" />
                <SettingsSliderItem
                  v-model="layoutStore.itemTextBackgroundOpacityByte"
                  label="Background Opacity"
                  :min="0"
                  :max="255"
                />
              </template>
              <SettingsCheckboxItem v-model="layoutStore.highlightCoversImage" label="Highlight Covers Image" />
            </template>
          </div>
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped lang="postcss">
.sp-tab-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}
</style>
