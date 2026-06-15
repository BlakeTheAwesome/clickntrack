<script setup lang="ts">
import type { App } from 'vue'
import StoryComponent from './HeaderBar.vue'
import Button from 'primevue/button'
import Tooltip from 'primevue/tooltip'

// Workaround for 'tooltip' directive not being found, instead gives us a duplicate directive warning
// Inline type used because histoire 1.0.0-beta.1 has a mismatch: components.d.ts types setupApp as
// `{ app, story, variant }` but Vue3StorySetupApi (and defineSetupVue3) still requires `addWrapper`,
// making them incompatible. Should be replaceable with `defineSetupVue3` from '@histoire/plugin-vue'
// once that inconsistency is resolved upstream.
function localSetupApp({ app }: { app: App }) {
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
