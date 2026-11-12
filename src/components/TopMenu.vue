<template>
  <header class="navbar z-30 shrink-0 border-b border-base-300 bg-base-100 px-4 md:px-6">
    <div class="flex-1 gap-3">
      <div class="avatar placeholder">
        <div class="bg-primary text-primary-content rounded-xl w-10">
          <i class="fa-solid fa-list-check text-lg"></i>
        </div>
      </div>
      <div>
        <h1 class="font-bold text-lg leading-tight">Gestor de Proyectos</h1>
        <p class="text-xs text-base-content/60 hidden sm:block">Organiza los proyectos de la carrera</p>
      </div>
    </div>
    <div class="flex flex-none items-center gap-2">
      <ThemeToggle />
      <div class="hidden sm:block text-right">
        <p class="text-sm font-semibold">{{ auth.usuario?.nombre || 'Usuario' }}</p>
        <p class="text-xs text-base-content/60">{{ auth.usuario?.email }}</p>
      </div>
      <button class="btn btn-outline btn-sm" @click="salir">
        <i class="fa-solid fa-right-from-bracket"></i><span class="hidden sm:inline">Cerrar sesión</span>
      </button>
    </div>
  </header>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import ThemeToggle from './ThemeToggle.vue'
const auth = useAuthStore()
const router = useRouter()
function salir() { auth.cerrarSesion(); router.push({ name: 'login' }) }
</script>
