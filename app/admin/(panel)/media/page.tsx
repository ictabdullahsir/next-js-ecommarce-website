import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { MediaManager } from '@/components/admin/media-manager'
import { getImageLibrary } from '@/lib/store'

export const metadata = { title: 'Media' }

export default async function MediaPage() {
  const images = (await getImageLibrary()).sort((a, b) => Number(b.startsWith('/uploads/')) - Number(a.startsWith('/uploads/')))
  return (
    <>
      <AdminPageHeader title="Media" description="Upload images and reuse them on products, categories and the homepage." />
      <MediaManager images={images} />
    </>
  )
}
