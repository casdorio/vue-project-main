<template>
  <li class="nav-item dropdown-school dropdown me-2 me-xl-0">
    <select
      id="selectUnits"
      class="form-select w-100 pe-1 select-units"
      v-model="selectedUnitId"
      @change="handleUnitChange"
      :disabled="schoolsStore.allSchools.length === 0" >
      <option value="" disabled>
        {{ schoolsStore.allSchools.length === 0 ? 'Nenhuma Unidade Disponível' : 'Selecione Unidade' }}
      </option>
      <option
        v-for="school in schoolsStore.allSchools" :key="school.id"
        :value="school.id"
      >
        {{ school.name }}
      </option>
    </select>
  </li>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'; // Removido onMounted, pois o watcher com immediate já cobre
import { useAuthStore } from '@/stores/authStore'; // Ainda precisa para checar isAuthenticated talvez para o fetch
import { useSettingsStore } from '@/stores/settingsStore';
import { useSchoolsStore } from '@/stores/schoolStore'; // NOVO: Importe o schoolsStore

// Obtenha as instâncias dos stores
const authStore = useAuthStore(); // Para checar se o usuário está logado antes de buscar escolas, se fetchSchools não fizer isso
const settingsStore = useSettingsStore();
const schoolsStore = useSchoolsStore(); // Instância do schoolsStore

// selectedUnitId armazena apenas o ID da unidade selecionada no select
const selectedUnitId = ref<string | null>(null);

// --- Lógica de Inicialização e Reatividade da Seleção de Unidade ---

const initializeSelectedSchool = () => {
  const availableSchools = schoolsStore.allSchools; // AGORA PEGA DO schoolsStore

  if (availableSchools.length === 0) {
    selectedUnitId.value = null;
    settingsStore.setActiveSchool(null);
    console.log('Nenhuma escola disponível para seleção.');
    return;
  }

  const storedSelectedSchoolId = localStorage.getItem('activeSchoolId');
  let initialSchool: School | undefined = undefined;

  if (storedSelectedSchoolId) {
    initialSchool = availableSchools.find(school => school.id === storedSelectedSchoolId);
  }

  if (!initialSchool) {
    initialSchool = availableSchools[0];
  }

  if (initialSchool) {
    selectedUnitId.value = initialSchool.id;
    settingsStore.setActiveSchool(initialSchool);
    console.log('Unidade selecionada inicialmente:', initialSchool.name);
  } else {
    selectedUnitId.value = null;
    settingsStore.setActiveSchool(null);
  }
};

// --- Watcher para reagir às mudanças nas escolas do schoolsStore ---
// Este watcher vai reagir quando schoolsStore.schoolsList for preenchido/atualizado
watch(() => schoolsStore.allSchools, (newSchools) => {
  console.log('schoolsStore.allSchools mudou. Reavaliando seleção de unidade.');
  initializeSelectedSchool();
}, { immediate: true, deep: true });


// --- Lógica para quando o usuário muda a seleção ---
const handleUnitChange = () => {
  if (selectedUnitId.value) {
    const newlySelectedSchool = schoolsStore.allSchools.find( // AGORA PEGA DO schoolsStore
      school => school.id === selectedUnitId.value
    );
    if (newlySelectedSchool) {
      settingsStore.setActiveSchool(newlySelectedSchool);
      console.log('Unidade alterada pelo usuário:', newlySelectedSchool.name);
    } else {
      console.warn('ID de escola selecionado não encontrado na lista atual.');
      settingsStore.setActiveSchool(null);
    }
  } else {
    settingsStore.setActiveSchool(null);
  }
};

// Ao montar o componente, forçamos a busca de escolas
onMounted(() => {
    // Apenas se o usuário estiver autenticado
    if (authStore.isAuthenticated) {
        schoolsStore.fetchSchools();
    }
});

// Watcher para buscar escolas se o status de autenticação mudar
watch(() => authStore.isAuthenticated, (newStatus) => {
  if (newStatus) {
    schoolsStore.fetchSchools();
  } else {
    // Se deslogou, limpa a lista de escolas no schoolsStore e a seleção no settingsStore
    schoolsStore.schoolsList = []; // Ou chame uma ação clearSchools() se existir no schoolsStore
    settingsStore.setActiveSchool(null);
  }
}, { immediate: true }); // Executa imediatamente para pegar o status inicial de autenticação
</script>
