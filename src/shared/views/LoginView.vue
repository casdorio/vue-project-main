<template>
  <div class="container-xxl">
    <div class="authentication-wrapper authentication-basic container-p-y">
      <div class="authentication-inner">
        <div class="card">
          <div class="card-body">
            <div class="app-brand justify-content-center">
              <span class="app-brand-logo demo">
                <img src="/casdorio/img/favicon/logo.svg?v=1" alt="Loading" class="loading-logo">
              </span>
              <span class="app-brand-text demo text-body fw-bold">EducaEinste.in</span>
            </div>
            <h4 class="mb-2">Bem-vindo ao EducaEinstein! 👋</h4>
            <p class="mb-4">Faça login na sua conta e comece a transformar a gestão escolar!</p>

            <form @submit.prevent="handleLogin" class="mb-3">
              <div class="mb-3">
                <label for="floatingEmailInput" class="form-label">Endereço de Email</label>
                <input type="email" class="form-control" v-model="email" required />
              </div>
              <div class="mb-3 form-password-toggle">
                <div class="d-flex justify-content-between">
                  <label class="form-label" for="password">Password</label>
                  <a href="/magic-link">
                  <small>Use um Link de Login</small>
                </a>
                </div>
                <div class="input-group input-group-merge">
                  <input :type="passwordFieldType" class="form-control" v-model="password" required autocomplete="current-password"/>
                  <span class="input-group-text cursor-pointer" @click="togglePasswordVisibility">
                    <i :class="passwordIconClass"></i>
                  </span>
                </div>
              </div>
              <div class="mb-3">
                <button class="btn btn-primary d-grid w-100" type="submit" :disabled="loading">{{ loading ?
                  'Entrando...' : 'Entrar' }}</button>

              </div>
              <p v-if="error" class="text-danger text-sm mt-2 text-center">
                {{ error }}
              </p>
            </form>

            <div class="divider my-4">
              <div class="divider-text">or</div>
            </div>
            <div class="d-flex justify-content-center">
              <a href="javascript:;" class="btn btn-icon btn-label-google-plus me-3">
                <i class="tf-icons bx bxl-google-plus"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore'; // Importe o store

const authStore = useAuthStore(); // Obtenha a instância do store

const email = ref('');
const password = ref('');
const loading = ref(false);
const error = ref('');

// Lógica para toggle de senha
const showPassword = ref(false);
const passwordFieldType = computed(() => (showPassword.value ? 'text' : 'password'));
const passwordIconClass = computed(() => (showPassword.value ? 'bx bx-show' : 'bx bx-hide'));
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    // Chama a ação de login do store
    await authStore.login({ email: email.value, password: password.value });
    // A ação `login` no store já lida com o redirecionamento para /admin em caso de sucesso
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    // O erro agora vem do throw error no store, pode ser um AxiosError
    if (err.response?.data?.message) {
      error.value = err.response.data.message;
    } else {
      error.value = 'Erro ao fazer login. Verifique suas credenciais.';
    }
    console.error('Erro no componente LoginView:', err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* Importe o CSS da página de autenticação */
@import '@/shared/assets/vendor/css/pages/page-auth.css';

/* Outros estilos específicos do componente ou globais */
/* Se os ícones Boxicons (bx-hide, bx-show) não estiverem aparecendo,
   certifique-se de que o CSS do Boxicons está importado globalmente
   no seu `main.ts` ou `index.html`. */
</style>
