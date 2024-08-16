<script setup lang="ts">
import { watchEffect, computed, ref } from 'vue'
import { useFileDialog } from '@vueuse/core'

import Button from 'primevue/button'
import Column from 'primevue/column'
import ConfirmDialog from 'primevue/confirmdialog'
import DataTable, { type DataTableRowEditSaveEvent } from 'primevue/datatable'
import Menu from 'primevue/menu'
import MultiSelect from 'primevue/multiselect'
import InputText from 'primevue/inputtext'
import Toast from 'primevue/toast'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

import HeaderBar from '@/components/HeaderBar.vue'

import type { TrackerItem } from '@/types/trackerItem'
import { asError } from 'catch-unknown'

const props = defineProps<{
  gridItems: readonly TrackerItem[]
  presets: ReadonlyArray<{ label: string; items: readonly TrackerItem[] }>
}>()

const emit = defineEmits<{
  'update:gridItems': [items: TrackerItem[]]
  initTracker: [items: readonly TrackerItem[]]
  exportItems: [items: readonly TrackerItem[]]
  returnHome: []
}>()

const toast = useToast()
const confirmDialog = useConfirm()

const mutableItems = ref<TrackerItem[]>([])
const itemKey = ref(0)
function setMutableItemsToDefault() {
  const newItems = []
  for (const item of props.gridItems) {
    newItems.push({ ...item })
  }
  mutableItems.value = newItems
  itemKey.value++
}
watchEffect(setMutableItemsToDefault)

const presetMenu = ref<InstanceType<typeof Menu>>()
function togglePresetMenu(event: Event) {
  presetMenu.value?.toggle(event)
}

function loadPreset(preset: readonly TrackerItem[]) {
  confirmDialog.require({
    message: 'Are you sure you want to load this preset?\nConsider exporting your current item set before continuing.',
    header: 'Loading Preset',
    icon: 'pi pi-exclamation-triangle',
    reject: () => {},
    accept: () => {
      editingRows.value = []
      emit('initTracker', preset)
    },
  })
}

const presetFileDialog = useFileDialog({ accept: '.json', multiple: false })
async function parseJsonFile(file: File): Promise<TrackerItem[]> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = (event) => {
      if (!event.target?.result) {
        reject(new Error('No file target'))
        return
      }

      try {
        resolve(JSON.parse(event.target.result as string) as TrackerItem[])
      } catch (err) {
        reject(asError(err))
      }
    }
    fileReader.onerror = (error) => reject(asError(error))
    fileReader.readAsText(file)
  })
}

// eslint-disable-next-line @typescript-eslint/no-misused-promises
presetFileDialog.onChange(async (files) => {
  try {
    if (files) {
      const file = files[0]
      const json = await parseJsonFile(file)
      loadPreset(json)
    }
  } catch (e) {
    const err = asError(e)
    toast.add({
      severity: 'error',
      closable: true,
      life: 5000,
      summary: 'Error Loading Json',
      detail: err.message,
    })
    console.error(err)
  }
})

const gridPresets = computed(() => {
  const items = props.presets.map(({ label, items }) => ({ label, command: () => loadPreset(items) }))
  items.push({ label: 'From File...', command: () => presetFileDialog.open() })
  return items
})

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
  emit('update:gridItems', newItems)
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
  const savedItem = props.gridItems[index]
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
  const modifiedItemsVal = mutableItems.value
  if (modifiedItemsVal.length !== props.gridItems.length) {
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
  return [...usedKeywords.values()]
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  let { newData, index } = event
  mutableItems.value[index] = newData as TrackerItem
}

function exportJson() {
  emit('exportItems', mutableItems.value)
}

function updateIds() {
  for (let i = 0; i < mutableItems.value.length; i++) {
    mutableItems.value[i].id = i
  }
}

function returnToHome() {
  const callback = () => emit('returnHome')

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
    <Toast />
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
        aria-haspopup="true"
        aria-controls="overlay_menu"
        @click="togglePresetMenu"
      />
      <Menu id="overlay_menu" ref="presetMenu" :model="gridPresets" :popup="true" />
      <Button label="Export Item Set" icon="pi pi-download" @click="exportJson" />
      <div class="spacer" />
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
        v-model:editingRows="editingRows"
        :value="mutableItems"
        paginator
        :rows="50"
        :rowsPerPageOptions="[5, 10, 20, 50, 100, 200, 500, 1000, 5000]"
        editMode="row"
        @rowReorder="onRowReorder"
        @rowEditSave="onRowEditSave"
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
            <!-- Display=chip is broken -->
            <MultiSelect
              v-model="slotProps.data.keywords"
              display="chip"
              :options="availableKeywords"
              placeholder="Keywords"
              scrollHeight="500px"
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
}
</style>
