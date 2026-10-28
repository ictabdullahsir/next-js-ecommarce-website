'use client'

import { useMemo, useState } from 'react'
import { ProductCard } from '@/components/product-card'
import type { Product } from '@/lib/products'
import { cn } from '@/lib/utils'

type Sort = 'featured' | 'price-asc' | 'price-desc'

export function ProductBrowser({ products }: { products: Product[] }) {
  const types = useMemo(() => ['All', ...new Set(products.map((p) => p.type))], [products])
  const [type, setType] = useState('All')
  const [sort, setSort] = useState<Sort>('featured')

  const visible = useMemo(() => {
    const list = type === 'All' ? products : products.filter((p) => p.type === type)
    if (sort === 'price-asc') return [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') return [...list].sort((a, b) => b.price - a.price)
    return list
  }, [products, type, sort])

  return (
    <div>
      <div className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
          {types.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              aria-pressed={type === t}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm transition-colors',
                type === t
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-sm text-foreground"
          >
            <option value="featured">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </label>
      </div>

      <p className="mt-6 text-sm text-muted-foreground">
        {visible.length} {visible.length === 1 ? 'product' : 'products'}
      </p>
      <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
        {visible.map((p) => (
          <ProductCard key={p.slug} product={p} />
        ))}
      </div>
    </div>
  )
}
