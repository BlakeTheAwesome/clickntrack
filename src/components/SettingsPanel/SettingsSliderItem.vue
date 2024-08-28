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
  <div class="ssi-item-row">
    <span class="ssi-label">{{ label }}</span>
    <Slider v-model="modelValue" class="ssi-control" :min="min" :max="max" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.ssi-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.ssi-label {
  width: 30%;
}

.ssi-control {
  flex-grow: 1;
}
</style>
