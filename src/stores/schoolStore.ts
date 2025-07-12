/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/schoolsStore.ts

import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import apiClient from '@/plugins/axios';
import { useAuthStore } from './authStore'; // Pode precisar do token do authStore

// Interface School (reutilize a que você já tem)
export interface School {
  id: string;
  name: string;
  cnpj: string;
  subdomain: string;
  [key: string]: any; // Para outras propriedades
}

export const useSchoolsStore = defineStore('schools', () => {
  // Estado para a lista de escolas
  const schoolsList = ref<School[]>([]);
  const isLoadingSchools = ref(false);
  const schoolsError = ref<string | null>(null);

  // Getters
  const allSchools = computed(() => schoolsList.value);
  const hasSchools = computed(() => schoolsList.value.length > 0);

  // Ações
  async function fetchSchools() {
    isLoadingSchools.value = true;
    schoolsError.value = null;
    const authStore = useAuthStore(); // Para pegar o token se necessário para a requisição

    if (!authStore.accessToken) {
      schoolsError.value = 'Usuário não autenticado. Não é possível buscar escolas.';
      isLoadingSchools.value = false;
      return;
    }

    try {
      // Endpoint para listar as escolas que o usuário pode visualizar/gerenciar
      // Adapte este endpoint conforme sua API (ex: /admin/schools, /user/schools)
      const response = await apiClient.get('/auth/me'); // Ou um endpoint mais específico como '/schools'
                                                        // Se '/auth/me' já retorna `user.schools`, usamos isso.

      // Assumindo que a resposta de /auth/me é { user: { schools: [...] } }
      // ou que você terá um endpoint /schools que retorna [{...}, {...}]
      const fetchedSchools = response.data.user?.schools || response.data || [];

      schoolsList.value = fetchedSchools;
    } catch (error: any) {
      console.error('Erro ao buscar escolas:', error);
      schoolsError.value = error.response?.data?.message || 'Falha ao carregar escolas.';
      schoolsList.value = [];
    } finally {
      isLoadingSchools.value = false;
    }
  }

  // Você adicionaria aqui ações para adicionar, editar, excluir escolas:
  async function addSchool(newSchoolData: Partial<School>): Promise<School | null> {
    isLoadingSchools.value = true;
    schoolsError.value = null;
    try {
      const response = await apiClient.post('/schools', newSchoolData); // Endpoint para criar escola
      const addedSchool = response.data;
      schoolsList.value.push(addedSchool); // Adiciona à lista local
      return addedSchool;
    } catch (error: any) {
      schoolsError.value = error.response?.data?.message || 'Falha ao adicionar escola.';
      throw error;
    } finally {
      isLoadingSchools.value = false;
    }
  }

  async function updateSchool(schoolId: string, updatedData: Partial<School>): Promise<School | null> {
    isLoadingSchools.value = true;
    schoolsError.value = null;
    try {
      const response = await apiClient.put(`/schools/${schoolId}`, updatedData); // Endpoint para atualizar escola
      const updatedSchool = response.data;
      const index = schoolsList.value.findIndex(s => s.id === schoolId);
      if (index !== -1) {
        schoolsList.value[index] = updatedSchool; // Atualiza na lista local
      }
      return updatedSchool;
    } catch (error: any) {
      schoolsError.value = error.response?.data?.message || 'Falha ao atualizar escola.';
      throw error;
    } finally {
      isLoadingSchools.value = false;
    }
  }

  async function deleteSchool(schoolId: string): Promise<boolean> {
    isLoadingSchools.value = true;
    schoolsError.value = null;
    try {
      await apiClient.delete(`/schools/${schoolId}`); // Endpoint para excluir escola
      schoolsList.value = schoolsList.value.filter(s => s.id !== schoolId); // Remove da lista local
      return true;
    } catch (error: any) {
      schoolsError.value = error.response?.data?.message || 'Falha ao excluir escola.';
      throw error;
    } finally {
      isLoadingSchools.value = false;
    }
  }

  return {
    schoolsList,
    isLoadingSchools,
    schoolsError,
    allSchools,
    hasSchools,
    fetchSchools,
    addSchool,
    updateSchool,
    deleteSchool
  };
});
