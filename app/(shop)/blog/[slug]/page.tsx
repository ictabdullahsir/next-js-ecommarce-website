import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, Eye } from 'lucide-react'
import { Markdown } from '@/components/blog/markdown'
import { PostCard, PostMeta } from '@/components/blog/post-card'
import { isAdmin } from '@/lib/admin-auth'
import { getPostState } from '@/lib/blog'
import { getBlogSettings, getLivePosts, getPost } from '@/lib/store'

type Props = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ preview?: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  const description = post.seoDescription || post.excerpt
  return {
    title: post.seoTitle || post.title,
    description,
    openGraph: {
      type: 'article',
      title: post.seoTitle || post.title,
      description,
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [{ url: post.coverImage, alt: post.coverAlt }],
    },
  }
}

export default async function BlogPostPage({ params, searchParams }: Props) {
  const [{ slug }, { preview }, blog] = await Promise.all([params, searchParams, getBlogSettings()])
  const canPreview = preview === '1' && (await isAdmin())
  if (!blog.enabled && !canPreview) notFound()

  const post = await getPost(slug, { includeDrafts: canPreview })
  if (!post) notFound()

  const state = getPostState(post)
  const related = (await getLivePosts())
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => {
      const shared = (p: typeof a) => p.tags.filter((t) => post.tags.includes(t)).length
      return shared(b) - shared(a)
    })
    .slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      {state !== 'published' && (
        <div
          role="status"
          className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-3 text-sm"
        >
          <Eye className="size-4" /> Preview mode — this post is a {state} and isn&apos;t visible to customers.
        </div>
      )}

      <article>
        <header className="mx-auto max-w-3xl pt-8 md:pt-12">
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-1 text-xs text-muted-foreground">
              <li className="flex items-center gap-1">
                <Link href="/" className="hover:text-foreground">
                  Home
                </Link>
                <ChevronRight className="size-3" />
              </li>
              <li className="flex items-center gap-1">
                <Link href="/blog" className="hover:text-foreground">
                  {blog.title}
                </Link>
                <ChevronRight className="size-3" />
              </li>
              <li aria-current="page" className="max-w-48 truncate text-foreground">
                {post.title}
              </li>
            </ol>
          </nav>
          <PostMeta post={post} className="mt-8" />
          <h1 className="mt-4 text-balance font-serif text-4xl leading-tight md:text-5xl">{post.title}</h1>
          {post.excerpt && (
            <p className="mt-5 text-pretty text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
          <p className="mt-6 text-sm">
            By <span className="font-medium">{post.author}</span>
          </p>
        </header>

        <div className="relative mx-auto mt-10 aspect-[16/9] max-w-5xl overflow-hidden rounded-xl bg-secondary">
          <Image
            src={post.coverImage || '/placeholder.svg'}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 1024px) 1024px, 100vw"
            className="object-cover"
          />
        </div>

        <div className="mx-auto mt-12 max-w-2xl text-lg">
          <Markdown content={post.content} />

          {post.tags.length > 0 && (
            <ul className="mt-12 flex flex-wrap gap-2 border-t border-border pt-8" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag}>
                  <Link
                    href={`/blog?tag=${encodeURIComponent(tag)}`}
                    className="rounded-full border border-border px-3 py-1 text-sm capitalize hover:border-foreground/40"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </article>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-posts-heading">
          <div className="flex items-end justify-between gap-4">
            <h2 id="related-posts-heading" className="font-serif text-3xl">
              Keep reading
            </h2>
            <Link href="/blog" className="text-sm underline underline-offset-4 hover:text-primary">
              All stories
            </Link>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
