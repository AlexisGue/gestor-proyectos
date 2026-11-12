<script setup lang="ts">
import { ref } from "vue";
import { alternarTema, type Tema } from "@/composables/tema";

const tema = ref<Tema>(
  document.documentElement.dataset.theme === "dark" ? "dark" : "light",
);

function cambiar() {
  alternarTema();
  tema.value = tema.value === "dark" ? "light" : "dark";
}
</script>

<template>
  <button
    type="button"
    class="btn btn-circle border border-base-300 bg-base-100 text-base-content shadow-md hover:border-primary hover:bg-base-200"
    :aria-label="tema === 'dark' ? 'Usar modo claro' : 'Usar modo oscuro'"
    :title="tema === 'dark' ? 'Modo claro' : 'Modo oscuro'"
    @click="cambiar"
  >
    <i class="fa-solid text-lg" :class="tema === 'dark' ? 'fa-sun' : 'fa-moon'"></i>
  </button>
</template>
