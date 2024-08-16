<script setup lang="ts">
import StoryComponent from './GridIcon.vue'
import { useTrackerStore } from '@/stores/trackerStore'
import SetLayoutStore from '@/components/Debug/SetLayoutStore.vue'
import { computed } from 'vue'
const trackerStore = useTrackerStore()

const item = computed(() => trackerStore.gridItems[0])
</script>

<template>
  <Story>
    <Variant title="Square">
      <SetLayoutStore itemShape="Square" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
    <Variant title="Square With Text">
      <SetLayoutStore itemShape="Square" displayType="Both" textLocation="BR" :textMargin="16" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
    <Variant title="Hex">
      <SetLayoutStore itemShape="Hex" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
    <Variant title="Hex Filtered">
      <SetLayoutStore itemShape="Hex" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="true" />
    </Variant>
    <Variant title="Hex With Text">
      <SetLayoutStore itemShape="Hex" displayType="Both" textLocation="BR" :textMargin="16" />
      <StoryComponent :item="item" :offsetRow="false" :filtered="false" />
    </Variant>
  </Story>
</template>
