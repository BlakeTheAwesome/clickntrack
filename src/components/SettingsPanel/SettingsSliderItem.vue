<script setup lang="ts">
import Slider from 'primevue/slider'

const modelValue = defineModel<number>({ required: true })

defineProps<{
  label: string
  min: number
  max: number
  helpText?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="ssi-item-row">
    <div class="ssi-label-area">
      <span class="ssi-grow">{{ label }}</span>
      <div v-if="helpText" v-tooltip="helpText" class="pi pi-info-circle"></div>
    </div>
    <Slider v-model="modelValue" class="ssi-grow" :min="min" :max="max" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.ssi-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.ssi-label-area {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.ssi-label {
  width: 30%;
}

.ssi-grow {
  flex-grow: 1;
}
</style>
