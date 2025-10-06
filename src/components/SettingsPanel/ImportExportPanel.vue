<script setup lang="ts">
import Button from 'primevue/button'
import FileUpload, { type FileUploadSelectEvent } from 'primevue/fileupload'
import { useTrackerStore } from '@/stores/trackerStore'

const trackerStore = useTrackerStore()

function onImportSettingsFileSelected(event: FileUploadSelectEvent) {
  const files = event.files as File[]
  const file = files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const content = e.target?.result as string
      const obj = JSON.parse(content) as Record<string, unknown>
      trackerStore.importFromJsonObj(obj)
    } catch (error) {
      console.error('Failed to import settings:', error)
    }
  }
  reader.readAsText(file)
}

function exportSettings() {
  const obj = trackerStore.exportToJsonObj()
  const jsonString = JSON.stringify(obj, null, 2)
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = `clickntrack-settings-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
</script>

<template>
  <div class="import-export-panel">
    <FileUpload
      mode="basic"
      accept="application/json"
      :auto="true"
      chooseLabel="Import"
      chooseIcon="pi pi-import"
      severity="primary"
      @select="onImportSettingsFileSelected"
    />
    <Button icon="pi pi-export" severity="primary" raised aria-label="Export" @click="exportSettings">Export</Button>
  </div>
</template>
