<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  dexNum: number
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

// const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
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
  background-color: lightgray;
  /* background-color: v-bind(randomColor); */
  margin: v-bind(margins);

  &.layout-hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }
}
</style>
