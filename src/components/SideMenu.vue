<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProyectoStore } from "@/stores/proyecto";

const store = useProyectoStore();
const route = useRoute();
const router = useRouter();

onMounted(async () => {
  if (!store.proyectos.length) {
    await store.obtenerProyectos();
  }
});

function estado(valor: string) {
  if (valor === "en_proceso") return "En proceso";
  if (valor === "completado") return "Completado";
  return "Pendiente";
}

function colorEstado(valor: string) {
  if (valor === "completado") return "badge-success";
  if (valor === "en_proceso") return "badge-info";
  return "badge-warning";
}
</script>

<template>
  <aside
    class="hidden h-full min-h-0 w-72 min-w-[18rem] max-w-[18rem] shrink-0 overflow-x-hidden overflow-y-auto border-r border-base-300 bg-base-100 md:flex md:flex-col"
  >
    <div class="w-full min-w-0 p-3">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-lg font-bold">Proyectos</h2>

        <span class="badge badge-primary">
          {{ store.totalProyectos }}
        </span>
      </div>

      <button
        class="btn btn-ghost btn-sm mb-2 w-full justify-start"
        :class="{ 'btn-active': route.name === 'home-projects' }"
        @click="router.push({ name: 'home-projects' })"
      >
        <i class="fa-solid fa-table-list"></i>
        Ver tabla general
      </button>

      <div class="divider my-1 text-xs font-semibold">MIS PROYECTOS</div>

      <div v-if="store.cargando" class="flex justify-center p-5">
        <span class="loading loading-spinner text-primary"></span>
      </div>

      <div v-else-if="store.error" class="alert alert-error text-xs">
        {{ store.error }}
      </div>

      <div
        v-else-if="!store.proyectos.length"
        class="text-sm text-base-content/50 p-3"
      >
        No hay proyectos registrados.
      </div>

      <ul v-else class="flex w-full min-w-0 flex-col gap-2">
        <li v-for="p in store.proyectos" :key="p._id" class="w-full min-w-0">
          <button
            class="w-full rounded-xl bg-base-200 p-3 text-left transition hover:bg-base-300"
            @click="router.push({ name: 'home-projects' })"
          >
            <span class="block text-sm font-semibold leading-snug">
              {{ p.nombre }}
            </span>
            <span class="mt-1 block text-xs leading-snug text-base-content/60">
              {{ p.materia }}
              <template v-if="p.anio"> · {{ p.anio }}</template>
            </span>
            <span class="badge badge-sm mt-2" :class="colorEstado(p.estado)">
              {{ estado(p.estado) }}
            </span>
          </button>
        </li>
      </ul>
    </div>
  </aside>
</template>
