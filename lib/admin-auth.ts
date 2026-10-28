import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/admin-session'

export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function isAdmin() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function requireAdmin() {
  if (!(await isAdmin())) redirect('/admin/login')
}
