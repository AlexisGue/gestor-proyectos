import Proyecto from "../models/Proyecto.js";
import fs from "fs/promises";
import path from "path";

// Eliminar un archivo de portada del almacenamiento.
const eliminarArchivoPortada = async (portada) => {
  if (!portada) return;

  try {
    const nombreArchivo = path.basename(portada);
    const rutaArchivo = path.resolve("uploads", nombreArchivo);

    await fs.unlink(rutaArchivo);
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.error("Error al eliminar portada:", error.message);
    }
  }
};

// Validar los datos del proyecto.
const validarDatosProyecto = (datos) => {
  const { nombre, materia, docente } = datos;
  const anio = Number(datos.anio);

  if (
    typeof nombre !== "string" ||
    typeof materia !== "string" ||
    typeof docente !== "string" ||
    !nombre.trim() ||
    !materia.trim() ||
    !docente.trim()
  ) {
    return {
      valido: false,
      mensaje: "Nombre del proyecto, materia y docente son obligatorios.",
    };
  }

  if (!Number.isInteger(anio) || anio < 2000 || anio > 2100) {
    return {
      valido: false,
      mensaje: "Indica el año en que se cursó, entre 2000 y 2100.",
    };
  }

  return {
    valido: true,
    datos: {
      nombre: nombre.trim(),
      materia: materia.trim(),
      docente: docente.trim(),
      anio,
    },
  };
};

// GET: listar todos los proyectos.
export const listarProyectos = async (req, res) => {
  try {
    const proyectos = await Proyecto.find().sort({
      createdAt: 1,
    });

    res.status(200).json({
      success: true,
      total: proyectos.length,
      proyectos,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al consultar los proyectos",
      error: error.message,
    });
  }
};

// GET: obtener un proyecto por su ID.
export const obtenerProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        mensaje: "Proyecto no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      proyecto,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al consultar el proyecto",
      error: error.message,
    });
  }
};

// POST: registrar un proyecto.
export const registrarProyecto = async (req, res) => {
  try {
    const validacion = validarDatosProyecto(req.body);

    if (!validacion.valido) {
      if (req.file) {
        await eliminarArchivoPortada(req.file.filename);
      }

      return res.status(400).json({
        success: false,
        mensaje: validacion.mensaje,
      });
    }

    const proyecto = await Proyecto.create({
      ...validacion.datos,
      portada: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      mensaje: "Proyecto registrado correctamente",
      proyecto,
    });
  } catch (error) {
    if (req.file) {
      await eliminarArchivoPortada(req.file.filename);
    }

    res.status(400).json({
      success: false,
      mensaje: "No se pudo registrar el proyecto",
      error: error.message,
    });
  }
};

// PUT: actualizar un proyecto.
export const actualizarProyecto = async (req, res) => {
  try {
    const validacion = validarDatosProyecto(req.body);

    if (!validacion.valido) {
      if (req.file) {
        await eliminarArchivoPortada(req.file.filename);
      }

      return res.status(400).json({
        success: false,
        mensaje: validacion.mensaje,
      });
    }

    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      if (req.file) {
        await eliminarArchivoPortada(req.file.filename);
      }

      return res.status(404).json({
        success: false,
        mensaje: "Proyecto no encontrado",
      });
    }

    const portadaAnterior = proyecto.portada;

    proyecto.nombre = validacion.datos.nombre;
    proyecto.materia = validacion.datos.materia;
    proyecto.docente = validacion.datos.docente;
    proyecto.anio = validacion.datos.anio;

    // Reemplazar la portada únicamente si se envió otra imagen.
    if (req.file) {
      proyecto.portada = `/uploads/${req.file.filename}`;
    }

    await proyecto.save();

    // Eliminar la portada anterior después de guardar correctamente.
    if (req.file && portadaAnterior) {
      await eliminarArchivoPortada(portadaAnterior);
    }

    res.status(200).json({
      success: true,
      mensaje: "Proyecto actualizado correctamente",
      proyecto,
    });
  } catch (error) {
    if (req.file) {
      await eliminarArchivoPortada(req.file.filename);
    }

    res.status(400).json({
      success: false,
      mensaje: "No se pudo actualizar el proyecto",
      error: error.message,
    });
  }
};

const ESTADOS = ["pendiente", "en_proceso", "completado"];

// PATCH: actualizar el estado elegido por el usuario.
export const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body;

    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        success: false,
        mensaje: "El estado debe ser pendiente, en proceso o completado.",
      });
    }

    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        mensaje: "Proyecto no encontrado",
      });
    }

    proyecto.estado = estado;
    await proyecto.save();

    res.status(200).json({
      success: true,
      mensaje: "Estado actualizado correctamente",
      proyecto,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      mensaje: "No se pudo actualizar el estado",
      error: error.message,
    });
  }
};

// DELETE: eliminar un proyecto.
export const eliminarProyecto = async (req, res) => {
  try {
    const proyecto = await Proyecto.findById(req.params.id);

    if (!proyecto) {
      return res.status(404).json({
        success: false,
        mensaje: "Proyecto no encontrado",
      });
    }

    if (proyecto.estado === "en_proceso") {
      return res.status(409).json({
        success: false,
        mensaje: "No puedes eliminar un proyecto que se encuentra en proceso.",
      });
    }

    await proyecto.deleteOne();

    // Eliminar también la portada asociada.
    await eliminarArchivoPortada(proyecto.portada);

    res.status(200).json({
      success: true,
      mensaje: "Proyecto eliminado correctamente",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      mensaje: "Error al eliminar el proyecto",
      error: error.message,
    });
  }
};
