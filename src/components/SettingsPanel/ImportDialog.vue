<script setup lang="ts">
import { ref, computed } from 'vue'
import { asError } from 'catch-unknown'
import Dialog from 'primevue/dialog'
import Button from 'primevue/button'
import Checkbox from 'primevue/checkbox'
import Message from 'primevue/message'
import { applyImport, validateColors, getSectionSummary } from '@/scripts/settingsExportUtils'
import { SECTION_ORDER, SECTION_LABELS, type SettingsExport, type SectionKey } from '@/types/settingsExport'

const props = defineProps<{
  data: SettingsExport
}>()

const visible = defineModel<boolean>('visible', { required: true })

const presentSections = computed(() => SECTION_ORDER.filter((s) => props.data[s] !== undefined))

const selectedSections = ref<SectionKey[]>([...presentSections.value])

const colorWarnings = computed(() => (props.data.colors ? validateColors(props.data.colors) : []))

const importError = ref<string | null>(null)

function handleImport() {
  importError.value = null
  try {
    applyImport(props.data, selectedSections.value)
    visible.value = false
  } catch (err) {
    importError.value = asError(err).message
  }
}
</script>

<template>
  <Dialog
    v-model:visible="visible"
    :header="data.name ? `Import — ${data.name}` : 'Import Settings'"
    modal
    :dismissableMask="true"
    :style="{ width: '24rem' }"
  >
    <div class="id-content">
      <div v-if="presentSections.length === 0" class="id-empty">No recognised sections found in this file.</div>
      <template v-else>
        <span class="id-label">Select sections to import</span>
        <div v-for="section in presentSections" :key="section" class="id-row">
          <Checkbox v-model="selectedSections" :value="section" :inputId="`import-${section}`" class="id-checkbox" />
          <label :for="`import-${section}`" class="id-label-text">{{ SECTION_LABELS[section] }}</label>
          <span class="id-summary">{{ getSectionSummary(data, section) }}</span>
          <div v-if="section === 'colors' && colorWarnings.length > 0" class="id-warnings">
            <Message
              v-for="warning in colorWarnings"
              :key="warning"
              severity="warn"
              icon="pi pi-exclamation-triangle"
              >{{ warning }}</Message
            >
          </div>
        </div>
      </template>
    </div>
    <Message v-if="importError" severity="error" icon="pi pi-times-circle" class="id-error-message">{{
      importError
    }}</Message>
    <template #footer>
      <Button label="Cancel" severity="secondary" text @click="visible = false" />
      <Button label="Import" icon="pi pi-upload" :disabled="selectedSections.length === 0" @click="handleImport" />
    </template>
  </Dialog>
</template>

<style scoped lang="postcss">
.id-content {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding-top: 0.5rem;
}

.id-label {
  font-size: 0.875rem;
  color: var(--p-text-muted-color);
}

.id-empty {
  color: var(--p-text-muted-color);
  font-style: italic;
}

.id-row {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 0.5rem;
  row-gap: 0.1rem;
  align-items: center;
}

.id-checkbox {
  grid-column: 1;
  grid-row: 1 / 3;
  align-self: start;
  margin-top: 0.15rem;
}

.id-label-text {
  grid-column: 2;
  grid-row: 1;
}

.id-summary {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.8rem;
  color: var(--p-text-muted-color);
}

.id-warnings {
  grid-column: 2;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.id-error-message {
  margin-top: 0.75rem;
}
</style>
