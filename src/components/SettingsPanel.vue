<script setup lang="ts">
import ColorPicker from 'primevue/colorpicker'
import Checkbox from 'primevue/checkbox'
import Dropdown from 'primevue/dropdown'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'

import { useLayoutStore, Layouts, type Layout, ItemShapes, type ItemShape } from '@/stores/layoutStore'
import { useTrackerStore } from '@/stores/trackerStore'
const LayoutsMutable = Layouts as unknown as Layout[]
const ItemShapesMutable = ItemShapes as unknown as ItemShape[]

const layoutStore = useLayoutStore()
const trackerStore = useTrackerStore()
</script>

<template>
  <div class="settings-panel">
    <TabView>
      <TabPanel header="Layout">
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
              :max="100"
              mode="decimal"
              showButtons
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Colors">
        <div class="sp-tab-content">
          <div class="sp-item-row">
            <span>Background Color:</span><ColorPicker class="sp-control" v-model="layoutStore.bgColor" />
          </div>
          <div class="sp-item-row">
            <span>Max Clicks:</span
            ><InputNumber
              class="sp-control"
              v-model="trackerStore.maxClickCount"
              :min="1"
              :max="100"
              mode="decimal"
              showButtons
            />
          </div>
        </div>
      </TabPanel>
      <TabPanel header="Item Setup">
        <div class="sp-tab-content">
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
