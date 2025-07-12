import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useSettingsStore } from './settingsStore';

export const useSubjectsStore = defineStore('subjects', () => {
  const settingsStore = useSettingsStore();
  const allSubjects = ref<any[]>([]);
  const isLoadingSubjects = ref(false);
  const subjectsError = ref<string | null>(null);

  async function fetchSubjects() {
    if (!settingsStore.activeSchool) {
      allSubjects.value = [];
      subjectsError.value = 'Nenhuma escola ativa selecionada';
      return;
    }
    isLoadingSubjects.value = true;
    try {
      const response = await axios.get('/api/subjects', {
        params: { school_id: settingsStore.activeSchool.id }
      });
      allSubjects.value = response.data;
      subjectsError.value = null;
    } catch (error) {
      subjectsError.value = 'Erro ao carregar disciplinas';
      allSubjects.value = [];
    } finally {
      isLoadingSubjects.value = false;
    }
  }

  return { allSubjects, isLoadingSubjects, subjectsError, fetchSubjects };
});
