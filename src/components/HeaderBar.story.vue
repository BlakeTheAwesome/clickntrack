<script setup lang="ts">
import type { Vue3StorySetupApi } from '@histoire/plugin-vue'
import StoryComponent from './HeaderBar.vue'
import Button from 'primevue/button'
import Tooltip from 'primevue/tooltip'

// Workaround for 'tooltip' directive not being found, instead gives us a duplicate directive warning
function localSetupApp({ app }: Vue3StorySetupApi) {
  app.directive('tooltip', Tooltip)
}
</script>

<template>
  <Story :setupApp="localSetupApp">
    <Variant title="No Actions">
      <StoryComponent />
    </Variant>
    <Variant title="Actions">
      <StoryComponent>
        <template #actions>
          <Button
            v-tooltip.bottom="'Clear'"
            icon="pi pi-ban"
            severity="secondary"
            text
            raised
            rounded
            aria-label="Clear"
          />
          <Button
            v-tooltip.bottom="'Settings'"
            icon="pi pi-cog"
            severity="secondary"
            text
            raised
            rounded
            aria-label="Toggle Settings"
          />
        </template>
      </StoryComponent>
    </Variant>
  </Story>
</template>
