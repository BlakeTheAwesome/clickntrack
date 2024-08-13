<script setup lang="ts">
import { useRouter } from 'vue-router'
import PageTrackerLayout from '@/pages/PageTrackerLayout.vue'
import { useTrackerStore } from '@/stores/trackerStore'

const router = useRouter()
const trackerStore = useTrackerStore()

function openItemEditor() {
  router.push({ name: 'editor' })
}
</script>

<template>
  <PageTrackerLayout
    :gridItems="trackerStore.gridItems"
    @open-item-editor="openItemEditor"
    @clear-tracker="trackerStore.clearTracker"
  />
</template>
