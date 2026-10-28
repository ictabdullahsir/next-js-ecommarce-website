import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { PageForm } from '@/components/admin/page-form'

export const metadata = { title: 'New Page' }

export default function NewPage() {
  return (
    <>
      <AdminPageHeader title="New page" />
      <PageForm />
    </>
  )
}
