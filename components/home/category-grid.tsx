import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import type { Category } from '@/lib/products'

export function CategoryGrid({ heading, categories }: { heading: string; categories: Category[] }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 md:px-6" aria-labelledby="categories-heading">
      <h2 id="categories-heading" className="font-serif text-3xl md:text-4xl">
        {heading}
      </h2>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/shop/${cat.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary"
          >
            <Image
              src={cat.image || '/placeholder.svg'}
              alt={`${cat.name} collection`}
              fill
              sizes="(min-width: 768px) 33vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-6 text-background">
              <div>
                <h3 className="font-serif text-3xl">{cat.name}</h3>
                <p className="mt-1 text-sm text-background/80">{cat.tagline}</p>
              </div>
              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-background text-foreground transition-transform group-hover:translate-x-1">
                <ArrowRight className="size-4" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
