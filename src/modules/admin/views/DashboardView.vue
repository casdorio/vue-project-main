<template>
  <div class="content-wrapper">
    <div class="container-xxl flex-grow-1 container-p-y">
      <div class="row mb-4">
        <div class="col-12">
          <div class="card bg-menu-theme-subtle shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-auto" v-if="settingsStore.activeSchool">
                  <div class="avatar avatar-lg">
                    <img v-if="settingsStore.activeSchool.logo" :src="settingsStore.activeSchool.logo"
                      :alt="settingsStore.activeSchool.name" class="rounded" @error="handleImageError" />
                    <span v-else class="avatar-initial rounded bg-label-primary">
                      {{ getSchoolInitials(settingsStore.activeSchool.name) }}
                    </span>
                  </div>
                </div>
                <div class="col">
                  <h3 class="card-title text-primary mb-1" v-if="settingsStore.activeSchool">
                    {{ settingsStore.activeSchool.name }}
                  </h3>
                  <h3 class="card-title text-primary mb-1" v-else>
                    Bem-vindo ao EducaEinstein
                  </h3>
                  <p class="text-muted mb-0" v-if="settingsStore.activeSchool">
                    Sistema de Gestão Escolar - Painel Administrativo
                  </p>
                  <p class="text-muted mb-0" v-else>
                    Configure sua primeira escola para começar
                  </p>
                </div>
                <div class="col-auto">
                  <i class='bx bx-buildings fs-1 text-primary'></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isLoading" class="d-flex justify-content-center align-items-center"
        style="height: 50vh; width: 100%; position: absolute; top: 0; left: 0; z-index: 10;">
        <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div :class="{ 'd-none': isLoading }">
        <div v-if="!settingsStore.activeSchool" class="row mb-4">
          <div class="col-12">
            <div class="card border-warning">
              <div class="card-body text-center py-5">
                <div class="avatar avatar-xl mb-3">
                  <span class="avatar-initial rounded-circle bg-label-warning">
                    <i class='bx bx-school fs-3'></i>
                  </span>
                </div>
                <h4 class="text-warning mb-3">Configure sua Primeira Escola</h4>
                <p class="text-muted mb-4">
                  Para começar, cadastre uma escola e configure os detalhes necessários.
                </p>
                <router-link to="/admin/schools" class="btn btn-warning btn-lg" data-bs-toggle="tooltip"
                  data-bs-placement="top" title="Iniciar cadastro de uma nova escola">
                  <i class='bx bx-plus me-1'></i>Cadastrar Primeira Escola
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="row mb-4">
            <div class="col-12">
              <div class="card">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-center mb-3">
                    <h5 class="card-title mb-0">Progresso de Configuração</h5>
                    <span class="badge bg-label-primary">{{ completionPercentage }}% Concluído</span>
                  </div>
                  <div class="progress" style="height: 15px;">
                    <div class="progress-bar bg-primary" role="progressbar" :style="{ width: completionPercentage + '%' }"
                      :aria-valuenow="completionPercentage" :aria-valuemin="0" :aria-valuemax="100"></div>
                  </div>
                  <p class="text-muted small mt-2 mb-0">
                    {{ completedSteps }} de {{ totalSteps }} etapas concluídas
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4" v-if="nextSteps.length > 0">
            <div class="col-12">
              <div class="card">
                <div class="card-header bg-transparent">
                  <h5 class="card-title mb-0">
                    <i class='bx bx-list-check me-2'></i>Próximos Passos
                  </h5>
                </div>
                <div class="card-body">
                  <p class="text-muted mb-3">Complete estas etapas para finalizar a configuração:</p>
                  <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-3">
                    <div v-for="step in nextSteps" :key="step.id" class="col">
                      <div class="d-flex align-items-center">
                        <div class="avatar avatar-sm me-3">
                          <span class="avatar-initial rounded bg-label-info">
                            <i :class="step.icon"></i>
                          </span>
                        </div>
                        <div>
                          <h6 class="mb-0">{{ step.title }}</h6>
                          <small class="text-muted">{{ step.description }}</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="row mb-4">
            <div class="col-12">
              <h5 class="fw-bold">Configurações do Sistema</h5>
              <p class="text-muted">Configure cada módulo na sequência recomendada</p>
            </div>
          </div>
          <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            <div v-for="(card, index) in computedConfigCards" :key="card.id" class="col">
              <div class="card h-100 card-hover" :class="{ // Adicionado 'card-hover'
                  'border-success border-2': card.isConfigured,
                  'border-warning border-2': !card.isConfigured && card.isEnabled,
                  'opacity-75': !card.isEnabled
                }">
                <div class="card-header bg-transparent text-center">
                  <span class="badge rounded-pill position-absolute top-0 start-0 translate-middle"
                    :class="card.isConfigured ? 'bg-success' : card.isEnabled ? 'bg-warning' : 'bg-secondary'">
                    {{ index + 1 }}
                  </span>
                  <i class="position-absolute top-0 end-0 p-2"
                    :class="card.isConfigured ? 'bx bx-check-circle text-success' : card.isEnabled ? 'bx bx-time text-warning' : 'bx bx-lock text-muted'"
                    data-bs-toggle="tooltip"
                    :data-bs-title="card.isConfigured ? 'Configuração concluída' : card.isEnabled ? 'Aguardando configuração' : 'Bloqueado até concluir dependências'"></i>
                  <div class="avatar avatar-lg mx-auto mb-2">
                    <span class="avatar-initial rounded"
                      :class="card.isConfigured ? 'bg-success' : card.isEnabled ? 'bg-warning' : 'bg-secondary'">
                      <i :class="card.icon"></i>
                    </span>
                  </div>
                  <h5 class="card-title mb-0">{{ card.title }}</h5>
                </div>
                <div class="card-body text-center">
                  <span class="badge mb-3"
                    :class="card.isConfigured ? 'bg-label-success' : card.isEnabled ? 'bg-label-warning' : 'bg-label-secondary'">
                    {{ card.isConfigured ? 'Configurado' : card.isEnabled ? 'Disponível' : 'Bloqueado' }}
                  </span>
                  <p class="text-muted small mb-3">{{ card.statusText }}</p>
                  <button v-if="card.route && card.isEnabled" class="btn btn-sm"
                    :class="card.isConfigured ? 'btn-outline-success' : 'btn-warning'" @click="navigateTo(card.route)"
                    data-bs-toggle="tooltip"
                    :data-bs-title="card.isConfigured ? 'Gerenciar configurações' : 'Iniciar configuração'">
                    <i :class="card.buttonIcon" class="me-1"></i>
                    {{ card.isConfigured ? 'Gerenciar' : 'Configurar' }}
                  </button>
                  <span v-else class="text-muted small">
                    <i class='bx bx-lock me-1'></i>Aguardando dependências
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="row mt-4">
            <div class="col-12">
              <div class="card bg-light">
                <div class="card-header bg-transparent">
                  <h5 class="card-title mb-0">
                    <i class='bx bx-bulb me-2'></i>Dicas de Configuração
                  </h5>
                </div>
                <div class="card-body">
                  <div class="row row-cols-1 row-cols-md-3 g-3">
                    <div class="col">
                      <div class="d-flex align-items-start">
                        <i class='bx bx-check-circle text-success me-2 mt-1'></i>
                        <div>
                          <h6 class="mb-1">Siga a Sequência</h6>
                          <small class="text-muted">Configure os módulos na ordem recomendada para evitar
                            problemas</small>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="d-flex align-items-start">
                        <i class='bx bx-data text-info me-2 mt-1'></i>
                        <div>
                          <h6 class="mb-1">Dados Essenciais</h6>
                          <small class="text-muted">Alguns módulos dependem de outros para funcionar</small>
                        </div>
                      </div>
                    </div>
                    <div class="col">
                      <div class="d-flex align-items-start">
                        <i class='bx bx-support text-warning me-2 mt-1'></i>
                        <div>
                          <h6 class="mb-1">Precisa de Ajuda?</h6>
                          <small class="text-muted">Consulte a documentação ou entre em contato com o suporte</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useSchoolsStore } from '@/stores/schoolStore';
import { useSettingsStore } from '@/stores/settingsStore';
// Importação do SweetAlert2 removida, pois não será mais usado nesta tela.
// import Swal from 'sweetalert2';

const router = useRouter();
const authStore = useAuthStore();
const schoolsStore = useSchoolsStore();
const settingsStore = useSettingsStore();

// --- ESTADO DO LOADING ---
// Nova variável reativa para controlar a visibilidade do spinner
const isLoading = ref(true);

// --- DEFINIÇÃO DE TIPOS ---
interface ConfigItemStatus {
  unidade: boolean;
  periodo: boolean;
  disciplina: boolean;
  turma: boolean;
  professor: boolean;
  prova: boolean;
  valor: boolean;
  calendario: boolean;
}

interface ConfigCard {
  id: keyof ConfigItemStatus;
  title: string;
  icon: string;
  dependency: keyof ConfigItemStatus | null;
  textWhenIncomplete: string;
  textWhenComplete: string;
  route: string;
  buttonText: string;
  buttonIcon: string;
  description: string;
}

// --- ESTADO DOS STATUS DE CONFIGURAÇÃO ---
const configStatus = reactive<ConfigItemStatus>({
  unidade: false,
  periodo: false,
  disciplina: false,
  turma: false,
  professor: false,
  prova: false,
  valor: false,
  calendario: false,
});

// --- DADOS DOS CARDS DE CONFIGURAÇÃO ---
const configCardsData: ConfigCard[] = [
  {
    id: 'unidade',
    title: 'Detalhes da Unidade',
    icon: 'bx bx-buildings',
    dependency: null,
    textWhenIncomplete: 'Configure as informações básicas da sua unidade escolar',
    textWhenComplete: 'Informações da unidade configuradas com sucesso',
    route: '/admin/schools',
    buttonText: 'Gerenciar',
    buttonIcon: 'bx bx-cog',
    description: 'Dados básicos da escola'
  },
  {
    id: 'periodo',
    title: 'Períodos Letivos',
    icon: 'bx bx-calendar',
    dependency: 'unidade',
    textWhenIncomplete: 'Defina os períodos letivos e anos acadêmicos',
    textWhenComplete: 'Períodos letivos configurados e ativos',
    route: '/admin/academic-calendars',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-calendar-plus',
    description: 'Ano letivo e semestres'
  },
  {
    id: 'disciplina',
    title: 'Disciplinas',
    icon: 'bx bx-book',
    dependency: 'periodo',
    textWhenIncomplete: 'Cadastre as disciplinas oferecidas pela escola',
    textWhenComplete: 'Disciplinas cadastradas e organizadas',
    route: '/admin/subjects',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-book-add',
    description: 'Matérias e currículo'
  },
  {
    id: 'turma',
    title: 'Turmas',
    icon: 'bx bx-group',
    dependency: 'periodo',
    textWhenIncomplete: 'Crie as turmas e organize os estudantes',
    textWhenComplete: 'Turmas criadas e organizadas',
    route: '/admin/classrooms',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-user-plus',
    description: 'Salas de aula e séries'
  },
  {
    id: 'professor',
    title: 'Professores',
    icon: 'bx bx-user-detail',
    dependency: 'unidade',
    textWhenIncomplete: 'Cadastre a equipe de professores',
    textWhenComplete: 'Corpo docente cadastrado e ativo',
    route: '/admin/teachers',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-user-plus',
    description: 'Equipe pedagógica'
  },
  {
    id: 'prova',
    title: 'Provas',
    icon: 'bx bx-file',
    dependency: 'disciplina',
    textWhenIncomplete: 'Configure o sistema de avaliações',
    textWhenComplete: 'Sistema de provas configurado',
    route: '/admin/exams',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-file-plus',
    description: 'Avaliações e notas'
  },
  {
    id: 'valor',
    title: 'Financeiro',
    icon: 'bx bx-dollar-circle',
    dependency: 'unidade',
    textWhenIncomplete: 'Defina valores e planos de pagamento',
    textWhenComplete: 'Valores e financeiro configurados',
    route: '/admin/financial',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-money',
    description: 'Mensalidades e taxas'
  },
  {
    id: 'calendario',
    title: 'Calendário Escolar',
    icon: 'bx bx-calendar-event',
    dependency: 'periodo',
    textWhenIncomplete: 'Configure o calendário acadêmico',
    textWhenComplete: 'Calendário escolar ativo',
    route: '/admin/school-calendar',
    buttonText: 'Configurar',
    buttonIcon: 'bx bx-calendar-check',
    description: 'Eventos e feriados'
  },
];

// --- COMPUTED PROPERTIES ---
const computedConfigCards = computed(() => {
  return configCardsData.map(card => {
    const isEnabled = card.dependency === null || configStatus[card.dependency];
    const isConfigured = configStatus[card.id];
    return {
      ...card,
      isEnabled,
      isConfigured,
      statusText: isConfigured ? card.textWhenComplete : card.textWhenIncomplete,
    };
  });
});

const completedSteps = computed(() => {
  return Object.values(configStatus).filter(status => status).length;
});

const totalSteps = computed(() => {
  return Object.keys(configStatus).length;
});

const completionPercentage = computed(() => {
  return totalSteps.value > 0 ? Math.round((completedSteps.value / totalSteps.value) * 100) : 0;
});

const nextSteps = computed(() => {
  return computedConfigCards.value
    .filter(card => !card.isConfigured && card.isEnabled)
    .slice(0, 3)
    .map(card => ({
      id: card.id,
      title: card.title,
      icon: card.icon,
      description: card.description
    }));
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

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement;
  img.src = '/assets/img/avatars/placeholder.png'; // Fallback image from Sneat
};

const fetchSchoolConfigurationStatus = async () => {
  // Ativa o spinner antes de iniciar o carregamento
  isLoading.value = true;
  const activeSchoolId = settingsStore.activeSchool?.id;
  if (!activeSchoolId) {
    Object.keys(configStatus).forEach(key => configStatus[key as keyof ConfigItemStatus] = false);
    isLoading.value = false; // Desativa o spinner se não houver escola ativa
    return;
  }
  try {
    // Simula uma chamada API (manter o setTimeout para teste)
    await new Promise(resolve => setTimeout(resolve, 1500));
    configStatus.unidade = true;
    configStatus.periodo = true;
    configStatus.disciplina = false;
    configStatus.turma = false;
    configStatus.professor = true;
    configStatus.prova = false;
    configStatus.valor = false;
    configStatus.calendario = false;
    // Swal.fire removido daqui

  } catch (error) {
    // No lugar do Swal.fire de erro, você pode logar o erro ou usar um toast/notificação mais discreta
    console.error("Erro ao carregar o status de configuração:", error);
    Object.keys(configStatus).forEach(key => configStatus[key as keyof ConfigItemStatus] = false);
    configStatus.unidade = settingsStore.activeSchool ? true : false;
  } finally {
    // Desativa o spinner após a conclusão (sucesso ou erro)
    isLoading.value = false;
  }
};

const navigateTo = (path: string) => {
  router.push(path);
};

// --- WATCHERS ---
watch(() => settingsStore.activeSchool, (newSchool) => {
  if (newSchool) {
    fetchSchoolConfigurationStatus();
  } else {
    Object.keys(configStatus).forEach(key => configStatus[key as keyof ConfigItemStatus] = false);
    isLoading.value = false; // Desativa o spinner se a escola ativa mudar para nulo
  }
}, { immediate: true });

// --- LIFECYCLE ---
onMounted(() => {
  // fetchSchoolConfigurationStatus é chamado pelo watcher com `immediate: true`
  // Portanto, não precisamos chamar aqui novamente, a menos que haja outra lógica de inicialização
  // fetchSchoolConfigurationStatus(); // Removido para evitar chamada duplicada

  // Initialize Bootstrap tooltips
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
  tooltipTriggerList.forEach(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
});
</script>

<style scoped>
/* Adicionado um estilo para posicionar o spinner no centro da tela, de forma absoluta */
.content-wrapper {
  position: relative; /* Garante que o posicionamento absoluto do spinner seja relativo a este wrapper */
}

/* Estilo para escurecer ou desfocar o fundo enquanto o spinner está ativo */
.content-wrapper.loading-overlay {
  filter: blur(2px); /* Efeito de desfoque */
  pointer-events: none; /* Impede interações enquanto carrega */
}

.card {
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.bg-menu-theme-subtle {
  background-color: rgba(105, 108, 255, 0.1);
}

.avatar-lg {
  width: 3rem;
  height: 3rem;
}

.avatar-xl {
  width: 3.5rem;
  height: 3.5rem;
}

.border-success {
  border-color: #28a745 !important;
}

.border-warning {
  border-color: #ffab00 !important;
}

.progress-bar {
  background-color: #696cff;
}

/* Estilo para esconder o conteúdo quando o spinner está ativo */
.d-none {
  display: none !important;
}
</style>
