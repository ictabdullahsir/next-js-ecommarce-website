import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { PostForm } from '@/components/admin/post-form'
import { getImageLibrary, getStore } from '@/lib/store'

export const metadata = { title: 'New Post' }

export default async function NewPostPage() {
  const [{ posts }, library] = await Promise.all([getStore(), getImageLibrary()])
  const categories = [...new Set(posts.map((p) => p.category))].sort()
  return (
    <>
      <AdminPageHeader title="New post" description="Write a new story for your journal." />
      <PostForm library={library} categories={categories} />
    </>
  )
}
