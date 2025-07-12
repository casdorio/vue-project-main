import { createApp } from 'vue'
import { createPinia } from 'pinia'
import VueTippy from 'vue-tippy';
import App from './App.vue'
import router from '@/router'
import { useAuthStore } from '@/stores/authStore';
// Ícones (se iconify-icons não estiver em outro CSS já importado)
import '@/shared/assets/vendor/fonts/iconify-icons.css';
import '@/shared/assets/vendor/fonts/flag-icons.css';
// Se usar Boxicons para os ícones "bx bx-hide", adicione:
// import 'https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css';



// Vendors CSS
import '@/shared/assets/vendor/libs/pickr/pickr-themes.css';
import '@/shared/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.css';
import '@/shared/assets/vendor/libs/apex-charts/apex-charts.css';

// CSS de páginas específicas (se quiser que seja global para todas as páginas)
// Se for só para Login, é melhor no LoginView.vue como discutimos.
// import '/assets/vendor/css/pages/page-auth.css';


// --- Importação de JavaScript do Template ---
// ATENÇÃO: Carregar scripts de templates assim pode gerar conflitos com o Vue.js.
// Monitore o console do navegador para erros e observe o comportamento da UI.
// A ordem é CRÍTICA, baseada nas dependências do seu template.

// Helpers e Config



// Bibliotecas Core JS
import $ from 'jquery';
(window as typeof window & { jQuery: typeof $ }).jQuery = $; // Anexa jQuery ao escopo global
(window as typeof window & { $: typeof $ }).$ = $;


import * as bootstrap from 'bootstrap'; // Import Bootstrap as a module
(window as typeof window & { bootstrap: typeof bootstrap }).bootstrap = bootstrap; // EXPOSE BOOTSTRAP GLOBALLY

// Outras bibliotecas de vendors
import '@/shared/assets/vendor/libs/@algolia/autocomplete-js.js';
import '@/shared/assets/vendor/libs/pickr/pickr.js';
import '@/shared/assets/vendor/libs/perfect-scrollbar/perfect-scrollbar.js';
import '@/shared/assets/vendor/libs/hammer/hammer.js';
import '@/shared/assets/vendor/libs/i18n/i18n.js';
import '@/shared/assets/vendor/libs/apex-charts/apexcharts.js';


// Scripts de funcionalidade de UI (menu, autenticação)
// Estes são os mais propensos a causar problemas, pois interagem diretamente com o DOM.
// RECOMENDAÇÃO: Refatorar a lógica para Vue nativo em seus componentes (AdminSidebar, LoginView).
import '@/shared/assets/vendor/js/menu.js';
// Se pages-auth.js é crucial e não pode ser refatorado para o LoginView ainda:
// import '/assets/js/pages-auth.js';
// OBS: Para pages-auth.js, a melhor prática é manter no LoginView.vue (com refatoração da lógica)
// ou carregá-lo condicionalmente nesse componente específico.

const app = createApp(App)

app.use(createPinia())

const authStore = useAuthStore();

// 3. Chame restoreSession APÓS o Pinia ser inicializado e o store ser obtido
// Isso fará com que a lógica de restauração da sessão seja executada no carregamento do aplicativo.
authStore.restoreSession();
app.use(VueTippy);
app.use(router)

app.mount('#app')
