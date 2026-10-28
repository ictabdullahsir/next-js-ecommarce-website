'use client'

import Link from 'next/link'
import { useTransition } from 'react'
import { Copy, Eye, EyeOff, Pencil, Star, Trash2 } from 'lucide-react'
import { deletePost, duplicatePost, togglePostFeatured, togglePostStatus } from '@/app/admin/blog-actions'
import { cn } from '@/lib/utils'

const iconButton =
  'inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40'

export function PostRowActions({
  slug,
  title,
  published,
  featured,
}: {
  slug: string
  title: string
  published: boolean
  featured: boolean
}) {
  const [pending, startTransition] = useTransition()

  return (
    <div className="flex justify-end gap-1">
      <button
        type="button"
        className={cn(iconButton, featured && 'text-primary')}
        disabled={pending}
        onClick={() => startTransition(() => togglePostFeatured(slug))}
        aria-label={featured ? `Unfeature ${title}` : `Feature ${title}`}
        aria-pressed={featured}
        title={featured ? 'Unfeature' : 'Feature'}
      >
        <Star className={cn('size-4', featured && 'fill-current')} />
      </button>
      <button
        type="button"
        className={iconButton}
        disabled={pending}
        onClick={() => startTransition(() => togglePostStatus(slug))}
        aria-label={published ? `Unpublish ${title}` : `Publish ${title}`}
        title={published ? 'Unpublish' : 'Publish'}
      >
        {published ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
      </button>
      <button
        type="button"
        className={iconButton}
        disabled={pending}
        onClick={() => startTransition(() => duplicatePost(slug))}
        aria-label={`Duplicate ${title}`}
        title="Duplicate"
      >
        <Copy className="size-4" />
      </button>
      <Link href={`/admin/blog/${slug}`} className={iconButton} aria-label={`Edit ${title}`} title="Edit">
        <Pencil className="size-4" />
      </Link>
      <button
        type="button"
        className={`${iconButton} hover:text-destructive`}
        disabled={pending}
        onClick={() => {
          if (confirm(`Delete "${title}"? This cannot be undone.`)) {
            startTransition(() => deletePost(slug))
          }
        }}
        aria-label={`Delete ${title}`}
        title="Delete"
      >
        <Trash2 className="size-4" />
      </button>
    </div>
  )
}
