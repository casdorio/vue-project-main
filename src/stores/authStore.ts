/* eslint-disable @typescript-eslint/no-explicit-any */
// src/stores/authStore.js

import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import router from '@/router' // Importamos o router PRINCIPAL
import apiClient from '@/plugins/axios' // Nosso plugin do Axios
import { useSchoolsStore } from './schoolStore'

// --- Interfaces para Tipagem ---
export interface School {
  id: string
  name: string
  cnpj: string
  subdomain: string
  [key: string]: any
}

interface User {
  id: number
  name: string
  email: string
  schools: School[]
  roles?: string[] // Simulação de roles para verificação de admin
  [key: string]: any
}

// --- Variáveis Globais para o Timeout ---
const IDLE_TIMEOUT_MS = 30 * 60 * 1000 // 30 minutos
let idleTimer: ReturnType<typeof setTimeout> | null = null
const resetIdleTimerEvents = ['mousemove', 'keydown', 'click', 'scroll']

export const useAuthStore = defineStore('auth', () => {
  const isSessionLoading = ref(true)
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const user = ref<User | null>(null)

  // === GETTERS ===
  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const userName = computed(() => user.value?.name || 'Visitante')
  const isAdmin = computed(() => user.value?.roles?.includes('admin') || false)

  // === ACTIONS ===

  function startIdleTimer() {
    clearIdleTimer()
    idleTimer = setTimeout(() => {
      console.warn('Sessão expirada por inatividade.')
      logout()
    }, IDLE_TIMEOUT_MS)
  }

  function clearIdleTimer() {
    if (idleTimer) {
      clearTimeout(idleTimer)
      idleTimer = null
    }
  }

  function setupActivityListeners() {
    // Adiciona listeners APENAS se não estiverem configurados.
    // Usamos uma flag no `window` ou `document.body` para isso.
    if (!window.__authActivityListenersSetup__) {
      resetIdleTimerEvents.forEach((event) => {
        document.addEventListener(event, startIdleTimer)
      })
      window.__authActivityListenersSetup__ = true
    }
  }

  function removeActivityListeners() {
    resetIdleTimerEvents.forEach((event) => {
      document.removeEventListener(event, startIdleTimer)
    })
    clearIdleTimer()
    delete window.__authActivityListenersSetup__ // Remove a flag
  }

  /**
   * Define os dados de autenticação no estado (memória) e o token no localStorage.
   */
  function setAuth({ user: userData, tokenData }: { user: User; tokenData: string }) {
    const schoolStore = useSchoolsStore()
    // Simulação de role. Idealmente, viria da API ou seria um claim do JWT.
    const userWithRoles = { ...userData, roles: userData.roles || ['admin'] }
    user.value = userWithRoles
    accessToken.value = tokenData
    localStorage.setItem('access_token', tokenData)
    startIdleTimer()
    setupActivityListeners()
  }

  /**
   * Limpa os dados de autenticação da memória e do localStorage.
   * Garante que todo o estado de autenticação seja resetado.
   */
  function clearAuth() {
    user.value = null
    accessToken.value = null

    localStorage.removeItem('access_token')
    removeActivityListeners() // Remove listeners e limpa o timer
  }

  /**
   * Ação principal de login.
   */
  async function login(credentials: { email: string; password: string }): Promise<boolean> {
    try {
      const response = await apiClient.post('/auth/sign-in', credentials)
      const { user: userData, access_token } = response.data

      if (userData && access_token) {
        setAuth({ user: userData, tokenData: access_token })
        await router.push('/admin') // Redireciona para o dashboard
      }
      return true
    } catch (error) {
      clearAuth() // Garante limpeza em caso de falha no login
      console.error('Erro no login:', error)
      throw error // Propaga o erro para o componente
    }
  }

  /**
   * Ação de logout.
   */
  async function logout() {
    try {
      await apiClient.post('/auth/sign-out')
    } catch (error) {
      console.warn('Erro ao fazer logout na API (pode ser token expirado):', error)
    }
    clearAuth() // Sempre limpa o estado local e localStorage
    await router.push('/login') // Sempre redireciona para login
  }

  /**
   * Tenta restaurar a sessão do usuário ao carregar o aplicativo.
   * Isso é executado uma vez na inicialização do aplicativo em `main.ts`.
   * ESTA FUNÇÃO É O CORAÇÃO DA CONSISTÊNCIA.
   */
  async function restoreSession(): Promise<void> {
    // isSessionLoading.value = true; // Já está true na inicialização, mas pode ser redundante aqui se for a única instância

    const storedToken = localStorage.getItem('access_token')

    try {
      // Adicione um try/catch abrangente aqui para o caso de erros inesperados
      if (!storedToken) {
        if (user.value || accessToken.value) {
          console.log(
            'Estado do Pinia inconsistente com localStorage (sem token). Forçando limpeza.',
          )
          clearAuth()
        } else {
          console.log('Nenhum token encontrado no localStorage. Estado limpo.')
        }
        return // Sai da função, isSessionLoading permanece como TRUE por enquanto, mas será FALSE no finally
      }

      if (!user.value) {
        console.log('Token encontrado no localStorage. Tentando buscar dados do usuário...')
        try {
          // Try/catch para a chamada API
          const response = await apiClient.get('/auth/me')

          const userData = response.data.user

          if (userData && userData.id) {
            setAuth({ user: userData, tokenData: storedToken })
            console.log('Sessão restaurada com sucesso.')

            const redirectUrl = new URL(window.location.href).searchParams.get('redirect')
            if (redirectUrl && redirectUrl !== router.currentRoute.value.fullPath) {
              // Evita redirecionar para a mesma página
              await router.push(redirectUrl)
            } else if (router.currentRoute.value.name === 'Login' && isAuthenticated.value) {
              // Se estava na tela de login mas está logado
              await router.push('/admin') // Vai para o dashboard
            } else if (!isAuthenticated.value) {
              // Se por algum motivo não autenticou (apesar de ter token)
              await router.push('/login')
            }
            // Se já está na rota correta e logado, não faz nada (next() será chamado depois)
          } else {
            throw new Error('Dados de usuário inválidos ou incompletos ao restaurar sessão.')
          }
        } catch (error) {
          console.error(
            'Falha ao restaurar sessão (token inválido/expirado ou erro na API):',
            error,
          )
          clearAuth() // Limpa tudo
          // Redireciona para login explicitamente se a restauração falhar.
          // O router guard ainda vai agir, mas isso força o fluxo.
          await router.push('/login')
        }
      } else {
        console.log('Sessão já ativa e token presente. Garantindo timer de inatividade.')
        startIdleTimer()
        setupActivityListeners()
      }
    } catch (unexpectedError) {
      // Captura qualquer erro não tratado nas lógicas acima
      console.error('Erro inesperado durante restoreSession:', unexpectedError)
      clearAuth()
      await router.push('/login')
    } finally {
      isSessionLoading.value = false // GARANTE que isSessionLoading seja FALSE no final
      console.log('restoreSession finalizada. isSessionLoading:', isSessionLoading.value)
    }
  }

  return {
    user,
    accessToken,
    isAuthenticated,
    isSessionLoading,
    userName,
    isAdmin,
    login,
    logout,
    restoreSession,
    clearAuth,
  }
})
