<script setup lang="ts">
import { computed } from 'vue'
import { useTrackerStore } from '@/stores/trackerStore';
const trackerStore = useTrackerStore();

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

const trackerState = computed(() => props.dexNum !== null ? trackerStore.getClickInfo(props.dexNum) : null)

const bgCol = computed(() => trackerState.value?.colour ?? 'transparent')

function onLeftClick() {
  if (props.dexNum !== null) {
    trackerStore.incrementClickCount(props.dexNum)
  }
}

function onRightClick() {
  if (props.dexNum !== null) {
    trackerStore.decrementClickCount(props.dexNum)
  }
}

</script>

<template>
  <div :class="`icon-pokemon layout-${layout}`" @click="onLeftClick" @click.right.prevent="onRightClick">
    <img v-if="dexNum !== null" :src="`pokemon/sprites/${dexNum}.png`" :alt="`#${dexNum}`" />
  </div>
</template>

<style scoped lang="postcss">
.icon-pokemon {
  display: grid;
  place-content: center;
  background-color: v-bind(bgCol);
  margin: v-bind(margins);
  user-select: none;
  cursor: pointer;

  &.layout-hex {
    clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
  }

  & img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
}
</style>
