import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ProductBrowser } from '@/components/product-browser'
import { PageHeading } from '@/components/page-heading'
import { getCategory, getPublishedProducts } from '@/lib/store'

type Props = { params: Promise<{ category: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await getCategory(category)
  if (!cat) return {}
  return { title: `${cat.name}'s Clothing`, description: cat.tagline }
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params
  const cat = await getCategory(category)
  if (!cat) notFound()
  const products = await getPublishedProducts(cat.slug)

  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <PageHeading
        crumbs={[
          { href: '/', label: 'Home' },
          { href: '/shop', label: 'Shop' },
        ]}
        title={cat.name}
        description={cat.tagline}
      />
      <ProductBrowser products={products} />
    </div>
  )
}
