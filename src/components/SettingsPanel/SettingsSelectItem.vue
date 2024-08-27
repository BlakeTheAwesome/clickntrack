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
  <div class="sp-item-row">
    <span>{{ label }}</span>
    <Select v-model="modelValue" :options="items" optionLabel="label" optionValue="value" v-bind="$attrs" />
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
