import { defineStore } from 'pinia'
import {
  iniciarSesion,
  registrarCuenta,
  type UsuarioSesion,
} from "@/services/authService";

function leerUsuario(): UsuarioSesion | null {
  try {
    return JSON.parse(localStorage.getItem("proyectos_usuario") || "null");
  } catch {
    localStorage.removeItem("proyectos_usuario");
    return null;
  }
}

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('proyectos_token') || '',
    usuario: leerUsuario(),
    cargando: false,
    error: ''
  }),
  getters: { autenticado: state => Boolean(state.token) },
  actions: {
    guardarSesion(data: { token: string; usuario: UsuarioSesion }) {
      this.token = data.token;
      this.usuario = data.usuario;
      localStorage.setItem("proyectos_token", data.token);
      localStorage.setItem("proyectos_usuario", JSON.stringify(data.usuario));
    },
    async iniciar(email: string, password: string) {
      this.cargando = true;
      this.error = "";
      try {
        const data = await iniciarSesion(email, password);
        this.guardarSesion(data);
        return true;
      } catch (e: any) {
        this.error =
          e?.response?.data?.mensaje || "No fue posible iniciar sesión.";
        return false;
      } finally {
        this.cargando = false;
      }
    },
    async registrar(nombre: string, email: string, password: string) {
      this.cargando = true;
      this.error = "";
      try {
        const data = await registrarCuenta(nombre, email, password);
        this.guardarSesion(data);
        return true;
      } catch (e: any) {
        this.error =
          e?.response?.data?.mensaje || "No fue posible crear la cuenta.";
        return false;
      } finally {
        this.cargando = false;
      }
    },
    cerrarSesion() {
      this.token = ''; this.usuario = null
      localStorage.removeItem('proyectos_token')
      localStorage.removeItem('proyectos_usuario')
    }
  }
})
