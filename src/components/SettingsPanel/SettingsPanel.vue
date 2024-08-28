<script setup lang="ts">
import { computed } from 'vue'

import Tabs from 'primevue/tabs'
import TabList from 'primevue/tablist'
import Tab from 'primevue/tab'
import TabPanels from 'primevue/tabpanels'
import TabPanel from 'primevue/tabpanel'
import Fieldset from 'primevue/fieldset'
import Divider from 'primevue/divider'

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
            <Fieldset legend="Item Settings" :toggleable="true">
              <div class="sp-fields">
                <p class="sp-setting-description">
                  In the <b>Item Set Editor</b> you can configure all of the items that can be shown on the board - for
                  example, you could define all 1000+ pokemon.<br />
                  The other settings control which subset of those items are shown, and their order. <br />
                  The <b>Item Count</b> setting defines how many of these will be shown on the board, for example
                  setting to 151 could show the first 151 pokemon out of the 1000+ defined. <br />
                  The <b>Seed</b> setting is used to shuffle the positions of the items on the board. You can input any
                  string. <br />
                  When <b>Shuffle All Items</b> is set, any item from the 1000+ pokemon set can be in the 151 shown,
                  rather than shuffling only the first 151 entries. <br />
                </p>
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
                <SettingsCheckboxItem v-model="trackerStore.shuffleItems" label="Shuffle All Items" />
              </div>
            </Fieldset>
            <Fieldset legend="Mark" :toggleable="true">
              <div class="sp-fields">
                <p class="sp-setting-description">
                  You can middle-click on items to mark them with an icon (default: ★), which is separate to the
                  click-count. This can be used for tracking goals, before you've achieved them.
                </p>
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
              </div>
            </Fieldset>
            <Divider />
            <p class="sp-setting-description">
              The Display Type setting controls what is shown for each grid item. The options are 'Image' to show the
              image associated with that item, 'Text' to show the item label, or 'Both' to show both.
            </p>
            <SettingsSelectItem v-model="layoutStore.displayType" label="Display Type" :items="DisplayTypes" />
            <Fieldset v-if="showImageSettings" legend="Image Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsNumberItem
                  v-model="layoutStore.imageMargin"
                  label="Image Margin"
                  :min="-1000"
                  :max="1000"
                  mode="decimal"
                  showButtons
                />
                <SettingsCheckboxItem v-model="layoutStore.highlightCoversImage" label="Highlight Covers Image" />
              </div>
            </Fieldset>
            <Fieldset v-if="showTextSettings" legend="Text Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsSelectItem v-model="layoutStore.textLocation" label="Text Position" :items="AnchorLocations" />
                <SettingsNumberItem
                  v-model="layoutStore.textMargin"
                  label="Text Margin"
                  :min="-100"
                  :max="1000"
                  mode="decimal"
                  showButtons
                />
                <SettingsColorItem v-model="layoutStore.itemTextColor" label="Text Color" />
                <SettingsColorItem v-model="layoutStore.itemTextBackgroundColor" label="Background Color" />
                <SettingsSliderItem
                  v-model="layoutStore.itemTextBackgroundOpacityByte"
                  label="Background Opacity"
                  :min="0"
                  :max="255"
                />
              </div>
            </Fieldset>
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

.sp-fields {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sp-setting-description {
  margin-top: 0;
  margin-bottom: 1rem;
}
</style>
