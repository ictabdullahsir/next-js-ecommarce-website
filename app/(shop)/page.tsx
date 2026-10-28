import { Hero } from '@/components/home/hero'
import { CategoryGrid } from '@/components/home/category-grid'
import { FeaturedProducts } from '@/components/home/featured-products'
import { LatestPosts } from '@/components/home/latest-posts'
import { Perks } from '@/components/home/perks'
import { isPostLive, sortPostsByDate } from '@/lib/blog'
import { getStore } from '@/lib/store'

export default async function HomePage() {
  const { content, categories, products, posts, blog } = await getStore()
  const published = products.filter((p) => p.published)
  const latestPosts = blog.enabled && blog.showOnHome ? sortPostsByDate(posts.filter(isPostLive)).slice(0, 3) : []
  return (
    <>
      <Hero content={content} />
      <CategoryGrid heading={content.categoriesHeading} categories={categories} />
      <FeaturedProducts
        heading={content.featuredHeading}
        categories={categories}
        products={published}
      />
      <LatestPosts heading={blog.homeHeading} posts={latestPosts} />
      <Perks perks={content.perks} />
    </>
  )
}
