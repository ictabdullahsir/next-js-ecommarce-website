import type { Metadata } from 'next'
import { ProductBrowser } from '@/components/product-browser'
import { PageHeading } from '@/components/page-heading'
import { getPublishedProducts } from '@/lib/store'

export const metadata: Metadata = {
  title: 'Shop All',
  description: 'Browse the full LOOM collection for men, women and kids.',
}

export default async function ShopPage() {
  const products = await getPublishedProducts()
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <PageHeading
        crumbs={[{ href: '/', label: 'Home' }]}
        title="Shop All"
        description="The complete collection for the whole family."
      />
      <ProductBrowser products={products} />
    </div>
  )
}
