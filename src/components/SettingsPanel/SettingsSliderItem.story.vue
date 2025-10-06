<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsSliderItem.vue'
import { ref } from 'vue'

const val = ref(0)
</script>

<template>
  <Story>
    <StoryComponent v-model="val" label="Slider Field" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
