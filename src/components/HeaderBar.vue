<script setup lang="ts">
import Button from 'primevue/button'
const emit = defineEmits<{ toggleSettings: [] }>()

const githubLink = 'https://github.com/BlakeTheAwesome/clickntrack'
</script>

<template>
  <div class="header-bar">
    <span class="hb-title">Click N Track</span>
    <div class="hb-controls">
      <span class="hb-author">By MutantSheepdog</span>
      <Button
        icon="pi pi-cog"
        severity="secondary"
        text
        raised
        rounded
        aria-label="Toggle Settings"
        @click="emit('toggleSettings')"
      />
      <a :href="githubLink">
        <Button icon="pi pi-github" severity="secondary" text raised rounded aria-label="GitHub" />
      </a>
    </div>
  </div>
</template>

<style scoped lang="postcss">
.header-bar {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

.hb-title {
  font-size: 1.5rem;
  font-weight: bold;
  font-family: 'Brush Script MT', cursive;
}

.hb-author {
  font-size: 1rem;
  font-family: 'Brush Script MT', cursive;
  color: #666;
}

.hb-controls {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: center;
}
</style>
