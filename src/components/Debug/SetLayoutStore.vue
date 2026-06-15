<script setup lang="ts">
import { useBoardStore } from '@/stores/boardStore'
import { useItemDisplayStore } from '@/stores/itemDisplayStore'
import { onBeforeMount, useAttrs } from 'vue'
const boardStore = useBoardStore()
const itemDisplayStore = useItemDisplayStore()
const attrs = useAttrs()

onBeforeMount(() => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writableBoard = boardStore as Record<string, any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writableItemDisplay = itemDisplayStore as Record<string, any>
  for (const [k, v] of Object.entries(attrs)) {
    if (k in writableBoard) {
      writableBoard[k] = v
    } else if (k in writableItemDisplay) {
      writableItemDisplay[k] = v
    }
  }
})
</script>

<template>
  <div class="set-layout-store" />
</template>
