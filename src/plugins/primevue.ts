import PrimeVue from 'primevue/config'
import type { App } from 'vue'
import 'primevue/resources/themes/lara-light-indigo/theme.css'
import 'primeicons/primeicons.css'

export function installPrimeVue(app: App) {
  app.use(PrimeVue)
}
