<script setup lang="ts">
import Checkbox from 'primevue/checkbox'

const modelValue = defineModel<boolean>({ required: true })

defineProps<{
  label: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sp-item-row">
    <span>{{ label }}</span>
    <Checkbox v-model="modelValue" class="sp-control" :binary="true" v-bind="$attrs" />
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
