import Image from 'next/image'
import Link from 'next/link'
import { formatPrice, type Product } from '@/lib/products'

export function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.slug}`} className="group flex flex-col gap-3">
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary">
        <Image
          src={product.image || '/placeholder.svg'}
          alt={product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {product.isNew && (
            <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-medium">
              New
            </span>
          )}
          {product.compareAt && (
            <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-medium text-primary-foreground">
              Sale
            </span>
          )}
        </div>
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium">{product.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{product.type}</p>
        </div>
        <div className="text-right text-sm">
          <span className="font-medium">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="ml-1.5 text-xs text-muted-foreground line-through">
              {formatPrice(product.compareAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
