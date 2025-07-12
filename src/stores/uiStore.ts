// src/stores/uiStore.ts

import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUiStore = defineStore('ui', () => {
  // === STATE ===
  const isLoading = ref(false)

  // === ACTIONS ===
  function startLoading() {
    isLoading.value = true
  }

  function stopLoading() {
    isLoading.value = false
  }

  return {
    isLoading,
    startLoading,
    stopLoading,
  }
})
