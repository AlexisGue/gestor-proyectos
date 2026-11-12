<template>
  <div class="flex h-dvh flex-col overflow-hidden bg-base-200 text-base-content">
    <TopMenu />
    <div class="flex flex-1 min-h-0">
      <SideMenu />
      <main class="min-h-0 min-w-0 flex-1 overflow-y-auto p-4">
        <div class="mx-auto w-full max-w-[1500px]">
          <router-view />
        </div>
      </main>
    </div>
    <FooterMenu />
  </div>
</template>
<script setup lang="ts">
import TopMenu from './components/TopMenu.vue'
import SideMenu from './components/SideMenu.vue'
import FooterMenu from './components/FooterMenu.vue'
import { aplicarTemaGuardado } from '@/composables/tema'

aplicarTemaGuardado()
</script>
