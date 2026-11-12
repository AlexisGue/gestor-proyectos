import mongoose from 'mongoose'
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ['admin', 'usuario'], default: 'admin' },
  activo: { type: Boolean, default: true }
}, { timestamps: true, versionKey: false })
export default mongoose.model('Usuario', usuarioSchema)
