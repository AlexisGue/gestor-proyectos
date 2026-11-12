import { defineStore } from "pinia";

import {
  listarProyectos,
  registrarProyecto,
  actualizarProyecto,
  eliminarProyecto,
  actualizarEstadoProyecto,
} from "@/services/proyectoService";

import type { Proyecto, DatosProyecto } from "@/services/proyectoService";

function mensajeError(error: unknown, respaldo: string) {
  const respuesta = error as {
    response?: { data?: { mensaje?: string } };
  };

  return respuesta.response?.data?.mensaje || respaldo;
}

export const useProyectoStore = defineStore("proyectos", {
  state: () => ({
    proyectos: [] as Proyecto[],
    cargando: false,
    error: null as string | null,
  }),

  getters: {
    totalProyectos: (state) => state.proyectos.length,

    proyectosPendientes: (state) =>
      state.proyectos.filter((p) => p.estado === "pendiente").length,

    proyectosEnProceso: (state) =>
      state.proyectos.filter((p) => p.estado === "en_proceso").length,

    proyectosCompletados: (state) =>
      state.proyectos.filter((p) => p.estado === "completado").length,
  },

  actions: {
    async obtenerProyectos() {
      this.cargando = true;
      this.error = null;

      try {
        const respuesta = await listarProyectos();
        this.proyectos = respuesta.proyectos;
      } catch (error) {
        console.error("Error al consultar proyectos:", error);
        this.error = "No fue posible cargar los proyectos.";
      } finally {
        this.cargando = false;
      }
    },

    async crearProyecto(datos: DatosProyecto) {
      this.error = null;

      try {
        await registrarProyecto(datos);
        await this.obtenerProyectos();
        return true;
      } catch (error) {
        console.error("Error al registrar proyecto:", error);
        this.error = mensajeError(error, "No fue posible registrar el proyecto.");
        return false;
      }
    },

    async editarProyecto(id: string, datos: DatosProyecto) {
      this.error = null;

      try {
        await actualizarProyecto(id, datos);
        await this.obtenerProyectos();
        return true;
      } catch (error) {
        console.error("Error al actualizar proyecto:", error);
        this.error = mensajeError(error, "No fue posible actualizar el proyecto.");
        return false;
      }
    },

    async cambiarEstado(id: string, estado: Proyecto["estado"]) {
      this.error = null;

      try {
        await actualizarEstadoProyecto(id, estado);
        await this.obtenerProyectos();
        return true;
      } catch (error) {
        console.error("Error al actualizar el estado:", error);
        this.error = mensajeError(error, "No fue posible actualizar el estado.");
        return false;
      }
    },

    async borrarProyecto(id: string) {
      this.error = null;

      try {
        await eliminarProyecto(id);
        await this.obtenerProyectos();
        return true;
      } catch (error) {
        console.error("Error al eliminar proyecto:", error);
        this.error = mensajeError(
          error,
          "No fue posible eliminar el proyecto.",
        );
        return false;
      }
    },
  },
});
