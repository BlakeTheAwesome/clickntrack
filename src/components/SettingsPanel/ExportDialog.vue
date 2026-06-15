<script setup lang="ts">
import { ref } from 'vue'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import Checkbox from 'primevue/checkbox'
import { buildExport, downloadExport } from '@/scripts/settingsExportUtils'
import { SECTION_ORDER, SECTION_LABELS, type SectionKey } from '@/types/settingsExport'

const visible = defineModel<boolean>('visible', { required: true })

const exportName = ref('')
const selectedSections = ref<SectionKey[]>([...SECTION_ORDER])

function handleExport() {
  const data = buildExport(selectedSections.value, exportName.value || undefined)
  downloadExport(data, exportName.value)
  visible.value = false
}
</script>

<template>
  <Dialog v-model:visible="visible" header="Export Settings" modal :dismissableMask="true" :style="{ width: '24rem' }">
    <div class="ed-content">
      <div class="ed-field">
        <label for="export-name">Name</label>
        <InputText id="export-name" v-model="exportName" placeholder="My Settings" fluid />
      </div>
      <div class="ed-sections">
        <span class="ed-sections-label">Sections</span>
        <div v-for="section in SECTION_ORDER" :key="section" class="ed-row">
          <Checkbox v-model="selectedSections" :value="section" :inputId="`export-${section}`" />
          <label :for="`export-${section}`">{{ SECTION_LABELS[section] }}</label>
        </div>
      </div>
    </div>
    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="visible = false" />
      <Button label="Export" icon="pi pi-download" :disabled="selectedSections.length === 0" @click="handleExport" />
    </template>
  </Dialog>
</template>

<style scoped lang="postcss">
.ed-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding-top: 0.5rem;
}

.ed-field {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.ed-sections {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ed-sections-label {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.ed-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
