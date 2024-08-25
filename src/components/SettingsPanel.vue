<script setup lang="ts">
import { computed } from 'vue'

import Button from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import Checkbox from 'primevue/checkbox'
import Select from 'primevue/select'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Slider from 'primevue/slider'

// TODO: Replace tabview with new tabs component

import {
  useLayoutStore,
  Layouts,
  type Layout,
  ItemShapes,
  type ItemShape,
  DisplayTypes,
  type DisplayType,
  TextLocations,
  type TextLocation,
} from '@/stores/layoutStore'
import { useTrackerStore } from '@/stores/trackerStore'
import ClickCountEditor from './ClickCountEditor.vue'

const emit = defineEmits<{
  openItemSetEditor: []
}>()

const LayoutsMutable = Layouts as unknown as Layout[]
const ItemShapesMutable = ItemShapes as unknown as ItemShape[]
const DisplayTypesMutable = DisplayTypes as unknown as DisplayType[]
const TextLocationsMutable = TextLocations as unknown as TextLocation[]

const layoutStore = useLayoutStore()
const trackerStore = useTrackerStore()

function openItemEditor() {
  emit('openItemSetEditor')
}

const bgColor = computed({
  get: () => layoutStore.bgColor.substring(1),
  set: (col) => {
    layoutStore.bgColor = `#${col}`
  },
})

const itemTextColor = computed({
  get: () => layoutStore.itemTextColor.substring(1),
  set: (col) => {
    layoutStore.itemTextColor = `#${col}`
  },
})

const itemTextBgColor = computed({
  get: () => layoutStore.itemTextBackgroundColor.substring(1),
  set: (col) => {
    layoutStore.itemTextBackgroundColor = `#${col}`
  },
})

const markColor = computed({
  get: () => layoutStore.markColor.substring(1),
  set: (col) => {
    layoutStore.markColor = `#${col}`
  },
})

const markShadowColor = computed({
  get: () => layoutStore.markShadowColor.substring(1),
  set: (col) => {
    layoutStore.markShadowColor = `#${col}`
  },
})

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
    <TabView>
      <TabPanel header="Board">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <span>Layout:</span>
            <Select
              v-model="layoutStore.layout"
              class="sp-control"
              :options="LayoutsMutable"
              placeholder="Select a layout"
            />
          </div>
          <div v-if="layoutStore.layout === 'Grid'" class="sp-item-row">
            <span>Grid Row Length:</span>
            <InputNumber
              v-model="layoutStore.gridRowLength"
              class="sp-control"
              :min="1"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">
            <span>Item Shape:</span>
            <Select
              v-model="layoutStore.itemShape"
              class="sp-control"
              :options="ItemShapesMutable"
              placeholder="Select a shape"
            />
          </div>
          <div class="sp-item-row">
            <span>Item Size:</span>
            <InputNumber
              v-model="layoutStore.cellSize"
              class="sp-control"
              :min="1"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">
            <span>Keyword Prefix (default ":"):</span>
            <InputText v-model="layoutStore.keywordPrefix" class="sp-control" placeholder="<none>" maxlength="1" />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Display">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <span>Background Color:</span>
            <ColorPicker v-model="bgColor" class="sp-control" />
          </div>
          <div class="sp-item-row">
            Show Tooltips: <Checkbox v-model="layoutStore.showTooltips" class="sp-control" :binary="true" />
          </div>
          <ClickCountEditor v-model:items="trackerStore.colours" />
        </div>
      </TabPanel>
      <TabPanel header="Item Setup">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <Button type="button" label="Open Item Set Editor" @click="openItemEditor" />
          </div>
          <div class="sp-item-row">
            Item Count:
            <InputNumber
              v-model="trackerStore.numItems"
              class="sp-control"
              :min="1"
              :max="10000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">Seed: <InputText v-model="trackerStore.seed" class="sp-control" /></div>
          <div class="sp-item-row">
            Shuffle Available Items: <Checkbox v-model="trackerStore.shuffleItems" class="sp-control" :binary="true" />
          </div>
          <div class="sp-item-row">Mark Icon: <InputText v-model="layoutStore.markText" class="sp-control" /></div>
          <div class="sp-item-row">
            <span>Mark Position:</span>
            <Select v-model="layoutStore.markLocation" class="sp-control" :options="TextLocationsMutable" />
          </div>
          <div class="sp-item-row">
            Mark Size:
            <InputNumber
              v-model="layoutStore.markSize"
              class="sp-control"
              :min="1"
              :max="100"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">
            Mark Margin:
            <InputNumber
              v-model="layoutStore.markMargin"
              class="sp-control"
              :min="-100"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">
            <span>Mark Color:</span>
            <ColorPicker v-model="markColor" class="sp-control" />
          </div>
          <div class="sp-item-row">
            <span>Mark Shadow Color:</span>
            <ColorPicker v-model="markShadowColor" class="sp-control" />
          </div>
          <div class="sp-item-row">
            <span>Display Type:</span>
            <Select v-model="layoutStore.displayType" class="sp-control" :options="DisplayTypesMutable" />
          </div>
          <template v-if="showTextSettings">
            <div class="sp-item-row">
              <span>Text Position:</span>
              <Select v-model="layoutStore.textLocation" class="sp-control" :options="TextLocationsMutable" />
            </div>
            <div class="sp-item-row">
              Text Size:
              <InputNumber
                v-model="layoutStore.textSize"
                class="sp-control"
                :min="1"
                :max="100"
                mode="decimal"
                showButtons
              />
            </div>
            <div class="sp-item-row">
              Text Margin:
              <InputNumber
                v-model="layoutStore.textMargin"
                class="sp-control"
                :min="-100"
                :max="1000"
                mode="decimal"
                showButtons
              />
            </div>
          </template>
          <template v-if="showImageSettings">
            <div class="sp-item-row">
              Image Margin:
              <InputNumber
                v-model="layoutStore.imageMargin"
                class="sp-control"
                :min="-1000"
                :max="1000"
                mode="decimal"
                showButtons
              />
            </div>
            <template v-if="showTextSettings">
              <div class="sp-item-row">
                <span>Image Text Color:</span>
                <ColorPicker v-model="itemTextColor" class="sp-control" />
              </div>
              <div class="sp-item-row">
                <span>Image Text Background Color:</span>
                <ColorPicker v-model="itemTextBgColor" class="sp-control" />
              </div>
              <div class="sp-item-row">
                <span>Background Opacity:</span>
                <Slider v-model="layoutStore.itemTextBackgroundOpacityByte" class="sp-control" :min="0" :max="255" />
              </div>
            </template>
            <div class="sp-item-row">
              <span>Highlight Covers Image:</span>
              <Checkbox v-model="layoutStore.highlightCoversImage" class="sp-control" :binary="true" />
            </div>
          </template>
        </div>
      </TabPanel>
    </TabView>
  </div>
</template>

<style scoped lang="postcss">
.sp-tab-content {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.sp-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sp-control {
  flex-grow: 1;
}
</style>
