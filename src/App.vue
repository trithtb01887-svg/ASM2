<script setup>
import { RouterView } from 'vue-router'
import AppHeader from './components/AppHeader.vue'
import AppFooter from './components/AppFooter.vue'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1 container py-4">
      <RouterView />
    </main>
    <AppFooter />
  </div>
</template>

<style>
/* Global styles */
body {
  background-color: #f8f9fa;
}
</style>
