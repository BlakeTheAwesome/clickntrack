<script setup lang="ts">
import { logEmits } from '@/scripts/histoireUtils'
import StoryComponent from './SettingsSliderItem.vue'
import { ref } from 'vue'

const val = ref(0)
const min = ref(0)
const max = ref(100)
</script>

<template>
  <Story>
    <StoryComponent v-model="val" :min="min" :max="max" label="Slider Field" v-on="logEmits(StoryComponent)" />
  </Story>
</template>
