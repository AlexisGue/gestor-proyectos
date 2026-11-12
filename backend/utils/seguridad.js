import { randomBytes, scrypt as scryptCallback, timingSafeEqual, createHmac } from 'node:crypto'
import { promisify } from 'node:util'
const scrypt = promisify(scryptCallback)
export async function hashPassword(password) {
  const salt = randomBytes(16)
  const derived = await scrypt(password, salt, 64)
  return `scrypt:${salt.toString('hex')}:${Buffer.from(derived).toString('hex')}`
}
export async function verificarPassword(password, stored) {
  const [scheme, saltHex, hashHex] = String(stored).split(':')
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false
  const actual = Buffer.from(await scrypt(password, Buffer.from(saltHex, 'hex'), 64))
  const expected = Buffer.from(hashHex, 'hex')
  return actual.length === expected.length && timingSafeEqual(actual, expected)
}
const encode = value => Buffer.from(JSON.stringify(value)).toString('base64url')
export function crearToken(payload, secret) {
  const header = encode({ alg: 'HS256', typ: 'JWT' })
  const body = encode({ ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+28800 })
  const signature = createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url')
  return `${header}.${body}.${signature}`
}
export function verificarToken(token, secret) {
  const [header, body, signature] = String(token).split('.')
  if (!header || !body || !signature) throw new Error('Token inválido')
  const expected = createHmac('sha256', secret).update(`${header}.${body}`).digest()
  const actual = Buffer.from(signature, 'base64url')
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) throw new Error('Firma inválida')
  const payload = JSON.parse(Buffer.from(body, 'base64url').toString())
  if (!payload.exp || payload.exp < Math.floor(Date.now()/1000)) throw new Error('Token expirado')
  return payload
}
