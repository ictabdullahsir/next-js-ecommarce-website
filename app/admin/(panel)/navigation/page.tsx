import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { NavigationForm } from '@/components/admin/navigation-form'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Navigation' }

export default async function NavigationPage() {
  const { nav } = await getStore()
  return (
    <>
      <AdminPageHeader title="Navigation" description="Control the links in your header and footer." />
      <NavigationForm header={nav.header} footer={nav.footer} />
    </>
  )
}
