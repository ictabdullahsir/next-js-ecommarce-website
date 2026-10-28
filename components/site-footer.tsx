import Link from 'next/link'
import type { Settings } from '@/lib/products'

export function SiteFooter({
  tagline,
  columns,
  settings,
}: {
  tagline: string
  columns: { title: string; links: { label: string; href: string }[] }[]
  settings: Settings
}) {
  return (
    <footer className="mt-24 border-t border-border bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-14 md:flex-row md:justify-between md:px-6">
        <div className="max-w-xs">
          <p className="font-serif text-2xl font-semibold">{settings.storeName}</p>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {tagline}
          </p>
          <ul className="mt-4 flex flex-col gap-1 text-sm text-muted-foreground">
            {settings.email && <li>{settings.email}</li>}
            {settings.phone && <li>{settings.phone}</li>}
            {settings.address && <li>{settings.address}</li>}
            {settings.instagram && (
              <li>
                <a href={settings.instagram} className="hover:text-foreground">
                  Instagram
                </a>
              </li>
            )}
            {settings.facebook && (
              <li>
                <a href={settings.facebook} className="hover:text-foreground">
                  Facebook
                </a>
              </li>
            )}
          </ul>
        </div>
        <div className="flex gap-16">
          {columns.map((col) => (
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
        &copy; {new Date().getFullYear()} {settings.storeName}. All rights reserved.
      </div>
    </footer>
  )
}
