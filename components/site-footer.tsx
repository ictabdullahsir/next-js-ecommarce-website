import Link from 'next/link'

const columns = [
  {
    title: 'Shop',
    links: [
      { href: '/shop/men', label: 'Men' },
      { href: '/shop/women', label: 'Women' },
      { href: '/shop/kids', label: 'Kids' },
      { href: '/shop', label: 'All Products' },
    ],
  },
  {
    title: 'Help',
    links: [
      { href: '/cart', label: 'Shopping Bag' },
      { href: '/', label: 'Shipping & Returns' },
      { href: '/', label: 'Size Guide' },
      { href: '/', label: 'Contact' },
    ],
  },
]

export function SiteFooter({ tagline, blogLabel }: { tagline: string; blogLabel?: string }) {
  const visibleColumns = blogLabel
    ? [...columns, { title: 'Discover', links: [{ href: '/blog', label: blogLabel }] }]
    : columns
  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 md:flex-row md:justify-between md:px-6">
        <div className="max-w-xs">
          <p className="font-serif text-2xl font-semibold">LOOM</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {tagline}
          </p>
        </div>
        <div className="flex gap-16">
          {visibleColumns.map((col) => (
            <div key={col.title}>
              <h2 className="text-sm font-semibold">{col.title}</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      href={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border px-4 py-6 text-center text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} LOOM. All rights reserved.
      </div>
    </footer>
  )
}
