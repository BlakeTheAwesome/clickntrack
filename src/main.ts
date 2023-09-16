// import './assets/main.css'

import { createApp } from 'vue'

import App from './App.vue'
import router from './plugins/router'
import { installPinia } from './plugins/pinia'

const app = createApp(App)

installPinia(app)
app.use(router)

app.mount('#app')
