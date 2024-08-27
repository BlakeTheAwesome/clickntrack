<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsColorItem.vue'
import { ref } from 'vue'

const val = ref('')
</script>

<template>
  <Story>
    <StoryComponent v-model="val" label="Text Field" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
