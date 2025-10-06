<script setup lang="ts" generic="T extends string | number | boolean">
import Select from 'primevue/select'

type SelectItem = {
  label: string
  value: T
}

const modelValue = defineModel<T>({ required: true })

defineProps<{
  label: string
  items: readonly SelectItem[]
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
    <Select
      v-model="modelValue"
      :options="items"
      optionLabel="label"
      optionValue="value"
      class="ssi-grow"
      v-bind="$attrs"
    />
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
