'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ExternalLink, FileText, LayoutDashboard, LayoutGrid, LogOut, Newspaper, Shirt } from 'lucide-react'
import { logout } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

const links = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Shirt },
  { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/admin/blog', label: 'Blog', icon: Newspaper },
  { href: '/admin/content', label: 'Site Content', icon: FileText },
]

export function AdminNav() {
  const pathname = usePathname()
  const isActive = (href: string) =>
    href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)

  return (
    <aside className="sticky top-0 z-30 flex shrink-0 flex-col border-b border-border bg-background md:h-dvh md:w-60 md:border-b-0 md:border-r">
      <div className="flex h-14 items-center justify-between px-4 md:h-16 md:px-5">
        <Link href="/admin" className="flex items-baseline gap-2">
          <span className="font-serif text-xl font-semibold tracking-tight">LOOM</span>
          <span className="text-xs uppercase tracking-widest text-muted-foreground">Admin</span>
        </Link>
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground md:hidden"
        >
          View store <ExternalLink className="size-3" />
        </Link>
      </div>

      <nav aria-label="Admin" className="overflow-x-auto px-2 pb-2 md:flex-1 md:px-3 md:pb-0">
        <ul className="flex gap-1 md:flex-col">
          {links.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive(href) ? 'page' : undefined}
                className={cn(
                  'flex items-center gap-3 whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors',
                  isActive(href)
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="hidden flex-col gap-1 border-t border-border p-3 md:flex">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <ExternalLink className="size-4" /> View store
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
          >
            <LogOut className="size-4" /> Sign out
          </button>
        </form>
      </div>
    </aside>
  )
}
