<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, reactive, ref } from "vue";
import { useProyectoStore } from "@/stores/proyecto";
import type { Proyecto, DatosProyecto } from "@/services/proyectoService";

const store = useProyectoStore();

const pagina = ref(1);
const porPagina = 5;
const modal = ref(false);
const modalEstado = ref(false);
const editando = ref(false);
const idEditando = ref("");
const idEstado = ref("");
const nombreEstado = ref("");
const estadoSeleccionado = ref<Proyecto["estado"]>("pendiente");
const aviso = ref("");
const tipoAviso = ref<"success" | "error">("success");

const portadaPreview = ref("/portada-default.svg");
const archivoPortada = ref<File | null>(null);

const form = reactive({
  nombre: "",
  materia: "",
  docente: "",
  anio: "" as number | "",
});

const paginas = computed(() =>
  Math.max(1, Math.ceil(store.proyectos.length / porPagina)),
);

const proyectosPagina = computed(() =>
  store.proyectos.slice(
    (pagina.value - 1) * porPagina,
    pagina.value * porPagina,
  ),
);

const desde = computed(() =>
  store.proyectos.length ? (pagina.value - 1) * porPagina + 1 : 0,
);

const hasta = computed(() =>
  Math.min(pagina.value * porPagina, store.proyectos.length),
);

onMounted(() => store.obtenerProyectos());

onBeforeUnmount(() => {
  liberarVistaPrevia();
});

function liberarVistaPrevia() {
  if (portadaPreview.value.startsWith("blob:")) {
    URL.revokeObjectURL(portadaPreview.value);
  }
}

function limpiarFormulario() {
  liberarVistaPrevia();

  Object.assign(form, {
    nombre: "",
    materia: "",
    docente: "",
    anio: "",
  });

  archivoPortada.value = null;
  portadaPreview.value = "/portada-default.svg";
}

function abrirNuevo() {
  limpiarFormulario();
  editando.value = false;
  idEditando.value = "";
  aviso.value = "";
  modal.value = true;
}

function abrirEditar(p: Proyecto) {
  limpiarFormulario();

  editando.value = true;
  idEditando.value = p._id;

  Object.assign(form, {
    nombre: p.nombre,
    materia: p.materia || "",
    docente: p.docente || "",
    anio: p.anio || "",
  });

  portadaPreview.value = p.portada || "/portada-default.svg";
  modal.value = true;
}

function seleccionarPortada(event: Event) {
  const input = event.target as HTMLInputElement;
  const archivo = input.files?.[0];

  if (!archivo) return;

  const tiposPermitidos = ["image/jpeg", "image/png", "image/webp"];

  if (!tiposPermitidos.includes(archivo.type)) {
    aviso.value = "Selecciona una imagen JPG, PNG o WEBP.";
    tipoAviso.value = "error";
    input.value = "";
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    aviso.value = "La imagen no puede superar los 5 MB.";
    tipoAviso.value = "error";
    input.value = "";
    return;
  }

  liberarVistaPrevia();

  archivoPortada.value = archivo;
  portadaPreview.value = URL.createObjectURL(archivo);

  aviso.value = "";
}

async function guardar() {
  const datos: DatosProyecto = {
    nombre: form.nombre,
    materia: form.materia,
    docente: form.docente,
    anio: Number(form.anio),
    portada: archivoPortada.value,
  };

  const ok = editando.value
    ? await store.editarProyecto(idEditando.value, datos)
    : await store.crearProyecto(datos);

  if (ok) {
    modal.value = false;
    limpiarFormulario();
    aviso.value = editando.value
      ? "Proyecto actualizado correctamente."
      : "Proyecto creado correctamente.";
    tipoAviso.value = "success";

    if (pagina.value > paginas.value) {
      pagina.value = paginas.value;
    }
  } else {
    aviso.value = store.error || "No se pudo guardar el proyecto.";
    tipoAviso.value = "error";
  }
}

function abrirEstado(p: Proyecto) {
  idEstado.value = p._id;
  nombreEstado.value = p.nombre;
  estadoSeleccionado.value = p.estado;
  modalEstado.value = true;
}

async function guardarEstado() {
  const ok = await store.cambiarEstado(idEstado.value, estadoSeleccionado.value);

  if (ok) {
    modalEstado.value = false;
    aviso.value = "Estado actualizado correctamente.";
    tipoAviso.value = "success";
  } else {
    aviso.value = store.error || "No se pudo actualizar el estado.";
    tipoAviso.value = "error";
  }
}

async function eliminar(p: Proyecto) {
  if (!window.confirm(`¿Eliminar el proyecto "${p.nombre}"?`)) {
    return;
  }

  const ok = await store.borrarProyecto(p._id);

  aviso.value = ok
    ? "Proyecto eliminado correctamente."
    : store.error || "No se pudo eliminar el proyecto.";

  tipoAviso.value = ok ? "success" : "error";

  if (pagina.value > paginas.value) {
    pagina.value = paginas.value;
  }
}

function estado(e: Proyecto["estado"]) {
  return e === "completado"
    ? "badge-success"
    : e === "en_proceso"
      ? "badge-info"
      : "badge-warning";
}

function portadaProyecto(p: Proyecto) {
  return p.portada || "/portada-default.svg";
}
</script>

<template>
  <section class="space-y-3">
    <!-- Encabezado -->
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 class="text-xl font-bold">Listado de Proyectos</h2>
        <p class="mt-0.5 text-sm text-base-content/60">
          Administra los proyectos de la carrera.
        </p>
      </div>

      <button class="btn btn-primary" @click="abrirNuevo">
        <i class="fa-solid fa-plus"></i>
        Nuevo proyecto
      </button>
    </div>

    <!-- Mensajes -->
    <div
      v-if="aviso"
      class="alert"
      :class="tipoAviso === 'success' ? 'alert-success' : 'alert-error'"
    >
      {{ aviso }}

      <button class="btn btn-ghost btn-xs ml-auto" @click="aviso = ''">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <!-- Estadísticas -->
    <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
      <div class="rounded-xl bg-base-100 px-4 py-2 shadow">
        <p class="text-xs text-base-content/60">Total proyectos</p>
        <p class="text-2xl font-bold leading-tight text-primary">{{ store.totalProyectos }}</p>
      </div>
      <div class="rounded-xl bg-base-100 px-4 py-2 shadow">
        <p class="text-xs text-base-content/60">Pendientes</p>
        <p class="text-2xl font-bold leading-tight text-warning">{{ store.proyectosPendientes }}</p>
      </div>
      <div class="rounded-xl bg-base-100 px-4 py-2 shadow">
        <p class="text-xs text-base-content/60">En proceso</p>
        <p class="text-2xl font-bold leading-tight text-info">{{ store.proyectosEnProceso }}</p>
      </div>
      <div class="rounded-xl bg-base-100 px-4 py-2 shadow">
        <p class="text-xs text-base-content/60">Completados</p>
        <p class="text-2xl font-bold leading-tight text-success">{{ store.proyectosCompletados }}</p>
      </div>
    </div>

    <!-- Tabla de proyectos -->
    <div class="card bg-base-100 border border-base-300 shadow-sm">
      <div class="border-b border-base-300 px-4 py-2">
        <h3 class="font-bold">Proyectos registrados</h3>
      </div>

      <div v-if="store.cargando" class="p-10 text-center">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="store.error" class="alert alert-error m-4">
        {{ store.error }}

        <button class="btn btn-sm" @click="store.obtenerProyectos()">
          Reintentar
        </button>
      </div>

      <div
        v-else-if="!store.proyectos.length"
        class="p-12 text-center text-base-content/60"
      >
        <i class="fa-solid fa-folder-open text-4xl"></i>
        <p class="mt-3">Todavía no hay proyectos.</p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="table table-sm table-zebra">
          <thead>
            <tr>
              <th class="w-16">ID</th>
              <th>Proyecto</th>
              <th>Materia</th>
              <th>Año en que se cursó</th>
              <th>Docente</th>
              <th>Estado</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(p, i) in proyectosPagina" :key="p._id">
              <td>{{ (pagina - 1) * porPagina + i + 1 }}</td>

              <td class="min-w-56">
                <div class="flex items-center gap-3">
                  <img
                    :src="portadaProyecto(p)"
                    :alt="`Portada de ${p.nombre}`"
                    class="h-10 w-10 rounded-lg border border-base-300 object-cover"
                  />

                  <span class="font-semibold">
                    {{ p.nombre }}
                  </span>
                </div>
              </td>

              <td>{{ p.materia || "No especificada" }}</td>

              <td>{{ p.anio || "—" }}</td>

              <td>{{ p.docente || "No especificado" }}</td>

              <td>
                <span class="badge" :class="estado(p.estado)">
                  {{
                    p.estado === "en_proceso"
                      ? "En proceso"
                      : p.estado === "completado"
                        ? "Completado"
                        : "Pendiente"
                  }}
                </span>
              </td>

              <td>
                <div class="flex justify-center gap-1">
                  <button
                    class="btn btn-outline btn-success btn-xs"
                    title="Actualizar estado"
                    @click="abrirEstado(p)"
                  >
                    <i class="fa-solid fa-flag"></i>
                    Estado
                  </button>

                  <button
                    class="btn btn-outline btn-warning btn-xs"
                    title="Editar proyecto"
                    @click="abrirEditar(p)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    class="btn btn-outline btn-error btn-xs"
                    title="Eliminar proyecto"
                    @click="eliminar(p)"
                  >
                    <i class="fa-solid fa-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Paginación -->
      <div
        v-if="store.proyectos.length"
        class="flex flex-wrap items-center justify-between gap-2 border-t border-base-300 px-4 py-2"
      >
        <span class="text-sm text-base-content/60">
          Mostrando {{ desde }}–{{ hasta }} de
          {{ store.proyectos.length }} proyectos
        </span>

        <div class="join">
          <button
            class="join-item btn btn-sm"
            :disabled="pagina === 1"
            @click="pagina--"
          >
            «
          </button>

          <button
            v-for="n in paginas"
            :key="n"
            class="join-item btn btn-sm"
            :class="{ 'btn-active': pagina === n }"
            @click="pagina = n"
          >
            {{ n }}
          </button>

          <button
            class="join-item btn btn-sm"
            :disabled="pagina === paginas"
            @click="pagina++"
          >
            »
          </button>
        </div>
      </div>
    </div>

    <dialog class="modal" :class="{ 'modal-open': modalEstado }">
      <div class="modal-box">
        <h3 class="font-bold text-lg mb-1">Actualizar estado</h3>
        <p class="text-sm text-base-content/70 mb-4">{{ nombreEstado }}</p>

        <label class="form-control">
          <span class="label-text mb-1">Estado</span>
          <select v-model="estadoSeleccionado" class="select select-bordered w-full">
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En proceso</option>
            <option value="completado">Completado</option>
          </select>
        </label>

        <div class="modal-action">
          <button type="button" class="btn btn-ghost" @click="modalEstado = false">
            Cancelar
          </button>
          <button type="button" class="btn btn-primary" @click="guardarEstado">
            Guardar estado
          </button>
        </div>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button type="button" @click="modalEstado = false">Cerrar</button>
      </form>
    </dialog>

    <!-- Modal de registro y edición -->
    <dialog class="modal" :class="{ 'modal-open': modal }">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">
          {{ editando ? "Editar proyecto" : "Nuevo proyecto" }}
        </h3>

        <form class="space-y-4" @submit.prevent="guardar">
          <label class="form-control">
            <span class="label-text mb-1">Nombre del proyecto</span>
            <input
              v-model.trim="form.nombre"
              class="input input-bordered"
              minlength="3"
              maxlength="150"
              required
            />
          </label>

          <label class="form-control">
            <span class="label-text mb-1">Materia</span>
            <input
              v-model.trim="form.materia"
              class="input input-bordered"
              maxlength="100"
              required
            />
          </label>

          <label class="form-control">
            <span class="label-text mb-1">Docente</span>
            <input
              v-model.trim="form.docente"
              class="input input-bordered"
              maxlength="150"
              required
            />
          </label>

          <label class="form-control">
            <span class="label-text mb-1">Año en que se cursó</span>
            <input
              v-model.number="form.anio"
              type="number"
              class="input input-bordered"
              min="2000"
              max="2100"
              placeholder="2024"
              required
            />
          </label>

          <!-- Portada -->
          <div class="form-control">
            <span class="label-text font-semibold mb-2">
              Portada del proyecto
            </span>

            <div class="flex flex-col sm:flex-row gap-4 items-start">
              <img
                :src="portadaPreview"
                alt="Vista previa de la portada"
                class="w-full sm:w-48 h-32 object-cover rounded-lg border border-base-300"
              />

              <div class="flex-1 space-y-2">
                <input
                  type="file"
                  class="file-input file-input-bordered w-full"
                  accept="image/jpeg,image/png,image/webp"
                  @change="seleccionarPortada"
                />

                <p class="text-xs text-base-content/60">
                  Formatos permitidos: JPG, PNG y WEBP. Tamaño máximo: 5 MB.
                </p>

                <p class="text-xs text-base-content/60">
                  {{
                    archivoPortada?.name ||
                    "No has seleccionado una imagen nueva."
                  }}
                </p>
              </div>
            </div>
          </div>

          <div class="modal-action">
            <button
              type="button"
              class="btn btn-ghost"
              @click="
                modal = false;
                limpiarFormulario();
              "
            >
              Cancelar
            </button>

            <button
              class="btn btn-primary"
              type="submit"
              :disabled="store.cargando"
            >
              <span
                v-if="store.cargando"
                class="loading loading-spinner loading-sm"
              ></span>

              {{ editando ? "Actualizar proyecto" : "Guardar proyecto" }}
            </button>
          </div>
        </form>
      </div>

      <form method="dialog" class="modal-backdrop">
        <button
          @click="
            modal = false;
            limpiarFormulario();
          "
        >
          Cerrar
        </button>
      </form>
    </dialog>
  </section>
</template>
