import express from "express";

import {
  listarProyectos,
  obtenerProyecto,
  registrarProyecto,
  actualizarProyecto,
  actualizarEstado,
  eliminarProyecto,
} from "../controllers/proyectoController.js";

import subirPortada from "../middleware/subirPortada.js";

const router = express.Router();

// Listar todos los proyectos.
router.get("/", listarProyectos);

// Consultar un proyecto por ID.
router.get("/:id", obtenerProyecto);

// Registrar un proyecto con portada opcional.
router.post("/", subirPortada.single("portada"), registrarProyecto);

// Actualizar un proyecto con portada opcional.
router.put("/:id", subirPortada.single("portada"), actualizarProyecto);

// Actualizar el estado del proyecto.
router.patch("/:id/estado", actualizarEstado);

// Eliminar un proyecto.
router.delete("/:id", eliminarProyecto);

export default router;
