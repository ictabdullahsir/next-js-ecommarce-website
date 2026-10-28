import type { Metadata } from 'next'
import { AdminNav } from '@/components/admin/admin-nav'
import { requireAdmin } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: { default: 'Admin', template: '%s · Admin | LOOM' },
  robots: { index: false, follow: false },
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="flex min-h-dvh flex-col bg-secondary md:flex-row">
      <AdminNav />
      <main className="min-w-0 flex-1 px-4 py-6 md:px-10 md:py-10">
        <div className="mx-auto max-w-5xl">{children}</div>
      </main>
    </div>
  )
}
