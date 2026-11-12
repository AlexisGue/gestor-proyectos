import mongoose from "mongoose";

const proyectoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, "El nombre del proyecto es obligatorio"],
      trim: true,
      minlength: [3, "El nombre debe tener al menos 3 caracteres"],
      maxlength: [150, "El nombre no puede superar los 150 caracteres"],
    },

    materia: {
      type: String,
      required: [true, "La materia es obligatoria"],
      trim: true,
      maxlength: [100, "La materia no puede superar los 100 caracteres"],
    },

    docente: {
      type: String,
      required: [true, "El docente es obligatorio"],
      trim: true,
      maxlength: [
        150,
        "El nombre del docente no puede superar los 150 caracteres",
      ],
    },

    anio: {
      type: Number,
      min: [2000, "El año debe estar entre 2000 y 2100"],
      max: [2100, "El año debe estar entre 2000 y 2100"],
    },

    portada: {
      type: String,
      default: null,
    },

    estado: {
      type: String,
      enum: ["pendiente", "en_proceso", "completado"],
      default: "pendiente",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

const Proyecto = mongoose.model("Proyecto", proyectoSchema);

export default Proyecto;
