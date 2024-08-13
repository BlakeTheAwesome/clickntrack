<script setup lang="ts">
import { useLayoutStore } from '@/stores/layoutStore'
import { onBeforeMount, useAttrs } from 'vue'
const layoutStore = useLayoutStore()
const attrs = useAttrs()

onBeforeMount(() => {
  for (const [k, v] of Object.entries(attrs)) {
    ;(layoutStore as any)[k] = v
  }
})
</script>

<template>
  <div class="set-layout-store"></div>
</template>
