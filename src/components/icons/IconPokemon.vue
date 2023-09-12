<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  dexNum: number | null
  layout: 'grid' | 'hex'
  offsetRow: boolean
}>()

const margins = computed(() => {
  if (props.layout === 'grid') {
    return '0'
  }
  if (props.offsetRow) {
    return '-12.5% calc(50% + 1px) -12.5% calc(-50% - 1px)'
  }
  return '-12.5% calc(0%) -12.5% calc(0%)'
})

const bgCol = computed(() => (props.dexNum !== null ? 'lightgray' : 'transparent'))
</script>

<template>
  <div :class="`icon-pokemon layout-${layout}`">
    {{ dexNum }}
  </div>
</template>

<style scoped lang="postcss">
.icon-pokemon {
  display: grid;
  place-content: center;
  background-color: v-bind(bgCol);
  margin: v-bind(margins);

  &.layout-hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
}
</style>
