<script setup lang="ts">
import ColorPicker from 'primevue/colorpicker'
import InputText from 'primevue/inputtext'
import { computed, ref, watch } from 'vue'

// Expected string format: #rrggbb
const modelValue = defineModel<string>({ required: true })

defineProps<{
  label: string
  helpText?: string
}>()

const textInvalid = ref(false)

const colorText = ref(modelValue.value)
const colorModel = computed({
  get: () => modelValue.value.substring(1),
  set: (col) => {
    modelValue.value = `#${col}`
    colorText.value = `#${col}`
  },
})

const validColorRegex = /^#([0-9a-f]{6})$/
watch(colorText, (text) => {
  let x = text.trim().toLowerCase()
  if (x[0] !== '#') {
    x = '#' + x
  }
  if (x.match(validColorRegex)) {
    modelValue.value = x
    textInvalid.value = false
  } else {
    textInvalid.value = true
  }
})
</script>

<template>
  <div class="sci-item-row">
    <div class="sci-label-area">
      <span class="sci-grow">{{ label }}</span>
      <div v-if="helpText" v-tooltip="helpText" class="pi pi-info-circle"></div>
    </div>
    <div class="sci-control-area">
      <ColorPicker v-model="colorModel" />
      <InputText v-model="colorText" :invalid="textInvalid" class="sci-grow" />
      <small v-if="textInvalid" class="sci-error">String must match the format: #0099ff</small>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.sci-item-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
}

.sci-label-area {
  width: 30%;
  display: flex;
  flex-direction: row;
  align-items: center;
}

.sci-controls {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 0.5rem;
  flex-grow: 1;
}

.sci-grow {
  flex-grow: 1;
}

.sci-control-area {
  flex-grow: 1;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-auto-flow: row;
  gap: 0.5rem;
  align-items: center;
}

.sci-error {
  color: red;
  grid-column: 2;
}
</style>
