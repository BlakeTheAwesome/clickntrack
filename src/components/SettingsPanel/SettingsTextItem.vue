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
  <div class="sp-item-row">
    <span>{{ label }}</span>
    <InputText v-model="modelValue" class="sp-control" v-bind="$attrs" />
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
