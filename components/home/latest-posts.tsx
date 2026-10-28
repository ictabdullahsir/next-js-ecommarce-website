import Link from 'next/link'
import { PostCard } from '@/components/blog/post-card'
import type { BlogPost } from '@/lib/blog'

export function LatestPosts({ heading, posts }: { heading: string; posts: BlogPost[] }) {
  if (posts.length === 0) return null
  return (
    <section className="py-20" aria-labelledby="latest-posts-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="latest-posts-heading" className="font-serif text-3xl md:text-4xl">
            {heading}
          </h2>
          <Link href="/blog" className="text-sm underline underline-offset-4 hover:text-primary">
            Read all stories
          </Link>
        </div>
        <div className="mt-10 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
