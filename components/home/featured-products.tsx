import Link from 'next/link'
import { ProductCard } from '@/components/product-card'
import type { Category, Product } from '@/lib/products'

type Props = { heading: string; categories: Category[]; products: Product[] }

export function FeaturedProducts({ heading, categories, products }: Props) {
  return (
    <section className="bg-secondary py-20" aria-labelledby="featured-heading">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <h2 id="featured-heading" className="font-serif text-3xl md:text-4xl">
          {heading}
        </h2>
        <div className="mt-10 flex flex-col gap-16">
          {categories.map((cat) => {
            const items = products.filter((p) => p.category === cat.slug).slice(0, 4)
            if (items.length === 0) return null
            return (
              <div key={cat.slug}>
                <div className="mb-6 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{cat.name}</h3>
                  <Link
                    href={`/shop/${cat.slug}`}
                    className="text-sm underline underline-offset-4 hover:text-primary"
                  >
                    View all {cat.name.toLowerCase()}
                  </Link>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
                  {items.map((p) => (
                    <ProductCard key={p.slug} product={p} />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
