import Image from 'next/image'
import Link from 'next/link'
import { formatPostDate, readingTime, type BlogPost } from '@/lib/blog'
import { cn } from '@/lib/utils'

export function PostMeta({ post, className }: { post: BlogPost; className?: string }) {
  return (
    <p className={cn('flex flex-wrap items-center gap-x-2 text-xs uppercase tracking-widest text-muted-foreground', className)}>
      <span className="text-primary">{post.category}</span>
      <span aria-hidden="true">&middot;</span>
      <time dateTime={post.publishedAt}>{formatPostDate(post.publishedAt)}</time>
      <span aria-hidden="true">&middot;</span>
      <span>{readingTime(post.content)} min read</span>
    </p>
  )
}

export function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
          <Image
            src={post.coverImage || '/placeholder.svg'}
            alt={post.coverAlt}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <PostMeta post={post} className="mt-5" />
        <h3 className="mt-3 text-balance font-serif text-2xl leading-snug group-hover:text-primary">
          {post.title}
        </h3>
        {post.excerpt && (
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
        )}
      </Link>
    </article>
  )
}

export function FeaturedPostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group">
      <Link href={`/blog/${post.slug}`} className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-secondary">
          <Image
            src={post.coverImage || '/placeholder.svg'}
            alt={post.coverAlt}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div>
          <span className="rounded-full bg-foreground px-3 py-1 text-xs text-background">Featured</span>
          <PostMeta post={post} className="mt-5" />
          <h2 className="mt-3 text-balance font-serif text-3xl leading-tight group-hover:text-primary md:text-4xl">
            {post.title}
          </h2>
          {post.excerpt && <p className="mt-4 leading-relaxed text-muted-foreground">{post.excerpt}</p>}
          <p className="mt-6 text-sm font-medium underline underline-offset-4">Read the story</p>
        </div>
      </Link>
    </article>
  )
}
