<template>
  <li :class="['menu-item', { active: isActive, open: isOpen }]">
    <!-- LINK NORMAL -->
    <router-link v-if="item.to" :to="item.to" class="menu-link">
      <i v-if="item.icon" :class="['menu-icon tf-icons', item.icon]"></i>
      <div>{{ item.label }}</div>
    </router-link>

    <!-- MENU COM SUBITENS -->
    <a v-else href="javascript:;" class="menu-link menu-toggle" @click="toggleOpen">
      <i v-if="item.icon" :class="['menu-icon tf-icons', item.icon]"></i>
      <div>{{ item.label }}</div>
    </a>

    <!-- SUBMENU -->
    <ul v-if="item.children?.length" class="menu-sub">
      <SidebarMenuItem v-for="child in item.children" :key="child.name" :item="child" />
    </ul>
  </li>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

type SidebarMenuItemType = {
  name: string
  label: string
  icon?: string
  to?: string
  children?: SidebarMenuItemType[]
}

const props = defineProps<{
  item: SidebarMenuItemType
}>()

const route = useRoute()
const isOpen = ref(false)

const normalizePath = (path: string) => path.replace(/\/+$/, '') // remove barra no final

const matchesRoute = (item: SidebarMenuItemType): boolean => {
  if (item.to) {
    const currentPath = normalizePath(route.path)
    const targetPath = normalizePath(item.to)

    const isExactMatch = currentPath === targetPath

    // Ignora o targetPath se for prefixo parcial (ex: /admin não deve dar match com /admin/schools)
    const isSubrouteMatch =
      currentPath.startsWith(targetPath + '/') && targetPath !== '/admin'

    const matched = isExactMatch || isSubrouteMatch

    if (matched) {

      return true
    }
  }

  // Verifica os filhos recursivamente
  if (item.children) {
    return item.children.some((child) => matchesRoute(child))
  }

  return false
}






// Define se está ativo (para classe .active)
const isActive = computed(() => matchesRoute(props.item))

// Abre o menu automaticamente se a URL bater com esse item
watch(
  () => route.path,
  () => {
    isOpen.value = matchesRoute(props.item)
  },
  { immediate: true }
)

const toggleOpen = () => {
  isOpen.value = !isOpen.value
}
</script>
