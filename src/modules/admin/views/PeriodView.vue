<template>

        <div class="content-wrapper">
          <div class="container-xxl flex-grow-1 container-p-y">
            <!-- Header Card -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="card bg-menu-theme-subtle shadow-sm">
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-center">
                      <div>
                        <h4 class="card-title text-primary mb-1">
                          <i class='bx bx-calendar me-2'></i>Gerenciamento de Períodos Letivos
                        </h4>
                        <p class="text-muted mb-0">
                          Configure e gerencie os períodos letivos da escola ativa
                        </p>
                      </div>
                      <div class="text-end">
                        <span class="text-muted small">Total de Períodos</span>
                        <h2 class="text-primary mb-0">{{ periodsStore.allPeriods.length }}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- No Active School Alert -->
            <div v-if="!settingsStore.activeSchool" class="row mb-4">
              <div class="col-12">
                <div class="card border-warning">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-warning">
                        <i class='bx bx-school fs-3'></i>
                      </span>
                    </div>
                    <h4 class="text-warning mb-3">Nenhuma Escola Ativa</h4>
                    <p class="text-muted mb-4">
                      Selecione uma escola ativa para gerenciar os períodos letivos.
                    </p>
                    <router-link
                      to="/admin/schools"
                      class="btn btn-warning btn-lg"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Gerenciar escolas"
                    >
                      <i class='bx bx-buildings me-1'></i>Ir para Escolas
                    </router-link>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions Bar -->
            <div v-else class="row mb-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title mb-0">Períodos Letivos</h5>
                      <p class="text-muted mb-0">Gerencie os períodos letivos da escola {{ settingsStore.activeSchool.name }}</p>
                    </div>
                    <button
                      class="btn btn-primary"
                      @click="openCreatePeriodModal"
                      :disabled="periodsStore.isLoadingPeriods"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Adicionar novo período letivo"
                    >
                      <i class='bx bx-plus me-1'></i>Novo Período
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="periodsStore.isLoadingPeriods && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status">
                      <span class="visually-hidden">Carregando...</span>
                    </div>
                    <h5 class="text-muted">Carregando períodos...</h5>
                    <p class="text-muted mb-0">Por favor, aguarde um momento</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="periodsStore.periodsError && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card border-danger">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger">
                        <i class='bx bx-error fs-3'></i>
                      </span>
                    </div>
                    <h5 class="text-danger mb-2">Erro ao Carregar Períodos</h5>
                    <p class="text-muted mb-3">{{ periodsStore.periodsError }}</p>
                    <button
                      class="btn btn-outline-danger"
                      @click="refreshPeriods"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Tentar recarregar a lista de períodos"
                    >
                      <i class='bx bx-refresh me-1'></i>Tentar Novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="periodsStore.allPeriods.length === 0 && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-primary">
                        <i class='bx bx-calendar fs-3'></i>
                      </span>
                    </div>
                    <h4 class="mb-2">Nenhum Período Cadastrado</h4>
                    <p class="text-muted mb-4">
                      Comece criando o primeiro período letivo para a escola
                    </p>
                    <button
                      class="btn btn-primary btn-lg"
                      @click="openCreatePeriodModal"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Iniciar o cadastro de um novo período"
                    >
                      <i class='bx bx-plus me-1'></i>Cadastrar Primeiro Período
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Periods Grid -->
            <div v-else-if="settingsStore.activeSchool" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div v-for="period in periodsStore.allPeriods" :key="period.id" class="col">
                <div
                  class="card h-100"
                  :class="{
                    'border-primary border-2': settingsStore.activePeriod?.id === period.id,
                    'card-hover': settingsStore.activePeriod?.id !== period.id
                  }"
                >
                  <!-- Period Header -->
                  <div class="card-header text-center bg-transparent">
                    <div class="avatar avatar-xl position-relative">
                      <span class="avatar-initial rounded bg-label-primary">
                        <i class='bx bx-calendar'></i>
                      </span>
                      <span
                        v-if="settingsStore.activePeriod?.id === period.id"
                        class="badge rounded-pill bg-success position-absolute top-0 end-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Período ativo"
                      >
                        Ativo
                      </span>
                    </div>
                  </div>

                  <!-- Period Info -->
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <h5 class="card-title mb-1">{{ period.name }}</h5>
                      <span
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Mais opções"
                      >
                        <button
                          class="btn btn-icon btn-outline-secondary"
                          type="button"
                          :id="`periodOptions-${period.id}`"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <i class='bx bx-dots-vertical-rounded'></i>
                        </button>
                      </span>
                      <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="`periodOptions-${period.id}`">
                        <li>
                          <button
                            class="dropdown-item"
                            @click="setActivePeriod(period)"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Definir este período como ativo"
                          >
                            <i class='bx bx-check-circle me-2'></i>Tornar Ativo
                          </button>
                        </li>
                        <li>
                          <button
                            class="dropdown-item"
                            @click="editPeriod(period.id)"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Editar informações do período"
                          >
                            <i class='bx bx-edit me-2'></i>Editar
                          </button>
                        </li>
                        <li><hr class="dropdown-divider" /></li>
                        <li>
                          <button
                            class="dropdown-item text-danger"
                            @click="confirmDeletePeriod(period)"
                            data-bs-toggle="tooltip"
                            data-bs-placement="left"
                            title="Excluir este período permanentemente"
                          >
                            <i class='bx bx-trash me-2'></i>Excluir
                          </button>
                        </li>
                      </ul>
                    </div>
                    <p class="text-muted small mb-2">
                      <i class='bx bx-calendar-check me-1'></i>Início: {{ formatDate(period.start_date) }}
                    </p>
                    <p class="text-muted small mb-2">
                      <i class='bx bx-calendar-x me-1'></i>Fim: {{ formatDate(period.end_date) }}
                    </p>
                    <p v-if="period.description" class="text-muted small mb-3">
                      <i class='bx bx-info-circle me-1'></i>{{ period.description }}
                    </p>
                    <div class="bg-light rounded p-2 text-center">
                      <small class="text-muted">ID do Período</small>
                      <div class="fw-bold text-primary">{{ period.id }}</div>
                    </div>
                  </div>
                  <div class="card-footer text-center">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="viewPeriodDetails(period.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Ver mais detalhes do período"
                    >
                      <i class='bx bx-show me-1'></i>Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Period Form Modal -->
            <div class="modal fade" id="periodFormModal" tabindex="-1" aria-labelledby="periodFormModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="periodFormModalLabel">
                      <i class='bx bx-calendar me-2'></i>
                      {{ isEditing ? 'Editar Período Letivo' : 'Cadastrar Novo Período' }}
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      :disabled="isLoadingSave"
                    ></button>
                  </div>
                  <div class="modal-body">
                    <form @submit.prevent="savePeriod" id="periodForm" class="row g-3">
                      <div class="col-md-12">
                        <label class="form-label" for="periodName">
                          Nome do Período <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Nome descritivo do período (ex.: 2025 - 1º Semestre)"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="periodName"
                          v-model="currentPeriodForm.name"
                          required
                          :disabled="isLoadingSave"
                          placeholder="Ex.: 2025 - 1º Semestre"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="startDate">
                          Data de Início <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Data de início do período letivo"></i>
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          id="startDate"
                          v-model="currentPeriodForm.start_date"
                          required
                          :disabled="isLoadingSave"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="endDate">
                          Data de Término <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Data de término do período letivo"></i>
                        </label>
                        <input
                          type="date"
                          class="form-control"
                          id="endDate"
                          v-model="currentPeriodForm.end_date"
                          required
                          :disabled="isLoadingSave"
                        />
                      </div>
                      <div class="col-12">
                        <label class="form-label" for="periodDescription">
                          Descrição
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Descrição opcional do período letivo"></i>
                        </label>
                        <textarea
                          class="form-control"
                          id="periodDescription"
                          rows="3"
                          v-model="currentPeriodForm.description"
                          :disabled="isLoadingSave"
                          placeholder="Breve descrição do período"
                        ></textarea>
                      </div>
                    </form>
                    <div v-if="isLoadingSave" class="overlay">
                      <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">{{ isEditing ? 'Salvando...' : 'Cadastrando...' }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                      :disabled="isLoadingSave"
                    >
                      <i class='bx bx-x me-1'></i>Cancelar
                    </button>
                    <button
                      type="submit"
                      form="periodForm"
                      class="btn btn-primary"
                      :disabled="isLoadingSave || !isFormValid"
                    >
                      <span v-if="isLoadingSave">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {{ isEditing ? 'Salvando...' : 'Cadastrando...' }}
                      </span>
                      <span v-else>
                        <i class='bx bx-save me-1'></i>
                        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Período' }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deletePeriodModal" tabindex="-1" aria-labelledby="deletePeriodModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-danger" id="deletePeriodModalLabel">
                      <i class='bx bx-trash me-2'></i>Confirmar Exclusão
                    </h5>
                    <button
                      type="button"
                      class="btn-close"
                      data-bs-dismiss="modal"
                      aria-label="Close"
                      :disabled="isLoadingDelete"
                    ></button>
                  </div>
                  <div class="modal-body text-center">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger">
                        <i class='bx bx-trash fs-3'></i>
                      </span>
                    </div>
                    <h4 class="mb-2">Tem certeza?</h4>
                    <p class="text-muted mb-4">
                      Esta ação não pode ser desfeita. O período
                      <strong>{{ periodToDelete?.name }}</strong> será removido permanentemente.
                    </p>
                    <div class="alert alert-warning" role="alert">
                      <i class='bx bx-info-circle me-1'></i>
                      Todos os dados relacionados ao período serão perdidos.
                    </div>
                  </div>
                  <div class="modal-footer">
                    <button
                      type="button"
                      class="btn btn-outline-secondary"
                      data-bs-dismiss="modal"
                      :disabled="isLoadingDelete"
                    >
                      <i class='bx bx-x me-1'></i>Cancelar
                    </button>
                    <button
                      type="button"
                      class="btn btn-danger"
                      @click="deletePeriod"
                      :disabled="isLoadingDelete"
                    >
                      <span v-if="isLoadingDelete">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Excluindo...
                      </span>
                      <span v-else>
                        <i class='bx bx-trash me-1'></i>Excluir Período
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePeriodsStore } from '@/stores/periodsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import Swal from 'sweetalert2';

// --- INITIALIZATION ---
const router = useRouter();
const periodsStore = usePeriodsStore();
const settingsStore = useSettingsStore();

// --- REACTIVE STATE ---
const isEditing = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);
const currentPeriodId = ref<string | null>(null);
const periodToDelete = ref<any>(null);

// --- FORM STATE ---
const currentPeriodForm = reactive({
  name: '',
  start_date: '',
  end_date: '',
  description: ''
});

// --- COMPUTED PROPERTIES ---
const isFormValid = computed(() => {
  return (
    currentPeriodForm.name.trim() !== '' &&
    currentPeriodForm.start_date !== '' &&
    currentPeriodForm.end_date !== '' &&
    new Date(currentPeriodForm.start_date) <= new Date(currentPeriodForm.end_date)
  );
});

// --- METHODS ---
const formatDate = (dateString: string) => {
  if (!dateString) return 'Não definido';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const resetForm = () => {
  Object.assign(currentPeriodForm, {
    name: '',
    start_date: '',
    end_date: '',
    description: ''
  });
  isEditing.value = false;
  currentPeriodId.value = null;
};

const openCreatePeriodModal = () => {
  if (!settingsStore.activeSchool) {
    Swal.fire({
      icon: 'warning',
      title: 'Escola não selecionada',
      text: 'Por favor, selecione uma escola ativa antes de cadastrar um período.',
      confirmButtonText: 'Ir para Escolas',
      showCancelButton: true,
      cancelButtonText: 'Fechar'
    }).then((result) => {
      if (result.isConfirmed) {
        router.push('/admin/schools');
      }
    });
    return;
  }
  resetForm();
  const modal = new bootstrap.Modal(document.getElementById('periodFormModal')!);
  modal.show();
};

const editPeriod = (periodId: string) => {
  const period = periodsStore.allPeriods.find(p => p.id === periodId);
  if (period) {
    isEditing.value = true;
    currentPeriodId.value = periodId;
    Object.assign(currentPeriodForm, {
      name: period.name || '',
      start_date: period.start_date || '',
      end_date: period.end_date || '',
      description: period.description || ''
    });
    const modal = new bootstrap.Modal(document.getElementById('periodFormModal')!);
    modal.show();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Período não encontrado.',
      confirmButtonText: 'Ok'
    });
  }
};

const savePeriod = async () => {
  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos inválidos',
      text: 'Por favor, preencha todos os campos obrigatórios e verifique se a data de início é anterior à data de término.',
      confirmButtonText: 'Ok'
    });
    return;
  }

  isLoadingSave.value = true;
  try {
    // Replace with actual API call
    const payload = {
      ...currentPeriodForm,
      school_id: settingsStore.activeSchool!.id
    };
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: isEditing.value ? 'Período atualizado' : 'Período cadastrado',
      text: `O período ${currentPeriodForm.name} foi ${isEditing.value ? 'atualizado' : 'cadastrado'} com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('periodFormModal')!);
    modal?.hide();
    resetForm();
    periodsStore.fetchPeriods(); // Refresh periods list
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao ${isEditing.value ? 'atualizar' : 'cadastrar'} o período: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingSave.value = false;
  }
};

const confirmDeletePeriod = (period: any) => {
  periodToDelete.value = period;
  const modal = new bootstrap.Modal(document.getElementById('deletePeriodModal')!);
  modal.show();
};

const deletePeriod = async () => {
  if (!periodToDelete.value) return;
  isLoadingDelete.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: 'Período excluído',
      text: `O período ${periodToDelete.value.name} foi excluído com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('deletePeriodModal')!);
    modal?.hide();
    periodToDelete.value = null;
    periodsStore.fetchPeriods(); // Refresh periods list
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao excluir o período: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingDelete.value = false;
  }
};

const setActivePeriod = async (period: any) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    settingsStore.setActivePeriod(period); // Update Pinia store
    await Swal.fire({
      icon: 'success',
      title: 'Período ativado',
      text: `O período ${period.name} foi definido como ativo!`,
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao ativar o período: ${error}`,
      confirmButtonText: 'Ok'
    });
  }
};

const viewPeriodDetails = (periodId: string) => {
  router.push(`/admin/periods/${periodId}`);
};

const refreshPeriods = async () => {
  try {
    await periodsStore.fetchPeriods();
    await Swal.fire({
      icon: 'success',
      title: 'Lista atualizada',
      text: 'A lista de períodos foi recarregada com sucesso!',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao recarregar os períodos: ${error}`,
      confirmButtonText: 'Ok'
    });
  }
};

// --- LIFECYCLE ---
onMounted(() => {
  if (settingsStore.activeSchool) {
    periodsStore.fetchPeriods();
  }
  // Initialize Bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.border-primary {
  border-color: #696cff !important;
}

.bg-menu-theme-subtle {
  background-color: rgba(105, 108, 255, 0.1);
}

.avatar-xl {
  width: 3.5rem;
  height: 3.5rem;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.btn-icon i {
  vertical-align: middle;
}
</style>
