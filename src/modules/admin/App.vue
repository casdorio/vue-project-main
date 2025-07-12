<template>
  <div id="app">
    <div v-if="authStore.isSessionLoading" class="splash-screen">
      <img src="/casdorio/img/favicon/logo.svg?v=1" alt="Loading" class="loading-logo">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
      <p class="loading-text">Carregando sessão...</p>
    </div>
    <router-view v-else /> </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();
</script>

<style>

.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #ffffff; /* Ou a cor de fundo do seu tema */
  z-index: 9999; /* Garante que fique por cima de tudo */
}

.loading-logo {
    width: 100px; /* Ajuste o tamanho conforme necessário */
    height: 100px;
    margin-bottom: 20px;
}

.spinner-border {
    width: 3rem;
    height: 3rem;
    margin-bottom: 15px;
}

.loading-text {
    font-size: 1.2em;
    color: #666;
}
</style>
