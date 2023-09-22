<script setup lang="ts">
import Button from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Slider from 'primevue/slider'
import Menu from 'primevue/menu'
import { ref } from 'vue'
import { useFileDialog } from '@vueuse/core'

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

import pokemonList from '@/assets/pokemon-list.json'
import sm64List from '@/assets/sm64-list.json'
import bingoList from '@/assets/bingo-list.json'
import type { TrackerItem } from '@/types/trackerItem'
const LayoutsMutable = Layouts as unknown as Layout[]
const ItemShapesMutable = ItemShapes as unknown as ItemShape[]
const DisplayTypesMutable = DisplayTypes as unknown as DisplayType[]
const TextLocationsMutable = TextLocations as unknown as TextLocation[]

const layoutStore = useLayoutStore()
const trackerStore = useTrackerStore()

const presetMenu = ref<Menu>()
function togglePresetMenu(event: Event) {
  presetMenu.value?.toggle(event)
}

function loadPreset(preset: TrackerItem[]) {
  trackerStore.initTracker(preset)
}

const presetFileDialog = useFileDialog({ accept: '.json', multiple: false })
async function parseJsonFile(file: File): Promise<TrackerItem[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      if (!event.target?.result) {
        reject('No file target')
        return
      }

      // TODO: Validation
      resolve(JSON.parse(event.target.result as string) as TrackerItem[])
    }
    fileReader.onerror = (error) => reject(error)
    fileReader.readAsText(file)
  })
}

presetFileDialog.onChange(async (files) => {
  if (files) {
    const file = files[0]
    const json = await parseJsonFile(file)
    loadPreset(json)
  }
})

const gridPresets = [
  { label: 'Pokemon', command: () => loadPreset(pokemonList) },
  { label: 'SM64', command: () => loadPreset(sm64List) },
  { label: 'Bingo', command: () => loadPreset(bingoList) },
  { label: 'From File...', command: () => presetFileDialog.open() },
]
</script>

<template>
  <div class="settings-panel">
    <TabView>
      <TabPanel header="Board">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <span>Layout:</span
            ><Dropdown
              class="sp-control"
              v-model="layoutStore.layout"
              :options="LayoutsMutable"
              placeholder="Select a layout"
            />
          </div>
          <div class="sp-item-row" v-if="layoutStore.layout === 'Grid'">
            <span>Grid Row Length:</span
            ><InputNumber
              class="sp-control"
              v-model="layoutStore.gridRowLength"
              :min="1"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">
            <span>Item Shape:</span
            ><Dropdown
              class="sp-control"
              v-model="layoutStore.itemShape"
              :options="ItemShapesMutable"
              placeholder="Select a shape"
            />
          </div>
          <div class="sp-item-row">
            <span>Item Size:</span
            ><InputNumber
              class="sp-control"
              v-model="layoutStore.cellSize"
              :min="1"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Display">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <span>Background Color:</span><ColorPicker class="sp-control" v-model="layoutStore.bgColor" />
          </div>
          <div class="sp-item-row">
            Show Tooltips: <Checkbox class="sp-control" v-model="layoutStore.showTooltips" :binary="true" />
          </div>
          <ClickCountEditor v-model:items="trackerStore.colours" />
        </div>
      </TabPanel>
      <TabPanel header="Item Setup">
        <div class="sp-tab-content">
          <Button
            type="button"
            label="Load Item Set"
            @click="togglePresetMenu"
            aria-haspopup="true"
            aria-controls="overlay_menu"
          />
          <Menu ref="presetMenu" id="overlay_menu" :model="gridPresets" :popup="true" />
          <div class="sp-item-row">
            Item Count:
            <InputNumber
              class="sp-control"
              v-model="trackerStore.numItems"
              :min="1"
              :max="10000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row">Seed: <InputText class="sp-control" v-model="trackerStore.seed" /></div>
          <div class="sp-item-row">
            Shuffle Available Items: <Checkbox class="sp-control" v-model="trackerStore.shuffleItems" :binary="true" />
          </div>
          <div class="sp-item-row">
            <span>Display Type:</span>
            <Dropdown
              class="sp-control"
              v-model="layoutStore.displayType"
              :options="DisplayTypesMutable"
              placeholder="Select a shape"
            />
          </div>
          <div class="sp-item-row" v-if="layoutStore.displayType !== 'Image'">
            <span>Text Position:</span>
            <Dropdown
              class="sp-control"
              v-model="layoutStore.textLocation"
              :options="TextLocationsMutable"
              placeholder="Select a shape"
            />
          </div>
          <div class="sp-item-row">
            Text Size:
            <InputNumber
              v-if="layoutStore.displayType !== 'Image'"
              class="sp-control"
              v-model="layoutStore.textSize"
              :min="1"
              :max="100"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row" v-if="layoutStore.displayType !== 'Text'">
            Image Margin:
            <InputNumber
              class="sp-control"
              v-model="layoutStore.imageMargin"
              :min="-1000"
              :max="1000"
              mode="decimal"
              showButtons
            />
          </div>
          <div class="sp-item-row" v-if="layoutStore.displayType !== 'Image'">
            <span>Image Text Color:</span>
            <ColorPicker class="sp-control" v-model="layoutStore.itemTextColor" />
          </div>
          <div class="sp-item-row" v-if="layoutStore.displayType !== 'Image'">
            <span>Image Text Background Color:</span>
            <ColorPicker class="sp-control" v-model="layoutStore.itemTextBackgroundColor" />
          </div>
          <div class="sp-item-row" v-if="layoutStore.displayType !== 'Image'">
            <span>Background Opacity:</span>
            <Slider class="sp-control" v-model="layoutStore.itemTextBackgroundOpacity" :min="0" :max="255" />
          </div>
          <div class="sp-item-row">
            <span>Highlight Covers Image:</span>
            <Checkbox class="sp-control" v-model="layoutStore.highlightCoversImage" :binary="true" />
          </div>
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
