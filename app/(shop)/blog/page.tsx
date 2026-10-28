import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { PageHeading } from '@/components/page-heading'
import { FeaturedPostCard, PostCard } from '@/components/blog/post-card'
import { getBlogSettings, getLivePosts } from '@/lib/store'
import { cn } from '@/lib/utils'

type Props = { searchParams: Promise<{ tag?: string; page?: string }> }

export async function generateMetadata(): Promise<Metadata> {
  const blog = await getBlogSettings()
  return { title: blog.title, description: blog.description }
}

function buildHref(tag?: string, page?: number) {
  const params = new URLSearchParams()
  if (tag) params.set('tag', tag)
  if (page && page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `/blog?${query}` : '/blog'
}

export default async function BlogPage({ searchParams }: Props) {
  const [{ tag, page }, blog, allPosts] = await Promise.all([searchParams, getBlogSettings(), getLivePosts()])
  if (!blog.enabled) notFound()

  const tags = [...new Set(allPosts.flatMap((p) => p.tags))].sort()
  const activeTag = tag && tags.includes(tag) ? tag : undefined
  const filtered = activeTag ? allPosts.filter((p) => p.tags.includes(activeTag)) : allPosts

  const currentPage = Math.max(1, Math.floor(Number(page) || 1))
  const showFeatured = !activeTag && currentPage === 1
  const featured = showFeatured ? (filtered.find((p) => p.featured) ?? filtered[0]) : undefined
  const rest = featured ? filtered.filter((p) => p.slug !== featured.slug) : filtered

  const totalPages = Math.max(1, Math.ceil(rest.length / blog.postsPerPage))
  const pagePosts = rest.slice((currentPage - 1) * blog.postsPerPage, currentPage * blog.postsPerPage)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <PageHeading crumbs={[{ href: '/', label: 'Home' }]} title={blog.title} description={blog.description} />

      {tags.length > 0 && (
        <nav aria-label="Filter by topic" className="mb-12 flex flex-wrap gap-2">
          {[undefined, ...tags].map((t) => {
            const active = t === activeTag
            return (
              <Link
                key={t ?? 'all'}
                href={buildHref(t)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-full border px-4 py-1.5 text-sm capitalize transition-colors',
                  active
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground/40',
                )}
              >
                {t ?? 'All stories'}
              </Link>
            )
          })}
        </nav>
      )}

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-muted-foreground">No stories published yet. Check back soon.</p>
      ) : (
        <>
          {featured && (
            <div className="mb-16 border-b border-border pb-16">
              <FeaturedPostCard post={featured} />
            </div>
          )}

          {pagePosts.length > 0 && (
            <div className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {pagePosts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav aria-label="Pagination" className="mt-16 flex items-center justify-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={buildHref(activeTag, n)}
                  aria-current={n === currentPage ? 'page' : undefined}
                  className={cn(
                    'flex size-10 items-center justify-center rounded-full border text-sm',
                    n === currentPage
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border hover:border-foreground/40',
                  )}
                >
                  {n}
                </Link>
              ))}
            </nav>
          )}
        </>
      )}
    </div>
  )
}
