import path from "path";
import { fileURLToPath } from "url";

const raizConfig = path.dirname(fileURLToPath(import.meta.url));

export const directorioBackend = path.resolve(raizConfig, "..");
export const directorioUploads = path.join(directorioBackend, "uploads");
export const directorioDist = path.resolve(directorioBackend, "..", "dist");
