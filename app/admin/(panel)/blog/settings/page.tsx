import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { BlogSettingsForm } from '@/components/admin/blog-settings-form'
import { getBlogSettings } from '@/lib/store'

export const metadata = { title: 'Blog Settings' }

export default async function BlogSettingsPage() {
  const settings = await getBlogSettings()
  return (
    <>
      <AdminPageHeader title="Blog settings" description="Control how and where the blog appears in your store." />
      <BlogSettingsForm settings={settings} />
    </>
  )
}
