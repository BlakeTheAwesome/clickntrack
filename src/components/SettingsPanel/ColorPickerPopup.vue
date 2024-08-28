<script setup lang="ts">
import ColorPicker from 'primevue/colorpicker'
import InputText from 'primevue/inputtext'
import Popover from 'primevue/popover'
import { computed, ref, watch } from 'vue'

// Expected string format: #rrggbb
const modelValue = defineModel<string>({ required: true })

const popoverRef = ref<InstanceType<typeof Popover> | null>(null)

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
  <div>
    <button type="button" class="cpp-button" @click="popoverRef?.toggle($event)"></button>
    <Popover ref="popoverRef">
      <div class="cpp-control-area">
        <ColorPicker v-model="colorModel" inline />
        <InputText v-model="colorText" :invalid="textInvalid" />
        <small v-if="textInvalid" class="cpp-error">String must match the format: #0099ff</small>
      </div>
    </Popover>
  </div>
</template>

<style scoped>
.cpp-button {
  height: var(--p-checkbox-height);
  width: var(--p-checkbox-width);
  border: 1px solid var(--p-checkbox-border-color);
  border-radius: var(--p-checkbox-border-radius);
  background-color: v-bind(modelValue);
  cursor: pointer;
}

.cpp-control-area {
  width: 195px;
  display: grid;
  grid-template-columns: 100%;
  gap: 0.5rem;
}

.cpp-error {
  color: red;
}
</style>
