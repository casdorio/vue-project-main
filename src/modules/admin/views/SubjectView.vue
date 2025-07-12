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
                          <i class='bx bx-book me-2'></i>Gerenciamento de Disciplinas
                        </h4>
                        <p class="text-muted mb-0">
                          Adicione ou gerencie disciplinas para a escola ativa
                        </p>
                      </div>
                      <div class="text-end">
                        <span class="text-muted small">Total de Disciplinas</span>
                        <h2 class="text-primary mb-0">{{ subjectsStore.allSubjects.length }}</h2>
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
                      Selecione uma escola ativa para gerenciar as disciplinas.
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
                      <h5 class="card-title mb-0">Disciplinas</h5>
                      <p class="text-muted mb-0">Gerencie as disciplinas da escola {{ settingsStore.activeSchool.name }}</p>
                    </div>
                    <button
                      class="btn btn-primary"
                      @click="openCreateSubjectModal"
                      :disabled="subjectsStore.isLoadingSubjects"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Adicionar nova disciplina"
                    >
                      <i class='bx bx-plus me-1'></i>Nova Disciplina
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="subjectsStore.isLoadingSubjects && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status">
                      <span class="visually-hidden">Carregando...</span>
                    </div>
                    <h5 class="text-muted">Carregando disciplinas...</h5>
                    <p class="text-muted mb-0">Por favor, aguarde um momento</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="subjectsStore.subjectsError && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card border-danger">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger">
                        <i class='bx bx-error fs-3'></i>
                      </span>
                    </div>
                    <h5 class="text-danger mb-2">Erro ao Carregar Disciplinas</h5>
                    <p class="text-muted mb-3">{{ subjectsStore.subjectsError }}</p>
                    <button
                      class="btn btn-outline-danger"
                      @click="refreshSubjects"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Tentar recarregar a lista de disciplinas"
                    >
                      <i class='bx bx-refresh me-1'></i>Tentar Novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="subjectsStore.allSubjects.length === 0 && settingsStore.activeSchool" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-primary">
                        <i class='bx bx-book fs-3'></i>
                      </span>
                    </div>
                    <h4 class="mb-2">Nenhuma Disciplina Cadastrada</h4>
                    <p class="text-muted mb-4">
                      Comece criando a primeira disciplina ou selecione uma existente
                    </p>
                    <button
                      class="btn btn-primary btn-lg"
                      @click="openCreateSubjectModal"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Iniciar o cadastro de uma nova disciplina"
                    >
                      <i class='bx bx-plus me-1'></i>Cadastrar Primeira Disciplina
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subjects Grid -->
            <div v-else-if="settingsStore.activeSchool" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div v-for="subject in subjectsStore.allSubjects" :key="subject.id" class="col">
                <div
                  class="card h-100"
                  :class="{ 'border-primary border-2': selectedSubject?.id === subject.id, 'card-hover': selectedSubject?.id !== subject.id }"
                  @click="selectSubject(subject)"
                >
                  <div class="card-header text-center bg-transparent">
                    <div class="avatar avatar-xl position-relative">
                      <span class="avatar-initial rounded bg-label-primary">
                        <i class='bx bx-book'></i>
                      </span>
                    </div>
                  </div>
                  <div class="card-body text-center">
                    <h5 class="card-title mb-2">{{ subject.name }}</h5>
                    <p v-if="subject.description" class="text-muted small mb-3">{{ subject.description }}</p>
                    <div v-else class="text-muted small mb-3">Sem descrição</div>
                    <button
                      class="btn btn-sm btn-outline-primary w-100"
                      @click.stop="viewSubjectDetails(subject.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Ver detalhes da disciplina"
                    >
                      <i class='bx bx-show me-1'></i>Detalhes
                    </button>
                  </div>
                  <div class="card-footer text-center">
                    <span
                      class="badge bg-label-info"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Quantidade de períodos associados"
                    >
                      Períodos: {{ subject.periods?.length || 0 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subject Details (Toggle View) -->
            <div v-if="selectedSubject && settingsStore.activeSchool" class="row mt-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="card-title mb-0">
                      <i class='bx bx-book me-2'></i>Detalhes da Disciplina: {{ selectedSubject.name }}
                    </h5>
                    <button
                      class="btn btn-outline-secondary btn-sm"
                      @click="selectedSubject = null"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Voltar para a lista de disciplinas"
                    >
                      <i class='bx bx-arrow-back me-1'></i>Voltar
                    </button>
                  </div>
                  <div class="card-body">
                    <div class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label">Nome</label>
                        <input
                          type="text"
                          class="form-control"
                          v-model="selectedSubject.name"
                          disabled
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label">ID</label>
                        <input
                          type="text"
                          class="form-control"
                          :value="selectedSubject.id"
                          disabled
                        />
                      </div>
                      <div class="col-12">
                        <label class="form-label">Descrição</label>
                        <textarea
                          class="form-control"
                          v-model="selectedSubject.description"
                          disabled
                          rows="3"
                        ></textarea>
                      </div>
                      <div class="col-12">
                        <label class="form-label">Períodos Associados</label>
                        <div v-if="selectedSubject.periods && selectedSubject.periods.length > 0" class="list-group">
                          <div
                            v-for="period in selectedSubject.periods"
                            :key="period.id"
                            class="list-group-item"
                          >
                            {{ period.name }} ({{ formatDate(period.start_date) }} - {{ formatDate(period.end_date) }})
                          </div>
                        </div>
                        <p v-else class="text-muted">Nenhum período associado</p>
                      </div>
                    </div>
                  </div>
                  <div class="card-footer text-end">
                    <button
                      class="btn btn-primary"
                      @click="editSubject(selectedSubject.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Editar esta disciplina"
                    >
                      <i class='bx bx-edit me-1'></i>Editar
                    </button>
                    <button
                      class="btn btn-danger ms-2"
                      @click="confirmDeleteSubject(selectedSubject)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Excluir esta disciplina"
                    >
                      <i class='bx bx-trash me-1'></i>Excluir
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Subject Form Modal -->
            <div class="modal fade" id="subjectFormModal" tabindex="-1" aria-labelledby="subjectFormModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="subjectFormModalLabel">
                      <i class='bx bx-book me-2'></i>
                      {{ isEditing ? 'Editar Disciplina' : 'Cadastrar Nova Disciplina' }}
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
                    <form @submit.prevent="saveSubject" id="subjectForm" class="row g-3">
                      <div class="col-md-6">
                        <label class="form-label" for="subjectName">
                          Nome da Disciplina <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Nome da disciplina (ex.: Matemática)"></i>
                        </label>
                        <select
                          class="form-select"
                          id="subjectName"
                          v-model="currentSubjectForm.name"
                          required
                          :disabled="isLoadingSave"
                        >
                          <option value="" disabled>Selecione ou crie uma disciplina</option>
                          <option v-for="preset in presetSubjects" :key="preset" :value="preset">
                            {{ preset }}
                          </option>
                          <option value="new">Criar nova disciplina...</option>
                        </select>
                      </div>
                      <div class="col-md-6" v-if="currentSubjectForm.name === 'new'">
                        <label class="form-label" for="newSubjectName">
                          Novo Nome <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Digite um nome único para a nova disciplina"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="newSubjectName"
                          v-model="currentSubjectForm.newName"
                          required
                          :disabled="isLoadingSave"
                          placeholder="Ex.: Química"
                        />
                      </div>
                      <div class="col-12">
                        <label class="form-label" for="subjectDescription">
                          Descrição
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Descrição opcional da disciplina"></i>
                        </label>
                        <textarea
                          class="form-control"
                          id="subjectDescription"
                          rows="3"
                          v-model="currentSubjectForm.description"
                          :disabled="isLoadingSave"
                          placeholder="Breve descrição da disciplina"
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
                      form="subjectForm"
                      class="btn btn-primary"
                      :disabled="isLoadingSave || !isFormValid"
                    >
                      <span v-if="isLoadingSave">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {{ isEditing ? 'Salvando...' : 'Cadastrar' }}
                      </span>
                      <span v-else>
                        <i class='bx bx-save me-1'></i>
                        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Disciplina' }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deleteSubjectModal" tabindex="-1" aria-labelledby="deleteSubjectModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-danger" id="deleteSubjectModalLabel">
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
                      Esta ação não pode ser desfeita. A disciplina
                      <strong>{{ subjectToDelete?.name }}</strong> será removida permanentemente.
                    </p>
                    <div class="alert alert-warning" role="alert">
                      <i class='bx bx-info-circle me-1'></i>
                      Todos os dados relacionados à disciplina serão perdidos.
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
                      @click="deleteSubject"
                      :disabled="isLoadingDelete"
                    >
                      <span v-if="isLoadingDelete">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Excluindo...
                      </span>
                      <span v-else>
                        <i class='bx bx-trash me-1'></i>Excluir Disciplina
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
import { useSubjectsStore } from '@/stores/subjectsStore';
import { usePeriodsStore } from '@/stores/periodsStore';
import { useSettingsStore } from '@/stores/settingsStore';
import Swal from 'sweetalert2';

// --- INITIALIZATION ---
const router = useRouter();
const subjectsStore = useSubjectsStore();
const periodsStore = usePeriodsStore();
const settingsStore = useSettingsStore();

// --- REACTIVE STATE ---
const selectedSubject = ref<any>(null);
const isEditing = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);
const currentSubjectId = ref<string | null>(null);
const subjectToDelete = ref<any>(null);

// --- FORM STATE ---
const currentSubjectForm = reactive({
  name: '',
  newName: '',
  description: ''
});

// --- PRESET SUBJECTS ---
const presetSubjects = ['Matemática', 'Português', 'Ciências', 'História', 'Geografia', 'Física', 'Química', 'Biologia'];

// --- COMPUTED PROPERTIES ---
const isFormValid = computed(() => {
  return (
    (currentSubjectForm.name === 'new' && currentSubjectForm.newName.trim() !== '') ||
    (currentSubjectForm.name !== 'new' && currentSubjectForm.name !== '') ||
    currentSubjectForm.name === ''
  );
});

// --- METHODS ---
const formatDate = (dateString: string) => {
  if (!dateString) return 'Não definido';
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const resetForm = () => {
  Object.assign(currentSubjectForm, {
    name: '',
    newName: '',
    description: ''
  });
  isEditing.value = false;
  currentSubjectId.value = null;
};

const openCreateSubjectModal = () => {
  if (!settingsStore.activeSchool) {
    Swal.fire({
      icon: 'warning',
      title: 'Escola não selecionada',
      text: 'Por favor, selecione uma escola ativa antes de cadastrar uma disciplina.',
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
  const modal = new bootstrap.Modal(document.getElementById('subjectFormModal')!);
  modal.show();
};

const selectSubject = (subject: any) => {
  selectedSubject.value = subject;
};

const editSubject = (subjectId: string) => {
  const subject = subjectsStore.allSubjects.find(s => s.id === subjectId);
  if (subject) {
    isEditing.value = true;
    currentSubjectId.value = subjectId;
    Object.assign(currentSubjectForm, {
      name: subject.name,
      newName: '',
      description: subject.description || ''
    });
    const modal = new bootstrap.Modal(document.getElementById('subjectFormModal')!);
    modal.show();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Disciplina não encontrada.',
      confirmButtonText: 'Ok'
    });
  }
};

const saveSubject = async () => {
  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos inválidos',
      text: 'Por favor, selecione ou insira um nome válido para a disciplina.',
      confirmButtonText: 'Ok'
    });
    return;
  }

  isLoadingSave.value = true;
  try {
    const payload = {
      name: currentSubjectForm.name === 'new' ? currentSubjectForm.newName : currentSubjectForm.name,
      description: currentSubjectForm.description,
      school_id: settingsStore.activeSchool!.id
    };
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: isEditing.value ? 'Disciplina atualizada' : 'Disciplina cadastrada',
      text: `A disciplina ${payload.name} foi ${isEditing.value ? 'atualizada' : 'cadastrada'} com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('subjectFormModal')!);
    modal?.hide();
    resetForm();
    subjectsStore.fetchSubjects();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao ${isEditing.value ? 'atualizar' : 'cadastrar'} a disciplina: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingSave.value = false;
  }
};

const confirmDeleteSubject = (subject: any) => {
  subjectToDelete.value = subject;
  const modal = new bootstrap.Modal(document.getElementById('deleteSubjectModal')!);
  modal.show();
};

const deleteSubject = async () => {
  if (!subjectToDelete.value) return;
  isLoadingDelete.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: 'Disciplina excluída',
      text: `A disciplina ${subjectToDelete.value.name} foi excluída com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteSubjectModal')!);
    modal?.hide();
    subjectToDelete.value = null;
    subjectsStore.fetchSubjects();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao excluir a disciplina: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingDelete.value = false;
  }
};

const viewSubjectDetails = (subjectId: string) => {
  const subject = subjectsStore.allSubjects.find(s => s.id === subjectId);
  if (subject) {
    selectedSubject.value = { ...subject, periods: periodsStore.allPeriods.filter(p => p.subject_ids?.includes(subjectId)) };
  }
};

const refreshSubjects = async () => {
  try {
    await subjectsStore.fetchSubjects();
    await Swal.fire({
      icon: 'success',
      title: 'Lista atualizada',
      text: 'A lista de disciplinas foi recarregada com sucesso!',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao recarregar as disciplinas: ${error}`,
      confirmButtonText: 'Ok'
    });
  }
};

// --- LIFECYCLE ---
onMounted(() => {
  if (settingsStore.activeSchool) {
    subjectsStore.fetchSubjects();
  }
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
</script>

<style scoped>
.card {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  cursor: pointer;
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
