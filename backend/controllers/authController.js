import Usuario from '../models/Usuario.js'
import { verificarPassword, hashPassword, crearToken } from '../utils/seguridad.js'

const datosSesion = (usuario) => ({
  id: usuario._id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
})

export const registro = async (req, res) => {
  try {
    const nombre = String(req.body.nombre || '').trim()
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')

    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ success: false, mensaje: 'Nombre, correo y contraseña son obligatorios.' })
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ success: false, mensaje: 'La contraseña debe tener al menos 6 caracteres.' })
    }

    const existe = await Usuario.exists({ email })
    if (existe) {
      return res.status(409).json({ success: false, mensaje: 'Ya existe una cuenta con ese correo.' })
    }

    const usuario = await Usuario.create({
      nombre,
      email,
      password: await hashPassword(password),
      rol: 'usuario',
      activo: true,
    })

    const token = crearToken(
      { sub: usuario._id.toString(), email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET,
    )

    res.status(201).json({
      success: true,
      token,
      usuario: datosSesion(usuario),
    })
  } catch {
    res.status(500).json({ success: false, mensaje: 'Error al registrar la cuenta.' })
  }
}

export const login = async (req, res) => {
  try {
    const email = String(req.body.email || '').trim().toLowerCase()
    const password = String(req.body.password || '')
    if (!email || !password) return res.status(400).json({ success: false, mensaje: 'Correo y contraseña son obligatorios.' })
    const usuario = await Usuario.findOne({ email, activo: true })
    if (!usuario || !(await verificarPassword(password, usuario.password))) {
      return res.status(401).json({ success: false, mensaje: 'Correo o contraseña incorrectos.' })
    }
    const token = crearToken({ sub: usuario._id.toString(), email: usuario.email, rol: usuario.rol }, process.env.JWT_SECRET)
    res.json({ success: true, token, usuario: datosSesion(usuario) })
  } catch {
    res.status(500).json({ success: false, mensaje: 'Error al iniciar sesión.' })
  }
}
