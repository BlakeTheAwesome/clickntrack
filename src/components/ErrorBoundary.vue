<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue'

const hasError = ref(false)
const errorMessage = ref('')

onErrorCaptured((err) => {
  hasError.value = true
  errorMessage.value = err instanceof Error ? err.message : String(err)
  return false
})

function downloadBackup() {
  const backup: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i)
    if (key?.startsWith('clickntrack-pinia-')) {
      const raw = localStorage.getItem(key)
      try {
        backup[key] = JSON.parse(raw ?? '')
      } catch {
        backup[key] = raw
      }
    }
  }
  const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'clickntrack-backup.json'
  a.click()
  URL.revokeObjectURL(url)
  a.remove()
}

function clearAndReload() {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i)
    if (key?.startsWith('clickntrack-pinia-')) {
      localStorage.removeItem(key)
    }
  }
  window.location.reload()
}
</script>

<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-boundary__card">
      <h1 class="error-boundary__title">Something went wrong</h1>
      <p class="error-boundary__message">
        The app failed to load, likely due to corrupted or unrecognised settings in your browser. You can download a
        backup of your current settings before clearing them.
      </p>
      <p class="error-boundary__detail">{{ errorMessage }}</p>
      <div class="error-boundary__actions">
        <button class="error-boundary__btn error-boundary__btn--secondary" @click="downloadBackup">
          Download Backup
        </button>
        <button class="error-boundary__btn error-boundary__btn--primary" @click="clearAndReload">
          Clear Settings & Reload
        </button>
      </div>
    </div>
  </div>
  <slot v-else />
</template>

<style scoped>
.error-boundary {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
  font-family: var(--default-font, 'Open Sans', sans-serif);
}

.error-boundary__card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  max-width: 480px;
  width: 100%;
}

.error-boundary__title {
  margin: 0 0 1rem;
  font-size: 1.5rem;
  color: #1a1a1a;
}

.error-boundary__message {
  margin: 0 0 0.75rem;
  color: #444;
  line-height: 1.6;
}

.error-boundary__detail {
  margin: 0 0 1.5rem;
  font-family: monospace;
  font-size: 0.8rem;
  color: #888;
  word-break: break-all;
}

.error-boundary__actions {
  display: flex;
  gap: 0.75rem;
}

.error-boundary__btn {
  flex: 1;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-family: inherit;
  cursor: pointer;
  transition: opacity 0.15s;
}

.error-boundary__btn:hover {
  opacity: 0.85;
}

.error-boundary__btn--primary {
  background: #c0392b;
  color: white;
}

.error-boundary__btn--secondary {
  background: #e8e8e8;
  color: #333;
}
</style>
