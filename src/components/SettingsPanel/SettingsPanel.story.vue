<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsPanel.vue'
</script>

<template>
  <Story>
    <StoryComponent v-on="logEmits(StoryComponent)" />
  </Story>
</template>
