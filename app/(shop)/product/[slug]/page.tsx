import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronRight, RotateCcw, Truck } from 'lucide-react'
import { AddToCart } from '@/components/add-to-cart'
import { ProductCard } from '@/components/product-card'
import { formatPrice } from '@/lib/products'
import { getCategory, getProduct, getPublishedProducts } from '@/lib/store'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) return {}
  return { title: product.name, description: product.description }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  const product = await getProduct(slug)
  if (!product) notFound()
  const category = (await getCategory(product.category)) ?? {
    slug: product.category,
    name: product.category,
  }
  const related = (await getPublishedProducts(product.category))
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 4)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <nav aria-label="Breadcrumb" className="py-6">
        <ol className="flex items-center gap-1 text-xs text-muted-foreground">
          <li className="flex items-center gap-1">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <ChevronRight className="size-3" />
          </li>
          <li className="flex items-center gap-1">
            <Link href={`/shop/${category.slug}`} className="hover:text-foreground">
              {category.name}
            </Link>
            <ChevronRight className="size-3" />
          </li>
          <li aria-current="page" className="text-foreground">
            {product.name}
          </li>
        </ol>
      </nav>

      <div className="flex flex-col gap-10 md:flex-row md:gap-14">
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-secondary md:w-1/2">
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>

        <div className="flex flex-col md:w-1/2 md:py-4">
          <p className="text-sm uppercase tracking-widest text-muted-foreground">
            {category.name} &middot; {product.type}
          </p>
          <h1 className="mt-3 font-serif text-4xl">{product.name}</h1>
          <p className="mt-4 text-2xl">
            {formatPrice(product.price)}
            {product.compareAt && (
              <span className="ml-3 text-base text-muted-foreground line-through">
                {formatPrice(product.compareAt)}
              </span>
            )}
          </p>
          <p className="mt-6 leading-relaxed text-muted-foreground">{product.description}</p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          <ul className="mt-8 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground">
            <li className="flex items-center gap-3">
              <Truck className="size-4 text-foreground" /> Free shipping on orders over $100
            </li>
            <li className="flex items-center gap-3">
              <RotateCcw className="size-4 text-foreground" /> Free returns within 30 days
            </li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-24" aria-labelledby="related-heading">
          <h2 id="related-heading" className="font-serif text-3xl">
            You may also like
          </h2>
          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
