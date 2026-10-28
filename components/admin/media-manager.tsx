'use client'

import Image from 'next/image'
import { useRef, useState, useTransition } from 'react'
import { Trash2, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { deleteMedia } from '@/app/admin/actions'

export function MediaManager({ images }: { images: string[] }) {
  const [list, setList] = useState(images)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [, start] = useTransition()
  const input = useRef<HTMLInputElement>(null)

  async function upload(files: FileList | null) {
    if (!files?.length) return
    setBusy(true)
    setError('')
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.set('file', file)
      const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await r.json()
      if (!r.ok) setError(data.error)
      else setList((l) => [data.src, ...l])
    }
    setBusy(false)
    if (input.current) input.current.value = ''
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <input ref={input} type="file" accept="image/png,image/jpeg,image/webp,image/gif" multiple hidden onChange={(e) => upload(e.target.files)} />
        <Button type="button" onClick={() => input.current?.click()} disabled={busy} className="h-10 px-4">
          <Upload className="size-4" /> {busy ? 'Uploading…' : 'Upload images'}
        </Button>
        <p className="text-sm text-muted-foreground">PNG, JPG, WebP or GIF, up to 5 MB each.</p>
      </div>
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {list.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">No images yet. Upload your first one.</p>
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {list.map((src) => (
            <li key={src} className="group relative overflow-hidden rounded-lg border border-border bg-background">
              <div className="relative aspect-square bg-secondary"><Image src={src} alt="" fill sizes="200px" className="object-cover" /></div>
              <div className="flex items-center justify-between gap-2 p-2">
                <button type="button" className="min-w-0 truncate text-left text-xs text-muted-foreground hover:text-foreground" title="Copy path" onClick={() => navigator.clipboard.writeText(src)}>{src}</button>
                {src.startsWith('/uploads/') && (
                  <button type="button" aria-label={`Delete ${src}`} className="text-muted-foreground hover:text-destructive" onClick={() => confirm('Delete this image? Products using it will show a blank image.') && start(async () => { await deleteMedia(src); setList((l) => l.filter((x) => x !== src)) })}>
                    <Trash2 className="size-4" />
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
