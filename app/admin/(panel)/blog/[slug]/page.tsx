import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { PostForm } from '@/components/admin/post-form'
import { getPostState } from '@/lib/blog'
import { getImageLibrary, getStore } from '@/lib/store'

export const metadata = { title: 'Edit Post' }

type Props = { params: Promise<{ slug: string }> }

export default async function EditPostPage({ params }: Props) {
  const { slug } = await params
  const [{ posts }, library] = await Promise.all([getStore(), getImageLibrary()])
  const post = posts.find((p) => p.slug === slug)
  if (!post) notFound()

  const categories = [...new Set(posts.map((p) => p.category))].sort()
  const live = getPostState(post) === 'published'

  return (
    <>
      <AdminPageHeader
        title={post.title}
        description="Edit the story, cover image, and publishing options."
        action={
          <Link
            href={live ? `/blog/${post.slug}` : `/blog/${post.slug}?preview=1`}
            target="_blank"
            className={buttonVariants({ variant: 'outline', className: 'h-10 px-4' })}
          >
            {live ? 'View post' : 'Preview'} <ExternalLink className="size-4" />
          </Link>
        }
      />
      <PostForm key={post.slug} post={post} library={library} categories={categories} />
    </>
  )
}
