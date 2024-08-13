import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import type { App } from 'vue'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

import Lara from '@primevue/themes/lara'
import { definePreset } from '@primevue/themes';

const LaraIndigo = definePreset(Lara, {
  semantic: {
      primary: {
          50: '{indigo.50}',
          100: '{indigo.100}',
          200: '{indigo.200}',
          300: '{indigo.300}',
          400: '{indigo.400}',
          500: '{indigo.500}',
          600: '{indigo.600}',
          700: '{indigo.700}',
          800: '{indigo.800}',
          900: '{indigo.900}',
          950: '{indigo.950}'
      }
  }
});

export function installPrimeVue(app: App) {
  app.use(PrimeVue, {
    theme: {
      preset: LaraIndigo,
      options: {
        darkModeSelector: '.app-dark-mode', // This is a class I can add to enable dark mode,
        // cssLayer: 'primevue', // This currently breaks histoire in its jsdom dependency
      },
    },
  })
  app.use(ConfirmationService)
  app.use(ToastService)
  app.directive('tooltip', Tooltip)
}
