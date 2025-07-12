import { defineStore } from 'pinia';
import { ref } from 'vue';

// Defina a interface School exatamente como em authStore.ts
interface School {
  id: string;
  name: string;
  cnpj: string;
  subdomain: string;
  [key: string]: any;
}

// Interface para Period
interface Period {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  description?: string;
  school_id: string;
  [key: string]: any;
}

export const useSettingsStore = defineStore('settings', () => {
  // Inicializa a escola ativa com base no localStorage, se houver um ID salvo
  const activeSchool = ref<School | null>(null);

  // Inicializa o período ativo com base no localStorage, se houver um ID salvo
  const activePeriod = ref<Period | null>(null);

  /**
   * Define a escola ativa no store e a persiste no localStorage.
   * @param school O objeto School completo a ser definido como ativo.
   */
  function setActiveSchool(school: School | null) {
    activeSchool.value = school;
    if (school) {
      localStorage.setItem('activeSchoolId', school.id);
    } else {
      localStorage.removeItem('activeSchoolId');
      localStorage.removeItem('activePeriodId'); // Limpa período ativo se escola for removida
      activePeriod.value = null;
    }
  }

  /**
   * Define o período ativo no store e o persiste no localStorage.
   * @param period O objeto Period completo a ser definido como ativo.
   */
  function setActivePeriod(period: Period | null) {
    activePeriod.value = period;
    if (period) {
      localStorage.setItem('activePeriodId', period.id);
    } else {
      localStorage.removeItem('activePeriodId');
    }
  }

  return { activeSchool, setActiveSchool, activePeriod, setActivePeriod };
});
