import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import type { App } from 'vue'
import Tooltip from 'primevue/tooltip'
import ToastService from 'primevue/toastservice'

export function installPrimeVue(app: App) {
  app.use(PrimeVue)
  app.use(ConfirmationService)
  app.use(ToastService)
  app.directive('tooltip', Tooltip)
}
