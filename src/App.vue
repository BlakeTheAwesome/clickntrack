<script setup lang="ts">
import { RouterView } from 'vue-router'
import ErrorBoundary from '@/components/ErrorBoundary.vue'
</script>

<template>
  <main>
    <ErrorBoundary>
      <RouterView />
    </ErrorBoundary>
  </main>
</template>
