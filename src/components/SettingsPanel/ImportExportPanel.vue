<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import Button from 'primevue/button'
import Divider from 'primevue/divider'
import Message from 'primevue/message'
import { parseSettingsFile } from '@/scripts/settingsExportUtils'
import type { SettingsExport } from '@/types/settingsExport'
import ExportDialog from './ExportDialog.vue'
import ImportDialog from './ImportDialog.vue'
import { asError } from 'catch-unknown'

const showExport = ref(false)
const showImport = ref(false)
const importData = ref<SettingsExport | null>(null)
const parseError = ref<string | null>(null)

watchEffect(() => {
  if (!showImport.value) {
    importData.value = null
  }
})

function openFilePicker() {
  parseError.value = null
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'application/json,.json'
  input.onchange = () => {
    const file = input.files?.[0]
    if (!file) {
      return
    }
    
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        importData.value = parseSettingsFile(content)
        showImport.value = true
      } catch (err) {
        parseError.value = asError(err).message
      }
    }
    reader.readAsText(file)
  }
  input.click()
}
</script>

<template>
  <div class="iep-panel">
    <section class="iep-section">
      <h3 class="iep-title">
        <i class="pi pi-download" />
        Export Settings
      </h3>
      <p>
        Save your current settings to a JSON file. When exporting you can choose which sections to include — board
        layout, item display, click colors, item selection, and the full item set.
      </p>
      <p>
        Exports are useful for backing up your configuration or sharing a setup with others. You can give the export a
        name to help identify it later.
      </p>
      <Button icon="pi pi-download" label="Export Settings" fluid @click="showExport = true" />
    </section>

    <Divider />

    <section class="iep-section">
      <h3 class="iep-title">
        <i class="pi pi-upload" />
        Import Settings
      </h3>
      <p>
        Load settings from a previously exported file. When importing you can choose which sections to apply, so you can
        bring in just the item set without touching your color configuration, for example.
      </p>
      <Message severity="warn" icon="pi pi-exclamation-triangle">
        Importing will overwrite your current settings. Consider exporting first as a backup.
      </Message>
      <Message v-if="parseError" severity="error" icon="pi pi-times-circle">{{ parseError }}</Message>
      <Button icon="pi pi-upload" label="Import from File" fluid @click="openFilePicker" />
    </section>
  </div>

  <ExportDialog v-model:visible="showExport" />
  <ImportDialog v-if="importData" v-model:visible="showImport" :data="importData" />
</template>

<style scoped lang="postcss">
.iep-panel {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  gap: 0;
}

.iep-section {
  display: flex;
  flex-direction: column;
  gap: 0.625rem;

  & p {
    margin: 0;
    line-height: 1.5;
    color: var(--p-text-muted-color);
    font-size: 0.875rem;
  }
}

.iep-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
