<script setup lang="ts">
import Checkbox from 'primevue/checkbox'

const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  label: string
  helpText?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sci-item-row">
    <div class="sci-label-area">
      <span class="sci-grow">{{ label }}</span>
      <div v-if="helpText" v-tooltip="helpText" class="pi pi-info-circle"></div>
    </div>
    <Checkbox v-model="modelValue" class="sci-grow" :binary="true" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sci-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sci-label-area {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sci-label {
  width: 30%;
}

.sci-grow {
  flex-grow: 1;
}
</style>
