<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsNumberItem.vue'
import { ref } from 'vue'

const val = ref(0)
</script>

<template>
  <Story>
    <StoryComponent v-model="val" label="Number Field" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
