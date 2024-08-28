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
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="ssi-item-row">
    <span class="ssi-label">{{ label }}</span>
    <Select
      v-model="modelValue"
      :options="items"
      optionLabel="label"
      optionValue="value"
      class="sp-control"
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

.ssi-label {
  width: 30%;
}

.sp-control {
  flex-grow: 1;
}
</style>
