// import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './plugins/router'
import { installPrimeVue } from './plugins/primevue'
import { installPinia } from './plugins/pinia'

import './styles/main.css'

const app = createApp(App)

installPinia(app)
installPrimeVue(app)
app.use(router)

app.mount('#app')
