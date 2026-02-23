<script setup>
import NavBar from './components/NavBar.vue'
import FooterBar from './components/FooterBar.vue'
</script>

<template>
  <NavBar />
  <main class="main-content">
    <RouterView />
  </main>
  <FooterBar />
</template>

<style scoped>
.main-content {
  flex: 1;
}
</style>
