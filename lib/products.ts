import type { BlogPost, BlogSettings } from '@/lib/blog'

export const CATEGORY_SLUGS = ['men', 'women', 'kids'] as const
export type CategorySlug = (typeof CATEGORY_SLUGS)[number]

export type Category = {
  slug: CategorySlug
  name: string
  tagline: string
  image: string
}

export type Product = {
  slug: string
  name: string
  category: CategorySlug
  type: string
  price: number
  compareAt?: number
  image: string
  description: string
  sizes: string[]
  colors: string[]
  isNew?: boolean
  published: boolean
}

export type Perk = { title: string; text: string }

export type SiteContent = {
  announcement: string
  heroEyebrow: string
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroPrimaryLabel: string
  heroSecondaryLabel: string
  heroSecondaryHref: string
  categoriesHeading: string
  featuredHeading: string
  perks: Perk[]
  footerTagline: string
}

export type Store = {
  categories: Category[]
  products: Product[]
  content: SiteContent
  posts: BlogPost[]
  blog: BlogSettings
}

export function isCategorySlug(value: string): value is CategorySlug {
  return (CATEGORY_SLUGS as readonly string[]).includes(value)
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
