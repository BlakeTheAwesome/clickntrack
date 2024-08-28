<script setup lang="ts">
import InputText from 'primevue/inputtext'

const modelValue = defineModel<string>({ required: true })

defineProps<{
  label: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sti-item-row">
    <span class="sti-label">{{ label }}</span>
    <InputText v-model="modelValue" class="sti-control" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sti-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sti-label {
  width: 30%;
}

.sti-control {
  flex-grow: 1;
}
</style>
