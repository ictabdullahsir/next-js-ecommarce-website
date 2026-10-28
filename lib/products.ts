export type CategorySlug = string

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
  /** Units in stock. Leave undefined for unlimited. */
  stock?: number
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

export type NavLink = { label: string; href: string }
export type FooterColumn = { title: string; links: NavLink[] }

export type Coupon = {
  code: string
  type: 'percent' | 'fixed'
  value: number
  minSubtotal?: number
  maxUses?: number
  used: number
  expiresAt?: string
  active: boolean
}

export type CmsPage = {
  slug: string
  title: string
  content: string
  seoDescription?: string
  published: boolean
}

export type Settings = {
  storeName: string
  email: string
  phone: string
  address: string
  instagram: string
  facebook: string
  shippingFee: number
  freeShippingThreshold: number
}

export type Store = {
  categories: Category[]
  products: Product[]
  content: SiteContent
  coupons: Coupon[]
  pages: CmsPage[]
  settings: Settings
  nav: { header: NavLink[]; footer: FooterColumn[] }
}

export function isCategorySlug(value: string) {
  return /^[a-z0-9-]{1,40}$/.test(value)
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
