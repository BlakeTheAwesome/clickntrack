import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import type { App } from 'vue'
import Tooltip from 'primevue/tooltip'

export function installPrimeVue(app: App) {
  app.use(PrimeVue)
  app.use(ConfirmationService)
  app.directive('tooltip', Tooltip)
}
