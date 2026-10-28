import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/admin/login-form'
import { isAdmin } from '@/lib/admin-auth'

export const metadata: Metadata = {
  title: 'Admin Sign In',
  robots: { index: false, follow: false },
}

export default async function LoginPage() {
  if (await isAdmin()) redirect('/admin')
  const usingDefault = !process.env.ADMIN_PASSWORD

  return (
    <main className="flex min-h-dvh items-center justify-center bg-secondary px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <Link href="/" className="font-serif text-3xl font-semibold tracking-tight">
            LOOM
          </Link>
          <p className="mt-2 text-sm text-muted-foreground">Content management</p>
        </div>
        <div className="mt-8 rounded-xl border border-border bg-background p-6 shadow-sm">
          <h1 className="text-lg font-semibold">Sign in to admin</h1>
          <p className="mt-1 text-sm text-muted-foreground">Enter the admin password to continue.</p>
          <LoginForm />
          {usingDefault && (
            <p className="mt-5 rounded-md bg-accent px-3 py-2 text-xs text-accent-foreground">
              Demo password: <code className="font-mono font-semibold">admin123</code>. Set an{' '}
              <code className="font-mono">ADMIN_PASSWORD</code> variable to change it.
            </p>
          )}
        </div>
      </div>
    </main>
  )
}
