import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

type Crumb = { href: string; label: string }

export function PageHeading({
  crumbs,
  title,
  description,
}: {
  crumbs: Crumb[]
  title: string
  description?: string
}) {
  return (
    <div className="py-10 md:py-14">
      <nav aria-label="Breadcrumb">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground">
          {crumbs.map((c) => (
            <li key={c.href} className="flex items-center gap-1">
              <Link href={c.href} className="hover:text-foreground">
                {c.label}
              </Link>
              <ChevronRight className="size-3" />
            </li>
          ))}
          <li aria-current="page" className="text-foreground">
            {title}
          </li>
        </ol>
      </nav>
      <h1 className="mt-4 font-serif text-4xl md:text-5xl">{title}</h1>
      {description && <p className="mt-3 text-muted-foreground">{description}</p>}
    </div>
  )
}
