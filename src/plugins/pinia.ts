import type { App } from 'vue'
import { createPinia } from 'pinia'
import { createPersistedState } from 'pinia-plugin-persistedstate'

export function installPinia(app: App) {
  const pinia = createPinia()
  pinia.use(
    createPersistedState({
      key: (storeName) => `clickntrack-pinia-${storeName}`,
      auto: true,
    }),
  )
  app.use(pinia)
}
