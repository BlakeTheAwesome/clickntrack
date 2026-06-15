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
import { Layouts, ItemShapes, DisplayTypes, AnchorLocations, TotalDisplayTypes } from '@/types/layoutTypes'
import { useTrackerStore } from '@/stores/trackerStore'

import ClickCountEditor from './ClickCountEditor.vue'
import SettingsTextItem from './SettingsTextItem.vue'
import SettingsNumberItem from './SettingsNumberItem.vue'
import SettingsCheckboxItem from './SettingsCheckboxItem.vue'
import SettingsColorItem from './SettingsColorItem.vue'
import SettingsSelectItem from './SettingsSelectItem.vue'
import SettingsSliderItem from './SettingsSliderItem.vue'
import SettingsButtonItem from './SettingsButtonItem.vue'
import ImportExportPanel from '@/components/SettingsPanel/ImportExportPanel.vue'

const emit = defineEmits<{
  openItemSetEditor: []
}>()

const layoutStore = useLayoutStore()
const trackerStore = useTrackerStore()

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

const shuffleAllItemsHelpText = `This setting causes all items to be shuffled, instead of just the first "Item Count" items.

For example if item count is 15, but available item count is 1000 items defined, this changes between:

- The first 15 items being shuffled

- All 1000 items being shuffled and then 15 selected`

const keywordFilterHelpText = `This is the character to type before a keyword in order to search for it.

For example, if this is set to the default value ':', then typing ':fire' will search for the keyword 'fire'.

If set to an empty string, all words will be treated as both keywords and names.`
</script>

<template>
  <div class="settings-panel">
    <Tabs value="clicks">
      <TabList>
        <Tab value="clicks">Tracker Setup</Tab>
        <Tab value="board">Board Setup</Tab>
        <Tab value="items">Item Setup</Tab>
        <Tab value="import-export">Import/Export</Tab>
      </TabList>
      <TabPanels>
        <TabPanel value="clicks">
          <div class="sp-tab-content">
            <Fieldset legend="Item Settings" :toggleable="true">
              <div class="sp-fields">
                <p class="sp-setting-description">
                  In the <b>Item Set Editor</b> you can configure all of the items that can be shown on the board - for
                  example, you could define all 1000+ pokemon.<br />
                  The other settings control which subset of those items are shown, and their order.
                </p>
                <SettingsButtonItem label="Open Item Set Editor" @click="emit('openItemSetEditor')" />
                <SettingsNumberItem
                  :modelValue="trackerStore.allGridItems.length"
                  label="Available Item Count"
                  disabled
                />
                <SettingsNumberItem
                  v-model="trackerStore.numItems"
                  label="Item Count"
                  :min="1"
                  :max="10000"
                  mode="decimal"
                  showButtons
                />
                <SettingsTextItem
                  v-model="trackerStore.seed"
                  label="Shuffle Seed"
                  helpText="This setting is used to shuffle the items on the board. When empty, the items will be in the order defined in the editor."
                />
                <SettingsCheckboxItem
                  v-model="trackerStore.shuffleItems"
                  label="Shuffle All Items"
                  :helpText="shuffleAllItemsHelpText"
                />
              </div>
            </Fieldset>
            <Fieldset legend="Color Settings" :toggleable="true">
              <ClickCountEditor v-model:items="trackerStore.colours" />
            </Fieldset>
          </div>
        </TabPanel>
        <TabPanel value="board">
          <div class="sp-tab-content">
            <Fieldset legend="Board Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsColorItem v-model="layoutStore.bgColor" label="Background Color" />
                <SettingsSelectItem
                  v-model="layoutStore.layout"
                  placeholder="Select a layout"
                  label="Board Shape"
                  :items="Layouts"
                />
                <template v-if="layoutStore.layout === 'Grid'">
                  <SettingsNumberItem
                    v-model="layoutStore.gridRowLength"
                    label="Items Per Row"
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
              </div>
            </Fieldset>
            <Fieldset legend="Search Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsColorItem v-model="trackerStore.filterTextColor" label="Search Text Color" />
                <SettingsTextItem
                  v-model="layoutStore.keywordPrefix"
                  label="Keyword Prefix"
                  placeholder="<none>"
                  maxlength="1"
                  :helpText="keywordFilterHelpText"
                />
              </div>
            </Fieldset>
            <Fieldset legend="Totals Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsSelectItem
                  v-model="trackerStore.totalDisplayType"
                  label="Total Display Type"
                  :items="TotalDisplayTypes"
                  helpText="This controls the 'total' field in the bottom right. Single Total adds up all the marked items, whereas Individual Counts shows a total for each color."
                />
                <SettingsColorItem v-model="trackerStore.totalTextColor" label="Total Text Color" />
              </div>
            </Fieldset>
          </div>
        </TabPanel>
        <TabPanel value="items">
          <div class="sp-tab-content">
            <p class="sp-setting-description">
              The Display Type setting controls what is shown for each grid item. The options are 'Image' to show the
              image associated with that item, 'Text' to show the item label, or 'Both' to show both.
            </p>
            <SettingsSelectItem v-model="layoutStore.displayType" label="Display Type" :items="DisplayTypes" />
            <SettingsCheckboxItem v-model="layoutStore.showTooltips" label="Show Tooltips" />
            <Divider />
            <Fieldset v-if="showImageSettings" legend="Image Settings" :toggleable="true">
              <div class="sp-fields">
                <SettingsNumberItem
                  v-model="layoutStore.imageMargin"
                  label="Image Margin"
                  :min="-1000"
                  :max="1000"
                  mode="decimal"
                  showButtons
                  helpText="How much space to leave between the image and the border. A negative margin can make an image appear larger."
                />
                <SettingsCheckboxItem
                  v-model="layoutStore.highlightCoversImage"
                  label="Highlight Covers Image"
                  helpText="This controls whether the click color overlay is in front of or behind the image. If your images cover the entire tile, you will want this checked."
                />
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
                <SettingsColorItem
                  v-model="layoutStore.markColor"
                  label="Mark Color"
                  helpText="This is the inner color of the mark"
                />
                <SettingsColorItem v-model="layoutStore.markShadowColor" label="Mark Shadow Color" />
              </div>
            </Fieldset>
          </div>
        </TabPanel>
        <TabPanel value="import-export">
          <ImportExportPanel />
        </TabPanel>
      </TabPanels>
    </Tabs>
  </div>
</template>

<style scoped lang="postcss">
:deep(.p-tab) {
  flex: 1;
  justify-content: center;
}

.sp-tab-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  overflow-x: auto;
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
