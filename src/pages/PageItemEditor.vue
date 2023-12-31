<script setup lang="ts">
import { watchEffect, computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useFileDialog } from '@vueuse/core'

import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import DataTable, { type DataTableRowEditSaveEvent } from 'primevue/datatable'
import Column from 'primevue/column'
import Menu from 'primevue/menu'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

import HeaderBar from '@/components/HeaderBar.vue'

import { useTrackerStore } from '@/stores/trackerStore'

import type { TrackerItem } from '@/types/trackerItem'

import pokemonList from '@/assets/pokemon-list.json'
import sm64List from '@/assets/sm64-list.json'
import bingoList from '@/assets/bingo-list.json'

const trackerStore = useTrackerStore()
const savedItems = computed(() => trackerStore.allGridItems)

const confirmDialog = useConfirm()
const router = useRouter()

const mutableItems = ref<TrackerItem[]>([])
const itemKey = ref(0)
function setMutableItemsToDefault() {
  const newItems = []
  for (const item of savedItems.value) {
    newItems.push({ ...item })
  }
  mutableItems.value = newItems
  itemKey.value++
}

watchEffect(setMutableItemsToDefault)

const presetMenu = ref<Menu>()
function togglePresetMenu(event: Event) {
  presetMenu.value?.toggle(event)
}

function loadPreset(preset: TrackerItem[]) {
  confirmDialog.require({
    message: 'Are you sure you want to load this preset?\nConsider exporting your current item set before continuing.',
    header: 'Loading Preset',
    icon: 'pi pi-exclamation-triangle',
    reject: () => {},
    accept: () => {
      editingRows.value = []
      trackerStore.initTracker(preset)
    },
  })
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

function onRowReorder(event: { dragIndex: number; dropIndex: number }) {
  const [dragItem] = mutableItems.value.splice(event.dragIndex, 1)
  mutableItems.value.splice(event.dropIndex, 0, dragItem)
  updateIds()
}

function deleteItem(index: number) {
  mutableItems.value.splice(index, 1)
  updateIds()
}

function addItem() {
  const maxId = Math.max(...mutableItems.value.map((item) => item.id))
  mutableItems.value.push({
    id: maxId + 1,
    displayName: 'NEW',
  })
}

function commit() {
  const newItems = []
  for (const item of mutableItems.value) {
    newItems.push({ ...item })
  }
  trackerStore.allGridItems = newItems
}

function revert() {
  confirmDialog.require({
    message: 'Are you sure you want to revert your changes?',
    header: 'Unsaved Changes!',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: setMutableItemsToDefault,
    reject: () => {},
  })
}

function isModifiedAtIndex(index: number) {
  const savedItem = savedItems.value[index]
  const modifiedItem = mutableItems.value[index]
  if (!savedItem || !modifiedItem) {
    return true
  }
  const itemKeys = Object.keys(modifiedItem) as Array<keyof TrackerItem>
  if (itemKeys.length !== Object.keys(savedItem).length) {
    return true
  }

  for (const key of itemKeys) {
    if (modifiedItem[key] !== savedItem[key]) {
      return true
    }
  }

  return false
}

const isModified = computed(() => {
  const savedItemsVal = savedItems.value
  const modifiedItemsVal = mutableItems.value
  if (modifiedItemsVal.length !== savedItemsVal.length) {
    return true
  }

  for (let i = 0; i < modifiedItemsVal.length; i++) {
    if (isModifiedAtIndex(i)) {
      return true
    }
  }

  return false
})

const availableKeywords = computed<string[]>(() => {
  const usedKeywords = new Set<string>()
  for (const item of mutableItems.value) {
    for (const keywords of item.keywords ?? []) {
      usedKeywords.add(keywords)
    }
  }
  return new Array<string>(...usedKeywords.values())
})

const errorMessage = computed(() => {
  if (editingRows.value.length > 0) {
    return `Row: ${editingRows.value[0].id} is open. Please save or cancel your edits before continuing`
  }

  const modifiedItemsVal = mutableItems.value
  const idRowMap = new Map<number, number>()
  for (let i = 0; i < modifiedItemsVal.length; i++) {
    const item = modifiedItemsVal[i]
    const id = item.id
    if (idRowMap.has(id)) {
      return `Duplicate id: ${id} on rows ${idRowMap.get(id)} and ${i}`
    }
    if (!item.displayName) {
      return `Missing display name on row ${i}`
    }
    idRowMap.set(id, i)
  }
  return ''
})

const editingRows = ref<TrackerItem[]>([])
const onRowEditSave = (event: DataTableRowEditSaveEvent) => {
  let { newData, index } = event
  mutableItems.value[index] = newData
}

function exportJson() {
  const dataToExport = mutableItems.value
  const dataStr = JSON.stringify(dataToExport, null, 2)
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr)
  const exportFileDefaultName = 'data.json'
  const linkElement = document.createElement('a')
  linkElement.setAttribute('href', dataUri)
  linkElement.setAttribute('download', exportFileDefaultName)
  linkElement.click()
  document.removeChild(linkElement)
}

function updateIds() {
  for (let i = 0; i < mutableItems.value.length; i++) {
    mutableItems.value[i].id = i
  }
}

function returnToHome() {
  const callback = () => router.push({ name: 'tracker' })

  if (!isModified.value && editingRows.value.length === 0) {
    callback()
    return
  }

  confirmDialog.require({
    message: 'Are you sure you want to return to the home page? Any unsaved changes will be lost.',
    header: 'Unsaved Changes!',
    icon: 'pi pi-exclamation-triangle',
    acceptClass: 'p-button-danger',
    accept: callback,
    reject: () => {},
  })
}

const newKeyword = ref('')
</script>

<template>
  <div class="page-item-editor">
    <ConfirmDialog />
    <div class="pie-header">
      <HeaderBar>
        <template #actions>
          <Button icon="pi pi-home" severity="secondary" text raised rounded aria-label="Home" @click="returnToHome" />
        </template>
      </HeaderBar>
    </div>
    <div class="pie-actions">
      <Button
        label="Load/Import Item Set"
        icon="pi pi-upload"
        @click="togglePresetMenu"
        aria-haspopup="true"
        aria-controls="overlay_menu"
      />
      <Menu ref="presetMenu" id="overlay_menu" :model="gridPresets" :popup="true" />
      <Button label="Export Item Set" icon="pi pi-download" @click="exportJson" />
      <div class="spacer"></div>
      <span class="pie-error">{{ errorMessage }}</span>
      <Button
        label="Revert Changes"
        icon="pi pi-undo"
        type="button"
        severity="danger"
        raised
        aria-label="Revert Changes"
        :disabled="!isModified || !!errorMessage"
        @click="revert"
      />
      <Button
        label="Save"
        icon="pi pi-save"
        severity="success"
        raised
        aria-label="Save Changes"
        :disabled="!isModified || !!errorMessage"
        @click="commit"
      />
    </div>
    <div>
      <DataTable
        :value="mutableItems"
        @rowReorder="onRowReorder"
        paginator
        :rows="50"
        :rowsPerPageOptions="[5, 10, 20, 50, 100, 200, 500, 1000, 5000]"
        v-model:editingRows="editingRows"
        editMode="row"
        @row-edit-save="onRowEditSave"
      >
        <Column rowReorder headerStyle="width: 3rem" />
        <Column header="Id" field="id" headerStyle="width: 3rem" />
        <Column header="Display Name" field="displayName">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" size="small" />
          </template>
        </Column>
        <Column header="Image" field="img">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" size="small" />
          </template>
          <template #body="slotProps">
            <img
              v-if="slotProps.data.img"
              class="pie-img-icon"
              :src="slotProps.data.img"
              :alt="slotProps.data.displayName"
            />
          </template>
        </Column>
        <Column header="Overlay Text" field="overlayText">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" size="small" />
          </template>
        </Column>
        <Column header="Tooltip" field="tooltip">
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" size="small" />
          </template>
        </Column>
        <Column header="Keywords">
          <template #editor="slotProps">
            <MultiSelect
              v-model="slotProps.data.keywords"
              display="chip"
              :options="availableKeywords"
              placeholder="Keywords"
              scroll-height="500px"
            >
              <template #header>
                <div class="pie-new-keyword-row">
                  <InputText v-model="newKeyword" size="small" /><Button
                    label="Add"
                    @click="slotProps.data.keywords.push(newKeyword)"
                  />
                </div>
              </template>
            </MultiSelect>
          </template>
          <template #body="slotProps">
            <div class="p-multiselect p-multiselect-chip pie-keywords">
              <div v-for="keyword in slotProps.data.keywords ?? []" :key="keyword" class="p-multiselect-token">
                {{ keyword }}
              </div>
            </div>
          </template>
        </Column>
        <Column :rowEditor="true" style="width: 10%; min-width: 8rem" bodyStyle="text-align:center" />
        <Column headerStyle="width: 3rem">
          <template #body="slotProps">
            <Button icon="pi pi-trash" severity="danger" text aria-label="Clear" @click="deleteItem(slotProps.index)" />
          </template>
        </Column>
        <template #footer>
          <div class="cce-footer">
            <Button
              label="Add Item"
              icon="pi pi-plus"
              severity="primary"
              raised
              aria-label="Add Item"
              @click="addItem"
            />
          </div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<style lang="postcss">
.page-item-editor {
  height: 100%;
  display: grid;
  grid:
    'header' auto
    'actions' auto
    'content' 1fr / 1fr;

  & .pie-header {
    grid-area: header;
  }

  & .pie-actions {
    grid-area: actions;
    display: flex;
    gap: 1rem;
    padding: 1rem;
    align-items: center;

    & .spacer {
      flex-grow: 1;
    }
  }

  & .pie-img-icon {
    max-width: 2rem;
    max-height: 2rem;
  }

  & .pie-keywords {
    cursor: default;
    border: none !important;
    display: flex;
    overflow-x: auto;
  }
}

.pie-new-keyword-row {
  width: 100%;
  display: grid;
  grid: 'input button' 1fr / 1fr auto;
  gap: 0.5rem;
  padding: 0.5rem;
}

.pie-error {
  color: #922;
  font-size: 20px;
  font-weight: bold;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif, 'Apple Color Emoji',
    'Segoe UI Emoji', 'Segoe UI Symbol';
}
</style>
