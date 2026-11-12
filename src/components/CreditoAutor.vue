<script setup lang="ts">
import { autor, redes } from "@/datos/autor";
</script>

<template>
  <footer class="flex shrink-0 flex-wrap items-center justify-center gap-x-3 gap-y-1 border-t border-base-300 bg-base-100 px-4 py-2 text-sm text-base-content/70">
    <p>Hecho por <span class="font-semibold text-base-content">{{ autor }}</span></p>
    <div class="flex items-center gap-1">
      <a
        v-if="redes.instagram"
        class="btn btn-circle btn-ghost btn-sm"
        :href="redes.instagram"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Instagram"
        title="Instagram"
      >
        <i class="fa-brands fa-instagram text-lg"></i>
      </a>
      <span v-else class="btn btn-circle btn-ghost btn-sm" aria-label="Instagram" title="Instagram">
        <i class="fa-brands fa-instagram text-lg"></i>
      </span>
      <a
        v-if="redes.facebook"
        class="btn btn-circle btn-ghost btn-sm"
        :href="redes.facebook"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        title="Facebook"
      >
        <i class="fa-brands fa-facebook text-lg"></i>
      </a>
      <span v-else class="btn btn-circle btn-ghost btn-sm" aria-label="Facebook" title="Facebook">
        <i class="fa-brands fa-facebook text-lg"></i>
      </span>
    </div>
  </footer>
</template>
