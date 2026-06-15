<script setup lang="ts">
import { ref } from 'vue'
import StoryComponent from './ExportDialog.vue'

const visible = ref(true)
</script>

<template>
  <Story>
    <button @click="visible = true">Open Export Dialog</button>
    <StoryComponent v-model:visible="visible" />
  </Story>
</template>
