import { verificarToken } from '../utils/seguridad.js'
export const proteger = (req, res, next) => {
  const encabezado = req.headers.authorization || ''
  const token = encabezado.startsWith('Bearer ') ? encabezado.slice(7) : ''
  if (!token) return res.status(401).json({ success: false, mensaje: 'Debes iniciar sesión.' })
  try {
    req.usuario = verificarToken(token, process.env.JWT_SECRET)
    next()
  } catch {
    return res.status(401).json({ success: false, mensaje: 'La sesión no es válida o ha expirado.' })
  }
}
