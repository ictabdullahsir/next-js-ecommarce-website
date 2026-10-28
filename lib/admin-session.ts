export const SESSION_COOKIE = 'loom_admin_session'
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7

const SECRET = process.env.ADMIN_SESSION_SECRET || 'loom-demo-session-secret-change-me'

const encoder = new TextEncoder()

async function sign(value: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(value))
  return Array.from(new Uint8Array(signature), (b) => b.toString(16).padStart(2, '0')).join('')
}

export function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function createSessionToken() {
  const expires = String(Date.now() + SESSION_TTL_MS)
  return `${expires}.${await sign(expires)}`
}

export async function verifySessionToken(token: string | undefined) {
  if (!token) return false
  const [expires, signature] = token.split('.')
  if (!expires || !signature || Number(expires) < Date.now()) return false
  return safeEqual(signature, await sign(expires))
}
