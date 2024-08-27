<script setup lang="ts">
import Button from 'primevue/button'
defineProps<{
  label: string
}>()

const emit = defineEmits<{
  click: []
}>()

defineOptions({
  inheritAttrs: false,
})
</script>

<template>
  <div class="sp-button-row">
    <Button type="button" :label="label" v-bind="$attrs" @click="emit('click')" />
  </div>
</template>

<style scoped lang="postcss">
.sp-button-row {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
}
</style>
