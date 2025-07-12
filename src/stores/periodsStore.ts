import { defineStore } from 'pinia';
import axios from 'axios';

export const usePeriodsStore = defineStore('periods', {
  state: () => ({
    allPeriods: [],
    isLoadingPeriods: false,
    periodsError: null,
  }),
  actions: {
    async fetchPeriods() {
      this.isLoadingPeriods = true;
      try {
        // Replace with actual API call to your Laravel backend
        const response = await axios.get('/api/periods', {
          params: { school_id: this.$store.settings.activeSchool?.id }
        });
        this.allPeriods = response.data;
        this.periodsError = null;
      } catch (error) {
        this.periodsError = 'Erro ao carregar períodos letivos';
        this.allPeriods = [];
      } finally {
        this.isLoadingPeriods = false;
      }
    }
  }
});
