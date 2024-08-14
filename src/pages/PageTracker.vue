<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageTrackerLayout from '@/pages/PageTrackerLayout.vue'
import { useTrackerStore } from '@/stores/trackerStore'
import { asError } from 'catch-unknown'

const router = useRouter()
const trackerStore = useTrackerStore()

function openItemEditor() {
  router.push({ name: 'editor' }).catch((e) => {
    console.error(asError(e))
  })
}
</script>

<template>
  <PageTrackerLayout
    :grid-items="trackerStore.gridItems"
    @open-item-editor="openItemEditor"
    @clear-tracker="trackerStore.clearTracker"
  />
</template>
