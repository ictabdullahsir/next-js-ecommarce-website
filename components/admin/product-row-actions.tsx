'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Eye, EyeOff, Pencil, Trash2 } from 'lucide-react'
import { deleteProduct, toggleProductPublished } from '@/app/admin/actions'

const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40'

export function ProductRowActions({
  slug,
  name,
  published,
}: {
  slug: string
  name: string
  published: boolean
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        className={iconButton}
        disabled={pending}
        onClick={() => startTransition(() => toggleProductPublished(slug))}
        aria-label={published ? `Unpublish ${name}` : `Publish ${name}`}
        title={published ? 'Unpublish' : 'Publish'}
      >
        {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <Link href={`/admin/products/${slug}`} className={iconButton} aria-label={`Edit ${name}`} title="Edit">
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        className={`${iconButton} hover:text-destructive`}
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${name}"? This cannot be undone.`)) {
            startTransition(() => deleteProduct(slug))
          }
        }}
        aria-label={`Delete ${name}`}
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
