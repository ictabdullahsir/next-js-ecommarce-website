import Image from 'next/image'
import Link from 'next/link'
import { Plus, Search, Settings } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { PostRowActions } from '@/components/admin/post-row-actions'
import { formatPostDate, getPostState, sortPostsByDate, type PostState } from '@/lib/blog'
import { getStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Blog' }

type Props = { searchParams: Promise<{ status?: string; q?: string }> }

const STATUS_TABS: { value?: PostState; label: string }[] = [
  { label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Drafts' },
]

const stateBadge: Record<PostState, React.ReactNode> = {
  published: <Badge>Published</Badge>,
  scheduled: <Badge variant="secondary">Scheduled</Badge>,
  draft: <Badge variant="outline">Draft</Badge>,
}

export default async function AdminBlogPage({ searchParams }: Props) {
  const [{ status, q }, { posts, blog }] = await Promise.all([searchParams, getStore()])
  const filter = STATUS_TABS.find((t) => t.value && t.value === status)?.value
  const query = q?.trim().toLowerCase() ?? ''

  const rows = sortPostsByDate(posts).filter(
    (p) =>
      (!filter || getPostState(p) === filter) &&
      (!query || `${p.title} ${p.excerpt} ${p.tags.join(' ')} ${p.category}`.toLowerCase().includes(query)),
  )

  const tabHref = (value?: string) => {
    const params = new URLSearchParams()
    if (value) params.set('status', value)
    if (q) params.set('q', q)
    const s = params.toString()
    return s ? `/admin/blog?${s}` : '/admin/blog'
  }

  return (
    <>
      <AdminPageHeader
        title="Blog"
        description={`${posts.length} posts · blog is ${blog.enabled ? 'live' : 'disabled'}.`}
        action={
          <div className="flex gap-2">
            <Link
              href="/admin/blog/settings"
              className={buttonVariants({ variant: 'outline', className: 'h-10 px-4' })}
            >
              <Settings className="size-4" /> Settings
            </Link>
            <Link href="/admin/blog/new" className={buttonVariants({ className: 'h-10 px-4' })}>
              <Plus className="size-4" /> New post
            </Link>
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <nav aria-label="Filter by status" className="flex flex-wrap gap-2">
          {STATUS_TABS.map((t) => {
            const active = t.value === filter
            const count = t.value ? posts.filter((p) => getPostState(p) === t.value).length : posts.length
            return (
              <Link
                key={t.label}
                href={tabHref(t.value)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border bg-background hover:border-foreground/40',
                )}
              >
                {t.label} <span className="opacity-60">{count}</span>
              </Link>
            )
          })}
        </nav>
        <form role="search" className="relative md:w-72">
          {filter && <input type="hidden" name="status" value={filter} />}
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input name="q" defaultValue={q} placeholder="Search posts" aria-label="Search posts" className="h-9 bg-background pl-9" />
        </form>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Post</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="hidden md:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {query || filter ? 'No posts match your filters.' : 'No posts yet. Write your first story.'}
                </TableCell>
              </TableRow>
            )}
            {rows.map((p) => {
              const state = getPostState(p)
              return (
                <TableRow key={p.slug}>
                  <TableCell className="pl-4">
                    <Link href={`/admin/blog/${p.slug}`} className="flex items-center gap-3">
                      <span className="relative h-11 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image src={p.coverImage || '/placeholder.svg'} alt="" fill sizes="56px" className="object-cover" />
                      </span>
                      <span className="min-w-0">
                        <span className="block max-w-64 truncate font-medium hover:underline">{p.title}</span>
                        <span className="block max-w-64 truncate text-xs text-muted-foreground">/blog/{p.slug}</span>
                      </span>
                    </Link>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">{p.category}</TableCell>
                  <TableCell className="hidden whitespace-nowrap md:table-cell">{formatPostDate(p.publishedAt)}</TableCell>
                  <TableCell>
                    {stateBadge[state]}
                  </TableCell>
                  <TableCell className="pr-4 text-right">
                    <PostRowActions
                      slug={p.slug}
                      title={p.title}
                      published={p.status === 'published'}
                      featured={p.featured}
                    />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
