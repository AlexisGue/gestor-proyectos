<template>
  <main data-theme="light" class="relative flex h-dvh flex-col overflow-hidden bg-base-200 text-base-content">
    <div class="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl"></div>
    <div class="pointer-events-none absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-secondary/20 blur-3xl"></div>

    <div class="relative flex min-h-0 flex-1 items-center justify-center p-4">
      <div class="card w-full max-w-md border border-base-300 bg-base-100/90 shadow-2xl backdrop-blur">
        <div class="card-body gap-3 p-6">
          <div class="flex flex-col items-center text-center">
            <div class="mb-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-content shadow-lg shadow-primary/30">
              <i class="fa-solid fa-layer-group text-2xl"></i>
            </div>
            <h1 class="text-2xl font-bold">Gestor de Proyectos</h1>
            <p class="mt-1 text-sm text-base-content/60">
              {{
                modo === "login"
                  ? "Entra para ver tus trabajos de la carrera"
                  : "Crea tu cuenta para empezar"
              }}
            </p>
          </div>

          <div role="tablist" class="tabs tabs-boxed bg-base-200">
            <button
              type="button"
              role="tab"
              class="tab flex-1"
              :class="{ 'tab-active': modo === 'login' }"
              @click="cambiarModo('login')"
            >
              Iniciar sesión
            </button>
            <button
              type="button"
              role="tab"
              class="tab flex-1"
              :class="{ 'tab-active': modo === 'registro' }"
              @click="cambiarModo('registro')"
            >
              Registro
            </button>
          </div>

          <div v-if="auth.error" class="alert alert-error text-sm">
            <i class="fa-solid fa-circle-exclamation"></i>
            <span>{{ auth.error }}</span>
          </div>

          <form v-if="modo === 'login'" class="space-y-3" @submit.prevent="entrar">
            <label class="form-control">
              <span class="label-text mb-1 font-medium">Correo electrónico</span>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fa-solid fa-envelope text-base-content/40"></i>
                <input
                  v-model.trim="email"
                  type="email"
                  class="grow"
                  placeholder="tu@correo.com"
                  autocomplete="username"
                  required
                />
              </label>
            </label>
            <label class="form-control">
              <span class="label-text mb-1 font-medium">Contraseña</span>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fa-solid fa-lock text-base-content/40"></i>
                <input
                  v-model="password"
                  type="password"
                  class="grow"
                  placeholder="Tu contraseña"
                  autocomplete="current-password"
                  required
                />
              </label>
            </label>
            <button class="btn btn-primary mt-2 w-full" type="submit" :disabled="auth.cargando">
              <span v-if="auth.cargando" class="loading loading-spinner"></span>
              <i v-else class="fa-solid fa-right-to-bracket"></i>
              Iniciar sesión
            </button>
          </form>

          <form v-else class="space-y-3" @submit.prevent="registrar">
            <label class="form-control">
              <span class="label-text mb-1 font-medium">Nombre</span>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fa-solid fa-user text-base-content/40"></i>
                <input
                  v-model.trim="nombre"
                  type="text"
                  class="grow"
                  placeholder="Tu nombre"
                  autocomplete="name"
                  required
                />
              </label>
            </label>
            <label class="form-control">
              <span class="label-text mb-1 font-medium">Correo electrónico</span>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fa-solid fa-envelope text-base-content/40"></i>
                <input
                  v-model.trim="emailRegistro"
                  type="email"
                  class="grow"
                  placeholder="correo@ejemplo.com"
                  autocomplete="email"
                  required
                />
              </label>
            </label>
            <label class="form-control">
              <span class="label-text mb-1 font-medium">Contraseña</span>
              <label class="input input-bordered flex items-center gap-2">
                <i class="fa-solid fa-lock text-base-content/40"></i>
                <input
                  v-model="passwordRegistro"
                  type="password"
                  class="grow"
                  placeholder="Mínimo 6 caracteres"
                  autocomplete="new-password"
                  minlength="6"
                  required
                />
              </label>
            </label>
            <button class="btn btn-primary mt-2 w-full" type="submit" :disabled="auth.cargando">
              <span v-if="auth.cargando" class="loading loading-spinner"></span>
              <i v-else class="fa-solid fa-user-plus"></i>
              Crear cuenta
            </button>
          </form>
        </div>
      </div>
    </div>
    <CreditoAutor />
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import { pintarTema } from "@/composables/tema";
import CreditoAutor from "@/components/CreditoAutor.vue";

pintarTema("light");

const auth = useAuthStore();
const router = useRouter();

const modo = ref<"login" | "registro">("login");
const email = ref("");
const password = ref("");
const nombre = ref("");
const emailRegistro = ref("");
const passwordRegistro = ref("");

function cambiarModo(nuevo: "login" | "registro") {
  modo.value = nuevo;
  auth.error = "";
}

async function entrar() {
  if (await auth.iniciar(email.value, password.value)) {
    router.replace({ name: "home-projects" });
  }
}

async function registrar() {
  if (
    await auth.registrar(
      nombre.value,
      emailRegistro.value,
      passwordRegistro.value,
    )
  ) {
    router.replace({ name: "home-projects" });
  }
}
</script>
