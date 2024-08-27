<script setup lang="ts">
import ColorPicker from 'primevue/colorpicker'
import { computed } from 'vue'

// Expected string format: #rrggbb
const modelValue = defineModel<string>({ required: true })

defineProps<{
  label: string
}>()

defineOptions({
  inheritAttrs: false,
})

const colorModel = computed({
  get: () => modelValue.value.substring(1),
  set: (col) => {
    modelValue.value = `#${col}`
  },
})
</script>

<template>
  <div class="sp-item-row">
    <span>{{ label }}</span>
    <ColorPicker v-model="colorModel" class="sp-control" />
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
