<script setup lang="ts">
import { reactive, ref } from "vue"
import fotoEscolar from "../assets/proyectos/sitio.svg"
import fotoTienda from "../assets/proyectos/tienda.svg"

interface Proyecto {
  nombre: string
  materia: string
  anio: string
  foto: string
}

const modal = ref<HTMLDialogElement | null>(null)
const detalle = ref<HTMLDialogElement | null>(null)
const confirmar = ref<HTMLDialogElement | null>(null)

const form = reactive({
  nombre: "",
  materia: "",
  anio: "",
})

const foto = ref("")
const archivo = ref<HTMLInputElement | null>(null)
const editando = ref<number | null>(null)
const visto = ref<Proyecto | null>(null)
const porEliminar = ref<number | null>(null)

const proyectos = ref<Proyecto[]>([
  { nombre: "Sistema escolar", materia: "Programación", anio: "2026", foto: fotoEscolar },
  { nombre: "Tienda en línea", materia: "Bases de datos", anio: "2025", foto: fotoTienda },
])

function elegirFoto(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => {
    foto.value = String(reader.result)
  }
  reader.readAsDataURL(file)
}

function limpiar() {
  form.nombre = ""
  form.materia = ""
  form.anio = ""
  foto.value = ""
  editando.value = null
  if (archivo.value) archivo.value.value = ""
}

function abrir() {
  limpiar()
  modal.value?.showModal()
}

function cerrar() {
  modal.value?.close()
  limpiar()
}

function ver(proyecto: Proyecto) {
  visto.value = proyecto
  detalle.value?.showModal()
}

function editar(indice: number) {
  const proyecto = proyectos.value[indice]
  editando.value = indice
  form.nombre = proyecto.nombre
  form.materia = proyecto.materia
  form.anio = proyecto.anio
  foto.value = proyecto.foto
  modal.value?.showModal()
}

function pedirEliminar(indice: number) {
  porEliminar.value = indice
  confirmar.value?.showModal()
}

function eliminar() {
  if (porEliminar.value !== null) {
    proyectos.value.splice(porEliminar.value, 1)
  }
  porEliminar.value = null
  confirmar.value?.close()
}

function guardar() {
  const datos: Proyecto = {
    nombre: form.nombre,
    materia: form.materia,
    anio: form.anio,
    foto: foto.value,
  }
  if (editando.value === null) {
    proyectos.value.push(datos)
  } else {
    proyectos.value[editando.value] = datos
  }
  cerrar()
}
</script>

<template>
  <button type="button" class="btn btn-circle btn-outline mb-4" aria-label="Agregar" @click="abrir">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor">
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 4v16m8-8H4" />
    </svg>
  </button>

  <div class="overflow-x-auto rounded-box bg-base-100">
    <table class="table">
      <thead>
        <tr>
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <th>Proyecto</th>
          <th>Materia</th>
          <th>Año</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(proyecto, indice) in proyectos" :key="indice">
          <th>
            <label>
              <input type="checkbox" class="checkbox" />
            </label>
          </th>
          <td>
            <div class="flex items-center gap-3">
              <div class="avatar">
                <div class="mask mask-squircle h-12 w-12">
                  <img v-if="proyecto.foto" :src="proyecto.foto" :alt="proyecto.nombre" />
                </div>
              </div>
              <div>
                <div class="font-bold">{{ proyecto.nombre }}</div>
                <div class="text-sm opacity-50">{{ proyecto.materia }}</div>
              </div>
            </div>
          </td>
          <td>
            {{ proyecto.materia }}
            <br />
            <span class="badge badge-ghost badge-sm">{{ proyecto.anio }}</span>
          </td>
          <td>{{ proyecto.anio }}</td>
          <th class="flex gap-1">
            <button type="button" class="btn btn-ghost btn-xs" @click="ver(proyecto)">Ver</button>
            <button type="button" class="btn btn-ghost btn-xs" @click="editar(indice)">Editar</button>
            <button type="button" class="btn btn-ghost btn-xs text-error" @click="pedirEliminar(indice)">
              Eliminar
            </button>
          </th>
        </tr>
      </tbody>
      <tfoot>
        <tr>
          <th></th>
          <th>Proyecto</th>
          <th>Materia</th>
          <th>Año</th>
          <th></th>
        </tr>
      </tfoot>
    </table>
  </div>

  <dialog ref="modal" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">{{ editando === null ? "Agregar proyecto" : "Editar proyecto" }}</h3>
      <form class="mt-4 flex flex-col gap-3" @submit.prevent="guardar">
        <label class="form-control">
          <span class="label-text">Nombre del proyecto</span>
          <input v-model="form.nombre" type="text" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">Materia</span>
          <input v-model="form.materia" type="text" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">Año</span>
          <input v-model="form.anio" type="number" min="2000" max="2100" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">Foto</span>
          <input
            ref="archivo"
            type="file"
            accept="image/*"
            class="file-input file-input-bordered w-full"
            @change="elegirFoto"
          />
        </label>
        <div v-if="foto" class="avatar">
          <div class="mask mask-squircle h-16 w-16">
            <img :src="foto" alt="Vista previa" />
          </div>
        </div>
        <div class="modal-action">
          <button type="button" class="btn" @click="cerrar">Cancelar</button>
          <button type="submit" class="btn btn-primary">Guardar</button>
        </div>
      </form>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>cerrar</button>
    </form>
  </dialog>

  <dialog ref="detalle" class="modal">
    <div v-if="visto" class="modal-box">
      <h3 class="text-lg font-bold">{{ visto.nombre }}</h3>
      <div class="mt-4 flex items-center gap-4">
        <div class="avatar">
          <div class="mask mask-squircle h-16 w-16">
            <img v-if="visto.foto" :src="visto.foto" :alt="visto.nombre" />
          </div>
        </div>
        <div>
          <p>{{ visto.materia }}</p>
          <p class="text-sm opacity-50">{{ visto.anio }}</p>
        </div>
      </div>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cerrar</button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>cerrar</button>
    </form>
  </dialog>

  <dialog ref="confirmar" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">Eliminar proyecto</h3>
      <p class="py-4">¿Seguro que quieres eliminar este proyecto?</p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">Cancelar</button>
        </form>
        <button type="button" class="btn btn-error" @click="eliminar">Eliminar</button>
      </div>
    </div>
  </dialog>
</template>
