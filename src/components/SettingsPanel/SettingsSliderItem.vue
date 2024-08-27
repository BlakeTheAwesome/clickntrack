<script setup lang="ts">
import Slider from 'primevue/slider'

const modelValue = defineModel<number>({ required: true })

defineProps<{
  label: string
  min: number
  max: number
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sp-item-row">
    <span>{{ label }}</span>
    <Slider v-model="modelValue" class="sp-control" :min="min" :max="max" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sp-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sp-control {
  flex-grow: 1;
}
</style>
