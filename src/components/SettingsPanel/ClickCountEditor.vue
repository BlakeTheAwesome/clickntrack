<script setup lang="ts">
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed, ref, watchEffect } from 'vue'

import type { ClickCountEntry } from '@/types/ClickCountEntry'
import ColorPickerPopup from './ColorPickerPopup.vue'

const props = defineProps<{
  items: ClickCountEntry[]
}>()

const emit = defineEmits<{
  'update:items': [items: ClickCountEntry[]]
}>()

const mutableItems = ref<ClickCountEntry[]>([])
const itemKey = ref(0)
function setMutableItemsToDefault() {
  const newItems = []
  for (const item of props.items) {
    newItems.push({ ...item })
  }
  mutableItems.value = newItems
  itemKey.value++
}

watchEffect(setMutableItemsToDefault)

function updateIds(newZeroIndex?: number) {
  let zeroIndex = newZeroIndex ?? mutableItems.value.findIndex((item) => item.id === 0)
  if (zeroIndex === -1) {
    zeroIndex = 0
  }

  for (let i = 0; i < mutableItems.value.length; i++) {
    mutableItems.value[i].id = i - zeroIndex
  }
}

function onRowReorder(event: { dragIndex: number; dropIndex: number }) {
  const [dragItem] = mutableItems.value.splice(event.dragIndex, 1)
  mutableItems.value.splice(event.dropIndex, 0, dragItem)
  updateIds()
}

function setDefaultItem(index: number) {
  updateIds(index)
  mutableItems.value[index].countsTowardsTotal = false
}

function deleteItem(index: number) {
  mutableItems.value.splice(index, 1)
  updateIds()
}

function addItem() {
  mutableItems.value.push({
    id: -1,
    color: '#0000FF',
    countsTowardsTotal: true,
  })

  updateIds()
}

function commit() {
  updateIds()

  for (const item of mutableItems.value) {
    if (item.color[0] !== '#') {
      item.color = `#${item.color}`
    }
  }
  emit('update:items', mutableItems.value)
}

function revert() {
  setMutableItemsToDefault()
}

const isModified = computed(() => {
  if (mutableItems.value.length !== props.items.length) {
    return true
  }

  for (let i = 0; i < mutableItems.value.length; i++) {
    const current = mutableItems.value[i]
    const original = props.items[i]
    if (current.id !== original.id) {
      return true
    }
    if (current.color !== original.color) {
      return true
    }
    if (current.countsTowardsTotal !== original.countsTowardsTotal) {
      return true
    }
  }

  return false
})
</script>

<template>
  <div>
    <p class="cce-description">
      Here you can define the colors that are used when you click on items. <br />
      Each item starts with a default value (0), and left clicking on the item increases its value, while right clicking
      decreases the value. <br />
      <br />
      Items can be 'Counted' which means that they will be added to the total displayed on the board. Default (0) values
      cannot be counted. <br />
    </p>
    <p>The settings you can modify for each item are as follows:</p>
    <ul>
      <li><b>Color:</b> The color to use for that value.</li>
      <li><b>Counted:</b> Whether this value is counted towards the total.</li>
      <li>
        <b>Set Default <span class="pi pi-bullseye"></span>:</b> This is the value that will be used as the default or
        when clearing the board.
      </li>
      <li>
        <b>Delete <span class="pi pi-trash"></span>:</b> Deletes this item.
      </li>
    </ul>
    <p>
      Changes are not applied until you click the <b>Save</b> button, and can be reverted back to the current settings
      with the <b>Revert</b> button.
    </p>
    <DataTable :key="itemKey" :value="mutableItems" @rowReorder="onRowReorder">
      <Column rowReorder style="width: 3rem" />
      <Column header="Color">
        <template #body="slotProps">
          <div class="cce-color-cell">
            <span class="cce-value">{{ slotProps.data.id }}</span>
            <ColorPickerPopup v-model="slotProps.data.color" />
          </div>
        </template>
      </Column>
      <Column header="Counted">
        <template #body="slotProps">
          <div class="cce-centered">
            <Checkbox v-model="slotProps.data.countsTowardsTotal" :binary="true" />
          </div>
        </template>
      </Column>
      <Column header="Actions">
        <template #body="slotProps">
          <div class="cce-actions">
            <Button
              v-tooltip="slotProps.data.id === 0 ? 'Default value' : 'Set as default (value 0)'"
              :icon="'pi pi-bullseye'"
              :severity="'secondary'"
              :text="false"
              :disabled="slotProps.data.id === 0"
              aria-label="Set as default"
              @click="setDefaultItem(slotProps.index)"
            />
            <Button
              v-tooltip="'Delete row'"
              icon="pi pi-trash"
              severity="danger"
              text
              aria-label="Delete"
              @click="deleteItem(slotProps.index)"
            />
          </div>
        </template>
      </Column>
      <template #footer>
        <div class="cce-footer">
          <Button icon="pi pi-add" severity="primary" raised aria-label="Add Item" @click="addItem"> Add Item </Button>
          <div class="spacer" />
          <Button
            icon="pi pi-add"
            severity="danger"
            raised
            aria-label="Revert Changes"
            :disabled="!isModified"
            @click="revert"
          >
            Revert Changes
          </Button>
          <Button
            icon="pi pi-add"
            severity="success"
            raised
            aria-label="Save Changes"
            :disabled="!isModified"
            @click="commit"
          >
            Save
          </Button>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<style scoped lang="postcss">
:deep(.p-datatable-column-title) {
  width: 100%;
  text-align: center;
}

.cce-description {
  margin-top: 0;
}

.cce-centered {
  display: flex;
  justify-content: center;
}

.cce-color-cell {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
}

.cce-value {
  font-variant-numeric: tabular-nums;
  min-width: 1.5rem;
  text-align: right;
  color: var(--p-text-muted-color);
  font-size: 0.875rem;
}

.cce-actions {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
}

.cce-footer {
  display: flex;
  gap: 1rem;
  width: 100%;

  & button {
    flex-basis: content;
    padding-inline: 1rem;
  }

  & .spacer {
    flex-grow: 1;
  }
}
</style>
