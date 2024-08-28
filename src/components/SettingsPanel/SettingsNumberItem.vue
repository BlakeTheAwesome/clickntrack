<script setup lang="ts">
import InputNumber from 'primevue/inputnumber'

const modelValue = defineModel<number>({ required: true })

defineProps<{
  label: string
  helpText?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sni-item-row">
    <div class="sni-label-area">
      <span class="sni-grow">{{ label }}</span>
      <div v-if="helpText" v-tooltip="helpText" class="pi pi-info-circle"></div>
    </div>
    <InputNumber v-model="modelValue" class="sni-grow" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sni-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sni-label-area {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sni-label {
  width: 30%;
}

.sni-grow {
  flex-grow: 1;
}
</style>
