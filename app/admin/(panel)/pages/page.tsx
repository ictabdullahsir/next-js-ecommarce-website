import Link from 'next/link'
import { ExternalLink, Pencil, Plus } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { DeleteButton } from '@/components/admin/delete-button'
import { deletePage } from '@/app/admin/actions'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Pages' }

export default async function PagesPage() {
  const { pages } = await getStore()
  return (
    <>
      <AdminPageHeader
        title="Pages"
        description="About, shipping, contact and any other content pages. Link them from Navigation."
        action={<Link href="/admin/pages/new" className={buttonVariants({ className: 'h-10 px-4' })}><Plus className="size-4" /> New page</Link>}
      />
      <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-background">
        {pages.length === 0 && <li className="p-10 text-center text-sm text-muted-foreground">No pages yet.</li>}
        {pages.map((p) => (
          <li key={p.slug} className="flex flex-wrap items-center gap-3 px-4 py-3 text-sm">
            <span className="min-w-0 flex-1"><span className="block truncate font-medium">{p.title}</span><span className="block text-xs text-muted-foreground">/pages/{p.slug}</span></span>
            <Badge variant={p.published ? 'default' : 'outline'}>{p.published ? 'Published' : 'Draft'}</Badge>
            {p.published && <Link href={`/pages/${p.slug}`} target="_blank" className={buttonVariants({ variant: 'ghost', size: 'icon' })} aria-label={`View ${p.title}`}><ExternalLink className="size-4" /></Link>}
            <Link href={`/admin/pages/${p.slug}`} className={buttonVariants({ variant: 'ghost', size: 'icon' })} aria-label={`Edit ${p.title}`}><Pencil className="size-4" /></Link>
            <DeleteButton iconOnly action={deletePage.bind(null, p.slug)} confirmText={`Delete "${p.title}"?`} label={`Delete ${p.title}`} />
          </li>
        ))}
      </ul>
    </>
  )
}
