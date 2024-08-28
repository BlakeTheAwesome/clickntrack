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
  <div class="sci-item-row">
    <span class="sci-label">{{ label }}</span>
    <Checkbox v-model="modelValue" class="sci-control" :binary="true" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sci-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sci-label {
  width: 30%;
}

.sci-control {
  flex-grow: 1;
}
</style>
