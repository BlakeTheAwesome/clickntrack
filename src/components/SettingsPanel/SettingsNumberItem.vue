<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'

const modelValue = defineModel<number>({ required: true })

defineProps<{
  label: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sni-item-row">
    <span class="sni-label">{{ label }}</span>
    <InputNumber v-model="modelValue" class="sni-control" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sni-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sni-label {
  width: 30%;
}

.sni-control {
  flex-grow: 1;
}
</style>
