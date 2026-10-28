'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import { Check, Upload } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function ImagePicker({
  name,
  defaultValue,
  library: initialLibrary,
  label = 'Image',
}: {
  name: string
  defaultValue: string
  library: string[]
  label?: string
}) {
  const [value, setValue] = useState(defaultValue)
  const [library, setLibrary] = useState(initialLibrary)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function upload(file?: File) {
    if (!file) return
    setUploading(true)
    setUploadError('')
    const fd = new FormData()
    fd.set('file', file)
    const r = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await r.json()
    setUploading(false)
    if (!r.ok) return setUploadError(data.error)
    setLibrary((l) => [data.src, ...l])
    setValue(data.src)
  }
  const inputId = `${name}-url`

  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-lg border border-border bg-secondary sm:w-40">
          {value ? (
            <Image src={value} alt="Selected image preview" fill sizes="160px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center p-4 text-center text-xs text-muted-foreground">
              No image selected
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-3">
          <div className="grid max-h-48 grid-cols-5 gap-2 overflow-y-auto rounded-lg border border-border p-2 sm:grid-cols-6">
            {library.map((src) => {
              const selected = src === value
              return (
                <button
                  key={src}
                  type="button"
                  onClick={() => setValue(src)}
                  aria-pressed={selected}
                  aria-label={`Use ${src.split('/').pop()}`}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-md border-2 bg-secondary',
                    selected ? 'border-primary' : 'border-transparent hover:border-border',
                  )}
                >
                  <Image src={src} alt="" fill sizes="64px" className="object-cover" />
                  {selected && (
                    <span className="absolute right-1 top-1 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                      <Check className="size-3" />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-3">
            <input ref={fileRef} type="file" accept="image/png,image/jpeg,image/webp,image/gif" hidden onChange={(e) => upload(e.target.files?.[0])} />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="inline-flex h-8 items-center gap-2 rounded-lg border border-border px-3 text-sm hover:bg-muted disabled:opacity-50"
            >
              <Upload className="size-4" /> {uploading ? 'Uploading…' : 'Upload new image'}
            </button>
            {uploadError && <p role="alert" className="text-xs text-destructive">{uploadError}</p>}
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor={inputId} className="text-xs text-muted-foreground">
              Or paste an image path / HTTPS URL
            </Label>
            <Input
              id={inputId}
              name={name}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="/images/my-photo.png"
              required
            />
          </div>
        </div>
      </div>
    </fieldset>
  )
}
