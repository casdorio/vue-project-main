<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <aside id="layout-menu" class="layout-menu menu-vertical menu">
    <div class="app-brand demo">
      <a href="/" class="app-brand-link">
        <span class="app-brand-logo me-2">
          <img src="/casdorio/img/favicon/logo.svg?v=1" alt="Loading" class="loading-logo w-px-34">
        </span>
        <span class="app-brand-text text-body fw-bold">EducaEinste.in</span>
      </a>
      <a href="javascript:void(0);" class="layout-menu-toggle menu-link text-large ms-auto">
        <i class="icon-base bx bx-chevron-left"></i>
      </a>
    </div>
    <div class="menu-inner-shadow"></div>
    <ul class="menu-inner py-1">
      <li class="menu-header small">
        <span class="menu-header-text">GESTÃO ESCOLAR</span>
      </li>
      <SidebarMenuItem v-for="item in menu" :key="item.name" :item="item" />
    </ul>
  </aside>
</template>

<script setup lang="ts">
// eslint-disable vue/multi-word-component-names

import { defineProps } from 'vue'
import SidebarMenuItem from './SidebarMenuItem.vue'

// Define o tipo do item do menu (exemplo)
interface MenuItem {
  name: string
  label: string
  icon?: string
  to?: string
  children?: MenuItem[]
}

// Tipagem correta da prop
defineProps<{
  menu: MenuItem[]
}>()
</script>


<style scoped>
.a {
  fill: #109886
}

.b {
  fill: #f47a5a
}

.c {
  fill: #2d5ea6
}
</style>
