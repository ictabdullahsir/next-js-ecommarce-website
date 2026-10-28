'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { Menu, ShoppingBag, X } from 'lucide-react'
import { useCart } from '@/components/cart-provider'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/shop/men', label: 'Men' },
  { href: '/shop/women', label: 'Women' },
  { href: '/shop/kids', label: 'Kids' },
  { href: '/shop', label: 'Shop All' },
]

export function SiteHeader({ announcement, blogLabel }: { announcement: string; blogLabel?: string }) {
  const pathname = usePathname()
  const { count } = useCart()
  const [open, setOpen] = useState(false)
  const items = blogLabel ? [...nav, { href: '/blog', label: blogLabel }] : nav
  const isActive = (href: string) => pathname === href || (href === '/blog' && pathname.startsWith('/blog/'))

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      {announcement && (
        <div className="bg-foreground px-4 py-2 text-center text-xs tracking-wide text-background">
          {announcement}
        </div>
      )}
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 md:px-6">
        <button
          type="button"
          className="-ml-2 p-2 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        <Link href="/" className="font-serif text-2xl font-semibold tracking-tight">
          LOOM
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'text-sm transition-colors hover:text-foreground',
                isActive(item.href) ? 'font-medium text-foreground' : 'text-muted-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/cart"
          className="relative -mr-2 p-2"
          aria-label={`Shopping bag, ${count} ${count === 1 ? 'item' : 'items'}`}
        >
          <ShoppingBag className="size-5" />
          {count > 0 && (
            <span className="absolute right-0 top-0 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
              {count}
            </span>
          )}
        </Link>
      </div>

      {open && (
        <nav aria-label="Mobile" className="border-t border-border md:hidden">
          <ul className="flex flex-col px-4 py-2">
            {items.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
