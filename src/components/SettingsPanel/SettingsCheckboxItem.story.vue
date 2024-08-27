<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsNumberItem.vue'
import { ref } from 'vue'

const val = ref(false)
</script>

<template>
  <Story>
    <StoryComponent v-model="val" label="Checkbox Field" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
