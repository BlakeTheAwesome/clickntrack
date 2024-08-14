<script setup lang="ts">
import { useLayoutStore } from '@/stores/layoutStore'
import { onBeforeMount, useAttrs } from 'vue'
const layoutStore = useLayoutStore()
const attrs = useAttrs()

onBeforeMount(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writableStore = layoutStore as Record<string, any>
  for (const [k, v] of Object.entries(attrs)) {
    writableStore[k] = v
  }
})
</script>

<template>
  <div class="set-layout-store" />
</template>
