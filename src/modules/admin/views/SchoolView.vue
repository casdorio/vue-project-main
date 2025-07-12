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
                          <i class='bx bx-buildings me-2'></i>Gerenciamento de Escolas
                        </h4>
                        <p class="text-muted mb-0">
                          Configure e gerencie as unidades de ensino do sistema
                        </p>
                      </div>
                      <div class="text-end">
                        <span class="text-muted small">Total de Escolas</span>
                        <h2 class="text-primary mb-0">{{ schoolsStore.allSchools.length }}</h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Actions Bar -->
            <div class="row mb-4">
              <div class="col-12">
                <div class="card">
                  <div class="card-body d-flex justify-content-between align-items-center">
                    <div>
                      <h5 class="card-title mb-0">Suas Escolas</h5>
                      <p class="text-muted mb-0">Gerencie todas as unidades cadastradas</p>
                    </div>
                    <button
                      class="btn btn-primary"
                      @click="openCreateSchoolModal"
                      :disabled="schoolsStore.isLoadingSchools"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Adicionar nova escola ao sistema"
                    >
                      <i class='bx bx-plus me-1'></i>Nova Escola
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Loading State -->
            <div v-if="schoolsStore.isLoadingSchools" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="spinner-border text-primary mb-3" role="status">
                      <span class="visually-hidden">Carregando...</span>
                    </div>
                    <h5 class="text-muted">Carregando escolas...</h5>
                    <p class="text-muted mb-0">Por favor, aguarde um momento</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Error State -->
            <div v-else-if="schoolsStore.schoolsError" class="row">
              <div class="col-12">
                <div class="card border-danger">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-danger">
                        <i class='bx bx-error fs-3'></i>
                      </span>
                    </div>
                    <h5 class="text-danger mb-2">Erro ao Carregar Escolas</h5>
                    <p class="text-muted mb-3">{{ schoolsStore.schoolsError }}</p>
                    <button
                      class="btn btn-outline-danger"
                      @click="refreshSchools"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Tentar recarregar a lista de escolas"
                    >
                      <i class='bx bx-refresh me-1'></i>Tentar Novamente
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Empty State -->
            <div v-else-if="schoolsStore.allSchools.length === 0" class="row">
              <div class="col-12">
                <div class="card">
                  <div class="card-body text-center py-5">
                    <div class="avatar avatar-xl mb-3">
                      <span class="avatar-initial rounded-circle bg-label-primary">
                        <i class='bx bx-buildings fs-3'></i>
                      </span>
                    </div>
                    <h4 class="mb-2">Nenhuma Escola Cadastrada</h4>
                    <p class="text-muted mb-4">
                      Comece criando sua primeira unidade de ensino
                    </p>
                    <button
                      class="btn btn-primary btn-lg"
                      @click="openCreateSchoolModal"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Iniciar o cadastro de uma nova escola"
                    >
                      <i class='bx bx-plus me-1'></i>Cadastrar Primeira Escola
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Schools Grid -->
            <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div v-for="school in schoolsStore.allSchools" :key="school.id" class="col">
                <div
                  class="card h-100"
                  :class="{
                    'border-primary border-2': settingsStore.activeSchool?.id === school.id,
                    'card-hover': settingsStore.activeSchool?.id !== school.id
                  }"
                >
                  <!-- School Logo -->
                  <div class="card-header text-center bg-transparent">
                    <div class="avatar avatar-xl position-relative">
                      <img
                        v-if="school.logo_path"
                        :src="school.logo_path"
                        :alt="school.name"
                        class="rounded"
                        @error="handleImageError"
                      />
                      <span v-else class="avatar-initial rounded bg-label-primary">
                        {{ getSchoolInitials(school.name) }}
                      </span>
                      <span
                        v-if="settingsStore.activeSchool?.id === school.id"
                        class="badge rounded-pill bg-success position-absolute top-0 end-0"
                        data-bs-toggle="tooltip"
                        data-bs-placement="top"
                        title="Escola ativa"
                      >
                        Ativa
                      </span>
                    </div>
                  </div>

                  <!-- School Info -->
                  <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                      <div>
                        <h5 class="card-title mb-1">{{ school.name }}</h5>
                        <p class="text-muted small mb-0">{{ school.legal_name }}</p>
                      </div>
                      <div class="dropdown">
                        <button
                          class="btn btn-icon btn-outline-secondary"
                          type="button"
                          :id="`schoolOptions-${school.id}`"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                          data-bs-placement="top"
                          title="Mais opções"
                        >
                          <i class='bx bx-dots-vertical-rounded'></i>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end" :aria-labelledby="`schoolOptions-${school.id}`">
                          <li>
                            <button
                              class="dropdown-item"
                              @click="setActiveSchool(school)"
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              title="Definir esta escola como ativa"
                            >
                              <i class='bx bx-check-circle me-2'></i>Tornar Ativa
                            </button>
                          </li>
                          <li>
                            <button
                              class="dropdown-item"
                              @click="editSchool(school.id)"
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              title="Editar informações da escola"
                            >
                              <i class='bx bx-edit me-2'></i>Editar
                            </button>
                          </li>
                          <li><hr class="dropdown-divider" /></li>
                          <li>
                            <button
                              class="dropdown-item text-danger"
                              @click="confirmDeleteSchool(school)"
                              data-bs-toggle="tooltip"
                              data-bs-placement="left"
                              title="Excluir esta escola permanentemente"
                            >
                              <i class='bx bx-trash me-2'></i>Excluir
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <p class="text-muted small mb-2">
                      <i class='bx bx-id-card me-1'></i>{{ school.cnpj || 'CNPJ não informado' }}
                    </p>
                    <p class="text-muted small mb-2">
                      <i class='bx bx-envelope me-1'></i>{{ school.email || 'Email não informado' }}
                    </p>
                    <p v-if="school.phone" class="text-muted small mb-2">
                      <i class='bx bx-phone me-1'></i>{{ school.phone }}
                    </p>
                    <p v-if="school.address" class="text-muted small mb-2">
                      <i class='bx bx-map me-1'></i>{{ school.address }}
                    </p>
                    <div class="mb-3">
                      <span class="badge bg-label-info">
                        {{ school.school_type?.name || 'Tipo não definido' }}
                      </span>
                    </div>
                    <div class="bg-light rounded p-2 text-center">
                      <small class="text-muted">Subdomínio</small>
                      <div class="fw-bold text-primary">{{ school.subdomain }}.edu.br</div>
                    </div>
                  </div>
                  <div class="card-footer text-center">
                    <button
                      class="btn btn-sm btn-outline-primary"
                      @click="viewSchoolDetails(school.id)"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                      title="Ver mais detalhes da escola"
                    >
                      <i class='bx bx-show me-1'></i>Detalhes
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- School Form Modal -->
            <div class="modal fade" id="schoolFormModal" tabindex="-1" aria-labelledby="schoolFormModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-lg">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title" id="schoolFormModalLabel">
                      <i class='bx bx-buildings me-2'></i>
                      {{ isEditing ? 'Editar Escola' : 'Cadastrar Nova Escola' }}
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
                    <form @submit.prevent="saveSchool" id="schoolForm" class="row g-3">
                      <div class="col-md-8">
                        <label class="form-label" for="schoolName">
                          Nome da Escola <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Nome fantasia da instituição"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="schoolName"
                          v-model="currentSchoolForm.name"
                          required
                          :disabled="isLoadingSave"
                          placeholder="Nome da instituição"
                        />
                      </div>
                      <div class="col-md-4">
                        <label class="form-label" for="schoolTypeId">
                          Tipo de Escola
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Selecione o nível de ensino principal"></i>
                        </label>
                        <select
                          class="form-select"
                          id="schoolTypeId"
                          v-model="currentSchoolForm.school_type_id"
                          :disabled="isLoadingSave"
                        >
                          <option value="">Selecione o tipo</option>
                          <option v-for="type in schoolTypes" :key="type.id" :value="type.id">
                            {{ type.name }}
                          </option>
                        </select>
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="schoolLegalName">
                          Razão Social <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Nome registrado oficialmente"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="schoolLegalName"
                          v-model="currentSchoolForm.legal_name"
                          required
                          :disabled="isLoadingSave"
                          placeholder="Razão social da empresa"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="schoolCnpj">
                          CNPJ <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Cadastro Nacional de Pessoa Jurídica"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="schoolCnpj"
                          v-model="currentSchoolForm.cnpj"
                          required
                          :disabled="isLoadingSave"
                          placeholder="00.000.000/0000-00"
                          @input="formatCNPJ"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="schoolEmail">
                          Email <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Email principal para contato"></i>
                        </label>
                        <input
                          type="email"
                          class="form-control"
                          id="schoolEmail"
                          v-model="currentSchoolForm.email"
                          required
                          :disabled="isLoadingSave"
                          placeholder="contato@escola.com"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="schoolPhone">
                          Telefone
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Telefone de contato da escola"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="schoolPhone"
                          v-model="currentSchoolForm.phone"
                          :disabled="isLoadingSave"
                          placeholder="(00) 00000-0000"
                          @input="formatPhone"
                        />
                      </div>
                      <div class="col-12">
                        <label class="form-label" for="schoolAddress">
                          Endereço
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Endereço completo da instituição"></i>
                        </label>
                        <input
                          type="text"
                          class="form-control"
                          id="schoolAddress"
                          v-model="currentSchoolForm.address"
                          :disabled="isLoadingSave"
                          placeholder="Endereço completo"
                        />
                      </div>
                      <div class="col-md-6">
                        <label class="form-label" for="schoolSubdomain">
                          Subdomínio <span class="text-danger">*</span>
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Subdomínio para acesso ao sistema"></i>
                        </label>
                        <div class="input-group">
                          <input
                            type="text"
                            class="form-control"
                            id="schoolSubdomain"
                            v-model="currentSchoolForm.subdomain"
                            required
                            :disabled="isLoadingSave"
                            placeholder="minhaescola"
                            @input="formatSubdomain"
                          />
                          <span class="input-group-text">.edu.br</span>
                        </div>
                        <small class="form-text">Apenas letras, números e hífens</small>
                      </div>
                      <div class="col-12">
                        <label class="form-label" for="schoolDescription">
                          Descrição
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Breve descrição da escola"></i>
                        </label>
                        <textarea
                          class="form-control"
                          id="schoolDescription"
                          rows="3"
                          v-model="currentSchoolForm.description"
                          :disabled="isLoadingSave"
                          placeholder="Breve descrição da escola"
                        ></textarea>
                      </div>
                      <div class="col-12">
                        <label class="form-label" for="schoolLogo">
                          Logo da Escola
                          <i class='bx bx-info-circle ms-1' data-bs-toggle="tooltip" title="Imagem representativa da escola (máx. 2MB)"></i>
                        </label>
                        <input
                          type="file"
                          class="form-control"
                          id="schoolLogo"
                          accept="image/*"
                          :disabled="isLoadingSave"
                          @change="handleLogoUpload"
                        />
                        <small class="form-text">Formatos aceitos: JPG, PNG, GIF (máx. 2MB)</small>
                      </div>
                      <div class="col-12" v-if="logoPreview">
                        <img :src="logoPreview" alt="Preview" class="img-fluid rounded" style="max-height: 100px;" />
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
                      form="schoolForm"
                      class="btn btn-primary"
                      :disabled="isLoadingSave || !isFormValid"
                    >
                      <span v-if="isLoadingSave">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        {{ isEditing ? 'Salvando...' : 'Cadastrando...' }}
                      </span>
                      <span v-else>
                        <i class='bx bx-save me-1'></i>
                        {{ isEditing ? 'Salvar Alterações' : 'Cadastrar Escola' }}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delete Confirmation Modal -->
            <div class="modal fade" id="deleteSchoolModal" tabindex="-1" aria-labelledby="deleteSchoolModalLabel" aria-hidden="true">
              <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                  <div class="modal-header">
                    <h5 class="modal-title text-danger" id="deleteSchoolModalLabel">
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
                      Esta ação não pode ser desfeita. A escola
                      <strong>{{ schoolToDelete?.name }}</strong> será removida permanentemente.
                    </p>
                    <div class="alert alert-warning" role="alert">
                      <i class='bx bx-info-circle me-1'></i>
                      Todos os dados relacionados à escola serão perdidos.
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
                      @click="deleteSchool"
                      :disabled="isLoadingDelete"
                    >
                      <span v-if="isLoadingDelete">
                        <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Excluindo...
                      </span>
                      <span v-else>
                        <i class='bx bx-trash me-1'></i>Excluir Escola
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
import { useSchoolsStore } from '@/stores/schoolStore';
import { useSettingsStore } from '@/stores/settingsStore';
import Swal from 'sweetalert2';

const router = useRouter();
const schoolsStore = useSchoolsStore();
const settingsStore = useSettingsStore();

// --- REACTIVE STATE ---
const isEditing = ref(false);
const isLoadingSave = ref(false);
const isLoadingDelete = ref(false);
const currentSchoolId = ref<number | null>(null);
const schoolToDelete = ref<any>(null);
const logoPreview = ref<string | null>(null);

// Mock data for school types
const schoolTypes = ref([
  { id: 1, name: 'Educação Infantil' },
  { id: 2, name: 'Ensino Fundamental' },
  { id: 3, name: 'Ensino Médio' },
  { id: 4, name: 'Ensino Superior' },
  { id: 5, name: 'Técnico' },
  { id: 6, name: 'Curso Livre' }
]);

// --- FORM STATE ---
const currentSchoolForm = reactive({
  name: '',
  legal_name: '',
  cnpj: '',
  email: '',
  phone: '',
  address: '',
  subdomain: '',
  description: '',
  school_type_id: '',
  logo_path: ''
});

// --- COMPUTED PROPERTIES ---
const isFormValid = computed(() => {
  return (
    currentSchoolForm.name.trim() !== '' &&
    currentSchoolForm.legal_name.trim() !== '' &&
    currentSchoolForm.cnpj.trim() !== '' &&
    currentSchoolForm.email.trim() !== '' &&
    currentSchoolForm.subdomain.trim() !== ''
  );
});

// --- METHODS ---
const getSchoolInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const formatCNPJ = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length > 14) value = value.slice(0, 14);
  value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
  currentSchoolForm.cnpj = value;
};

const formatPhone = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.replace(/\D/g, '');
  if (value.length > 11) value = value.slice(0, 11);
  if (value.length <= 10) {
    value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
  } else {
    value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  currentSchoolForm.phone = value;
};

const formatSubdomain = (event: Event) => {
  const input = event.target as HTMLInputElement;
  let value = input.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
  currentSchoolForm.subdomain = value;
};

const handleLogoUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    if (file.size > 2 * 1024 * 1024) {
      Swal.fire({
        icon: 'error',
        title: 'Arquivo muito grande',
        text: 'O arquivo deve ter no máximo 2MB.',
        confirmButtonText: 'Ok'
      });
      input.value = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      logoPreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/img/avatars/placeholder.png'; // Fallback image from Sneat
};

const resetForm = () => {
  Object.assign(currentSchoolForm, {
    name: '',
    legal_name: '',
    cnpj: '',
    email: '',
    phone: '',
    address: '',
    subdomain: '',
    description: '',
    school_type_id: '',
    logo_path: ''
  });
  logoPreview.value = null;
  isEditing.value = false;
  currentSchoolId.value = null;
};

const openCreateSchoolModal = () => {
  resetForm();
  const modal = new bootstrap.Modal(document.getElementById('schoolFormModal')!);
  modal.show();
};

const editSchool = (schoolId: number) => {
  const school = schoolsStore.allSchools.find(s => s.id === schoolId);
  if (school) {
    isEditing.value = true;
    currentSchoolId.value = schoolId;
    Object.assign(currentSchoolForm, {
      name: school.name || '',
      legal_name: school.legal_name || '',
      cnpj: school.cnpj || '',
      email: school.email || '',
      phone: school.phone || '',
      address: school.address || '',
      subdomain: school.subdomain || '',
      description: school.description || '',
      school_type_id: school.school_type_id || '',
      logo_path: school.logo_path || ''
    });
    logoPreview.value = school.logo_path || null;
    const modal = new bootstrap.Modal(document.getElementById('schoolFormModal')!);
    modal.show();
  } else {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: 'Escola não encontrada.',
      confirmButtonText: 'Ok'
    });
  }
};

const saveSchool = async () => {
  if (!isFormValid.value) {
    Swal.fire({
      icon: 'warning',
      title: 'Campos obrigatórios',
      text: 'Por favor, preencha todos os campos obrigatórios.',
      confirmButtonText: 'Ok'
    });
    return;
  }

  isLoadingSave.value = true;
  try {
    // Replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: isEditing.value ? 'Escola atualizada' : 'Escola cadastrada',
      text: `A escola ${currentSchoolForm.name} foi ${isEditing.value ? 'atualizada' : 'cadastrada'} com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('schoolFormModal')!);
    modal?.hide();
    resetForm();
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao ${isEditing.value ? 'atualizar' : 'cadastrar'} a escola: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingSave.value = false;
  }
};

const confirmDeleteSchool = (school: any) => {
  schoolToDelete.value = school;
  const modal = new bootstrap.Modal(document.getElementById('deleteSchoolModal')!);
  modal.show();
};

const deleteSchool = async () => {
  if (!schoolToDelete.value) return;
  isLoadingDelete.value = true;
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: 'Escola excluída',
      text: `A escola ${schoolToDelete.value.name} foi excluída com sucesso!`,
      timer: 1500,
      showConfirmButton: false
    });
    const modal = bootstrap.Modal.getInstance(document.getElementById('deleteSchoolModal')!);
    modal?.hide();
    schoolToDelete.value = null;
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao excluir a escola: ${error}`,
      confirmButtonText: 'Ok'
    });
  } finally {
    isLoadingDelete.value = false;
  }
};

const setActiveSchool = async (school: any) => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1000));
    settingsStore.setActiveSchool(school); // Update Pinia store
    await Swal.fire({
      icon: 'success',
      title: 'Escola ativada',
      text: `A escola ${school.name} foi definida como ativa!`,
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao ativar a escola: ${error}`,
      confirmButtonText: 'Ok'
    });
  }
};

const viewSchoolDetails = (schoolId: number) => {
  router.push(`/admin/schools/${schoolId}`);
};

const refreshSchools = async () => {
  try {
    await new Promise(resolve => setTimeout(resolve, 1500));
    await Swal.fire({
      icon: 'success',
      title: 'Lista atualizada',
      text: 'A lista de escolas foi recarregada com sucesso!',
      timer: 1500,
      showConfirmButton: false
    });
  } catch (error) {
    Swal.fire({
      icon: 'error',
      title: 'Erro',
      text: `Ocorreu um erro ao recarregar as escolas: ${error}`,
      confirmButtonText: 'Ok'
    });
  }
};

// --- LIFECYCLE ---
onMounted(() => {
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
