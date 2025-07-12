<template>
  <div class="layout-wrapper layout-content-navbar">
    <div class="layout-container">
      <Sidebar :menu="userStore.menu" />
      <div class="menu-mobile-toggler d-xl-none rounded-1">
        <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large text-bg-secondary p-2 rounded-1">
          <i class="bx bx-menu icon-base"></i>
          <i class="bx bx-chevron-right icon-base"></i>
        </a>
      </div>
      <div class="layout-page">
        <Navbar />
        <div class="content-wrapper">
          <router-view/>
          <Footer></Footer>
          <div class="content-backdrop fade"></div>
        </div>
      </div>
    </div>
    <div class="layout-overlay layout-menu-toggle"></div>
    <div class="drag-target"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUserStore } from '@/stores/userStore'
import Sidebar from '@/shared/components/sidebar/Sidebar.vue'
import Navbar from '@/shared/components/navbar/Navbar.vue'
import Footer from '@/shared/components/footer/Footer.vue'

const userStore = useUserStore()

const loadScript = (src: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
};
onMounted(async () => {
  try {
    await loadScript('/assets/vendor/js/menu.js');
    await loadScript('/assets/js/main.js');
    console.log('AdminLayout: Scripts externos carregados.');
  } catch (error) {
    console.error('Erro ao carregar scripts externos:', error);
  }
});
</script>
