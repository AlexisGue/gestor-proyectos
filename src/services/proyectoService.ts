import axios from "axios";

const api = axios.create({
  baseURL: "/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("proyectos_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      localStorage.getItem("proyectos_token")
    ) {
      localStorage.removeItem("proyectos_token");
      localStorage.removeItem("proyectos_usuario");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  },
);

export interface Proyecto {
  _id: string;
  nombre: string;
  materia: string;
  docente: string;
  anio?: number | null;
  portada?: string | null;

  estado: "pendiente" | "en_proceso" | "completado";

  createdAt: string;
  updatedAt: string;
}

export interface DatosProyecto {
  nombre: string;
  materia: string;
  docente: string;
  anio: number;
  portada?: File | null;
}

export interface RespuestaProyectos {
  success: boolean;
  total: number;
  proyectos: Proyecto[];
}

function crearFormulario(datos: DatosProyecto): FormData {
  const formulario = new FormData();

  formulario.append("nombre", datos.nombre);
  formulario.append("materia", datos.materia);
  formulario.append("docente", datos.docente);
  formulario.append("anio", String(datos.anio));

  if (datos.portada) {
    formulario.append("portada", datos.portada);
  }

  return formulario;
}

export const listarProyectos = async () =>
  (await api.get<RespuestaProyectos>("/proyectos")).data;

export const registrarProyecto = async (datos: DatosProyecto) =>
  (await api.post("/proyectos", crearFormulario(datos))).data;

export const actualizarProyecto = async (id: string, datos: DatosProyecto) =>
  (await api.put(`/proyectos/${id}`, crearFormulario(datos))).data;

export const eliminarProyecto = async (id: string) =>
  (await api.delete(`/proyectos/${id}`)).data;

export const actualizarEstadoProyecto = async (
  id: string,
  estado: Proyecto["estado"],
) => (await api.patch(`/proyectos/${id}/estado`, { estado })).data;

export default api;
