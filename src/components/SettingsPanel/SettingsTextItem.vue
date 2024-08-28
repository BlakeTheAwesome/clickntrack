<script setup lang="ts">
import InputText from 'primevue/inputtext'

const modelValue = defineModel<string>({ required: true })

defineProps<{
  label: string
  helpText?: string
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sti-item-row">
    <div class="sti-label-area">
      <span class="sti-grow">{{ label }}</span>
      <div v-if="helpText" v-tooltip="helpText" class="pi pi-info-circle"></div>
    </div>
    <InputText v-model="modelValue" class="sti-grow" v-bind="$attrs" />
  </div>
</template>

<style scoped lang="postcss">
.sti-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sti-label-area {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sti-label {
  width: 30%;
}

.sti-grow {
  flex-grow: 1;
}
</style>
