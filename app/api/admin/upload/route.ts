import { promises as fs } from 'fs'
import path from 'path'
import { NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'

const TYPES: Record<string, string> = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp', 'image/gif': 'gif' }
const MAX = 5 * 1024 * 1024

export async function POST(req: Request) {
  if (!(await isAdmin())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const file = (await req.formData()).get('file')
  if (!(file instanceof File)) return NextResponse.json({ error: 'No file received.' }, { status: 400 })
  const ext = TYPES[file.type]
  if (!ext) return NextResponse.json({ error: 'Upload a PNG, JPG, WebP or GIF image.' }, { status: 400 })
  if (file.size > MAX) return NextResponse.json({ error: 'Images must be under 5 MB.' }, { status: 400 })

  const base = file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'image'
  const name = `${base}-${Date.now().toString(36)}.${ext}`
  try {
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await fs.mkdir(dir, { recursive: true })
    await fs.writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()))
  } catch {
    return NextResponse.json({ error: 'This host has a read-only disk. Use an external image URL instead.' }, { status: 500 })
  }
  return NextResponse.json({ src: `/uploads/${name}` })
}
