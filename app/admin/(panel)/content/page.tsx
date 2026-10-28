import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ContentForm } from '@/components/admin/content-form'
import { getContent, getImageLibrary } from '@/lib/store'

export const metadata = { title: 'Site Content' }

export default async function ContentPage() {
  const [content, library] = await Promise.all([getContent(), getImageLibrary()])
  return (
    <>
      <AdminPageHeader
        title="Site content"
        description="Edit the announcement bar, homepage sections and footer."
      />
      <ContentForm content={content} library={library} />
    </>
  )
}
