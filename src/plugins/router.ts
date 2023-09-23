import { createRouter, createWebHashHistory } from 'vue-router'
import TrackerView from '@/views/TrackerView.vue'
import EditorView from '@/views/EditorView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'tracker',
      component: TrackerView,
    },
    {
      path: '/editor',
      name: 'editor',
      component: EditorView,
    },
  ],
})

export default router
