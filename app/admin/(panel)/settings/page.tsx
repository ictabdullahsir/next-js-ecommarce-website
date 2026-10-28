import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { SettingsForm } from '@/components/admin/settings-form'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Settings' }

export default async function SettingsPage() {
  const { settings } = await getStore()
  return (
    <>
      <AdminPageHeader title="Settings" description="Store details, contact info and shipping rules." />
      <SettingsForm settings={settings} />
    </>
  )
}
