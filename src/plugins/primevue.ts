import PrimeVue from 'primevue/config'
import type { App } from 'vue'
import Tooltip from 'primevue/tooltip'

export function installPrimeVue(app: App) {
  app.use(PrimeVue)
  app.directive('tooltip', Tooltip)
}
