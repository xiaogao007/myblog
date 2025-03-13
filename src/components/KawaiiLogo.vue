<template>
  <div class="kawaii-logo" v-html="logoSvg"></div>
</template>

<script setup>
import { logoSvg } from '../assets/logo-kawaii.js'
</script>

<style scoped>
.kawaii-logo {
  display: inline-block;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}
</style> 