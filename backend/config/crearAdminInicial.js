import Usuario from '../models/Usuario.js'
import { hashPassword } from '../utils/seguridad.js'
export default async function crearAdminInicial() {
  const email = (process.env.ADMIN_EMAIL || 'admin@proyectos.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'Admin123*'
  const nombre = process.env.ADMIN_NAME || 'Administrador'
  if (!(await Usuario.exists({ email }))) {
    await Usuario.create({ nombre, email, password: await hashPassword(password), rol: 'admin', activo: true })
    console.log(`Usuario administrador inicial creado: ${email}`)
  }
}
