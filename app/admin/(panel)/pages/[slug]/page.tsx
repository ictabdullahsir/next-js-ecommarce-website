import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { PageForm } from '@/components/admin/page-form'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Edit Page' }

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const page = (await getStore()).pages.find((p) => p.slug === slug)
  if (!page) notFound()
  return (
    <>
      <AdminPageHeader title={page.title} />
      <PageForm key={page.slug} page={page} />
    </>
  )
}
