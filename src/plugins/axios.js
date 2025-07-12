// src/plugins/axios.js
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const version = 'v1';

const apiClient = axios.create({
  baseURL: `https://api.educaeinste.in/${version}`, // URL base da sua API
});

// Interceptor que adiciona o token a cada requisição
apiClient.interceptors.request.use(config => {
  const authStore = useAuthStore();
  const token = authStore.accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

apiClient.interceptors.response.use(
  (response) => {
    // Aqui você pode verificar se a API retorna um novo token em cada resposta
    // (Padrão de "Sliding Window Token")
    // Se sua API não faz isso, você pode ignorar esta parte.
    // Exemplo: if (response.data && response.data.new_access_token) {
    //   const authStore = useAuthStore();
    //   authStore.setAuth({ user: authStore.user, tokenData: response.data.new_access_token });
    // }
    return response;
  },
  async (error) => {
    const authStore = useAuthStore(); // Obtém a instância do store

    // Se o erro for 401 Unauthorized e não for da rota de login
    if (error.response && error.response.status === 401 && error.config.url !== '/auth/sign-in') {
      console.warn('Token expirado ou inválido (401 Unauthorized). Fazendo logout...');
      // Limpa a sessão
      authStore.clearAuth();
      // Redireciona para a página de login, passando a URL original como redirect
      // Evita loops de redirecionamento se já estiver no login
      if (router.currentRoute.value.name !== 'Login') {
          await router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } });
      }
    }
    return Promise.reject(error);
  }
);


export default apiClient;
