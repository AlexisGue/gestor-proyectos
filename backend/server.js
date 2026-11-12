import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

import conectarDB from "./config/database.js";
import proyectoRoutes from "./routes/proyectoRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { proteger } from "./middleware/autenticacion.js";
import crearAdminInicial from "./config/crearAdminInicial.js";
import {
  directorioBackend,
  directorioDist,
  directorioUploads,
} from "./config/rutas.js";

dotenv.config({ path: path.join(directorioBackend, ".env") });

const app = express();

app.use(cors());
app.use(express.json());

// En Render el frontend compilado vive junto a la API, así /api sigue siendo relativo.
if (fs.existsSync(directorioDist)) {
  app.use(express.static(directorioDist));
}

// Publicar las imágenes de portada.
app.use("/uploads", express.static(directorioUploads));

// Autenticación pública.
app.use("/api/auth", authRoutes);

// Los proyectos requieren sesión válida.
app.use("/api/proyectos", proteger, proyectoRoutes);

app.get("/api", (req, res) => {
  res.json({
    mensaje: "API de proyectos funcionando correctamente",
    estado: true,
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    servidor: "activo",
    base_datos: "MongoDB",
  });
});

app.use((error, req, res, next) => {
  if (error?.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      mensaje: "La imagen no puede superar los 5 MB.",
    });
  }

  if (error?.message?.startsWith("Solo se permiten")) {
    return res.status(400).json({
      success: false,
      mensaje: error.message,
    });
  }

  next(error);
});

app.use((req, res, next) => {
  if (req.method !== "GET" && req.method !== "HEAD") return next();
  if (req.path.startsWith("/api") || req.path.startsWith("/uploads")) {
    return next();
  }

  const index = path.join(directorioDist, "index.html");

  if (!fs.existsSync(index)) return next();

  res.sendFile(index);
});

const iniciarServidor = async () => {
  try {
    await conectarDB();
    await crearAdminInicial();

    const PORT = process.env.PORT || 3000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

iniciarServidor();
