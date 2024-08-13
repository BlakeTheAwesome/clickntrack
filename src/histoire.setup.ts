// import './assets/main.css'
import { installPrimeVue } from './plugins/primevue'
import { installPinia } from './plugins/pinia'
import { defineSetupVue3 } from '@histoire/plugin-vue'

import './styles/main.css'
import './styles/histoire.css'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const setupVue3 = defineSetupVue3(({ app, story, variant }) => {
  installPinia(app, false)
  installPrimeVue(app)
})
