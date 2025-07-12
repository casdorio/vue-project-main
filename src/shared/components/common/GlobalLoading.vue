<template>
  <div v-if="uiStore.isLoading" class="loading-overlay">
    <div class="spinner"></div>
  </div>
</template>

<script setup lang="ts">
import { useUiStore } from '@/stores/uiStore';

const uiStore = useUiStore();
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(255, 255, 255, 0.7); /* Fundo branco semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* Garante que ele fique acima de tudo */
  backdrop-filter: blur(4px); /* Efeito de desfoque moderno */
}

.spinner {
  border: 5px solid rgba(0, 0, 0, 0.1);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border-left-color: #0d6efd; /* Cor primária do Bootstrap ou do seu tema */

  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
