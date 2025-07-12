import { defineStore } from 'pinia'

export type Perfil = 'admin' | 'professor' | 'secretaria' | 'responsavel' | 'aluno'

interface MenuItem {
  name: string
  label: string
  to?: string
  icon?: string
  active?: boolean
  children?: MenuItem[]
}

export const useUserStore = defineStore('user', {
  state: () => ({
    perfil: 'admin' as Perfil,
    // Outros dados do usuário podem ser adicionados aqui
  }),
  getters: {
    menu(state): MenuItem[] {
      switch (state.perfil) {
        case 'admin':
          return [
            {
              name: 'dashboard',
              label: 'Dashboard',
              to: '/admin',
              icon: 'bx bx-home-smile',
            },
            {
              name: 'escolas',
              label: 'Escolas',
              to: '/admin/schools',
              icon: 'bx bx-buildings',
            },
            {
              name: 'periodos-letivos',
              label: 'Período Letivo',
              to: '/admin/period-lectives',
              icon: 'bx bx-calendar',
            },
            {
              name: 'disciplinas',
              label: 'Disciplinas',
              to: '/admin/subjects',
              icon: 'bx bx-book-alt',
            },
            {
              name: 'provas',
              label: 'Provas',
              to: '/admin/tests',
              icon: 'bx bx-book-alt',
            },
            {
              name: 'turmas',
              label: 'Turmas',
              to: '/admin/classes',
              icon: 'bx bx-group',
            },
            {
              name: 'professores',
              label: 'Professores',
              to: '/admin/teachers',
              icon: 'bx bx-user-pin',
            },
            {
              name: 'calendario-escolar',
              label: 'Calendário Escolar',
              to: '/admin/school-calendar',
              icon: 'bx bx-calendar',
             },
            // {
            //   name: 'usuarios',
            //   label: 'Usuários',
            //   icon: 'bx bx-user',
            //   children: [
            //     { name: 'admins', label: 'Administradores', to: '/admin/usuarios/admins' },
            //     { name: 'professores', label: 'Professores', to: '/admin/usuarios/professores' },
            //     { name: 'secretarias', label: 'Secretarias', to: '/admin/usuarios/secretarias' },
            //   ],
            // },
            // Adicione outros itens do menu admin aqui
          ]
        // Adicione outros perfis aqui
        default:
          return []
      }
    },
  },
})
