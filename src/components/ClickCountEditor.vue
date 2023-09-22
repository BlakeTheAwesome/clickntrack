<script setup lang="ts">
import Button from 'primevue/button'
import ColorPicker from 'primevue/colorpicker'
import Checkbox from 'primevue/checkbox'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import { computed, ref, watchEffect } from 'vue'

import type { ClickCountEntry } from '@/types/ClickCountEntry'

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
    if (mutableItems.value[i].id !== props.items[i].id) {
      return true
    }
    if (mutableItems.value[i].color !== props.items[i].color) {
      return true
    }
    if (mutableItems.value[i].countsTowardsTotal !== props.items[i].countsTowardsTotal) {
      return true
    }
  }

  return false
})
</script>

<template>
  <DataTable :value="mutableItems" @rowReorder="onRowReorder" :key="itemKey">
    <Column rowReorder headerStyle="width: 3rem" />
    <Column header="Set Default">
      <template #body="slotProps">
        <Button
          v-show="slotProps.data.id !== 0"
          icon="pi pi-circle"
          severity="secondary"
          text
          aria-label="Clear"
          @click="setDefaultItem(slotProps.index)"
        />
      </template>
    </Column>
    <Column header="Id" field="id" />
    <Column header="Color">
      <template #body="slotProps">
        <ColorPicker v-model="slotProps.data.color" />
      </template>
    </Column>
    <Column header="Counts Towards Total">
      <template #body="slotProps">
        <Checkbox v-model="slotProps.data.countsTowardsTotal" :binary="true" />
      </template>
    </Column>
    <Column header="Actions">
      <template #body="slotProps">
        <Button icon="pi pi-trash" severity="danger" text aria-label="Clear" @click="deleteItem(slotProps.index)" />
      </template>
    </Column>
    <template #footer>
      <div class="cce-footer">
        <Button icon="pi pi-add" severity="primary" raised aria-label="Add Item" @click="addItem"> Add Item </Button>
        <div class="spacer"></div>
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
</template>

<style scoped lang="postcss">
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
