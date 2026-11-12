import api from './proyectoService'
export interface UsuarioSesion {
  id: string;
  nombre: string;
  email: string;
  rol?: string;
}
export interface RespuestaAuth {
  success: boolean;
  token: string;
  usuario: UsuarioSesion;
}
export const iniciarSesion = async (email: string, password: string) =>
  (await api.post<RespuestaAuth>("/auth/login", { email, password })).data;

export const registrarCuenta = async (
  nombre: string,
  email: string,
  password: string,
) =>
  (
    await api.post<RespuestaAuth>("/auth/registro", {
      nombre,
      email,
      password,
    })
  ).data;
