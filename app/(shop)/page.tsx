import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { Perks } from '@/components/home/perks'
import { getStore } from '@/lib/store'

export default async function HomePage() {
  const { content, categories, products } = await getStore()
  const published = products.filter((p) => p.published)
  return (
    <>
      <Hero content={content} />
      <CategoryGrid heading={content.categoriesHeading} categories={categories} />
      <FeaturedProducts
        heading={content.featuredHeading}
        categories={categories}
        products={published}
      />
      <Perks perks={content.perks} />
    </>
  )
}
