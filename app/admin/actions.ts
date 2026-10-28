'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ADMIN_PASSWORD, requireAdmin } from '@/lib/admin-auth'
import { SESSION_COOKIE, SESSION_TTL_MS, createSessionToken, safeEqual } from '@/lib/admin-session'
import { isCategorySlug, slugify, type Product, type SiteContent } from '@/lib/products'
import { getStore, saveStore } from '@/lib/store'

export type FormState = { error?: string; success?: string } | null

const text = (formData: FormData, key: string, max = 500) =>
  String(formData.get(key) ?? '')
    .trim()
    .slice(0, max)

const list = (formData: FormData, key: string) =>
  text(formData, key, 1000)
    .split(',')
    .map((v) => v.trim())
    .filter(Boolean)
    .slice(0, 30)

const isSafeImagePath = (value: string) => /^(\/[\w\-./]+|https:\/\/[^\s"'<>]+)$/.test(value)
const isSafeHref = (value: string) => /^\/[\w\-./?=&]*$/.test(value)

function refreshSite() {
  revalidatePath('/', 'layout')
}

export async function login(_prev: FormState, formData: FormData): Promise<FormState> {
  const password = text(formData, 'password', 200)
  if (!password || !safeEqual(password, ADMIN_PASSWORD)) {
    return { error: 'Incorrect password.' }
  }
  const cookieStore = await cookies()
  const isProd = process.env.NODE_ENV === 'production'
  cookieStore.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true,
    secure: true,
    sameSite: isProd ? 'lax' : 'none',
    path: '/',
    maxAge: SESSION_TTL_MS / 1000,
  })
  redirect('/admin')
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

export async function saveProduct(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()

  const originalSlug = text(formData, 'originalSlug', 120)
  const name = text(formData, 'name', 120)
  const slug = slugify(text(formData, 'slug', 120) || name)
  const category = text(formData, 'category', 20)
  const type = text(formData, 'type', 60)
  const description = text(formData, 'description', 2000)
  const image = text(formData, 'image', 500)
  const price = Number(text(formData, 'price', 20))
  const compareAtRaw = text(formData, 'compareAt', 20)
  const compareAt = compareAtRaw ? Number(compareAtRaw) : undefined
  const sizes = list(formData, 'sizes')
  const colors = list(formData, 'colors')

  if (!name) return { error: 'Name is required.' }
  if (!slug) return { error: 'A valid URL slug is required.' }
  if (!isCategorySlug(category)) return { error: 'Choose a valid category.' }
  if (!type) return { error: 'Product type is required.' }
  if (!Number.isFinite(price) || price <= 0 || price > 100000) {
    return { error: 'Price must be a positive number.' }
  }
  if (compareAt !== undefined && (!Number.isFinite(compareAt) || compareAt <= price)) {
    return { error: 'Compare-at price must be higher than the price.' }
  }
  if (!image || !isSafeImagePath(image)) return { error: 'Choose a valid image.' }
  if (sizes.length === 0) return { error: 'Add at least one size.' }
  if (colors.length === 0) return { error: 'Add at least one color.' }

  const store = await getStore()
  if (store.products.some((p) => p.slug === slug && p.slug !== originalSlug)) {
    return { error: `Another product already uses the slug "${slug}".` }
  }

  const product: Product = {
    slug,
    name,
    category,
    type,
    price,
    compareAt,
    image,
    description,
    sizes,
    colors,
    isNew: formData.get('isNew') === 'on',
    published: formData.get('published') === 'on',
  }

  const index = originalSlug ? store.products.findIndex((p) => p.slug === originalSlug) : -1
  if (index >= 0) store.products[index] = product
  else store.products.unshift(product)

  await saveStore(store)
  refreshSite()
  redirect('/admin/products')
}

export async function deleteProduct(slug: string) {
  await requireAdmin()
  const store = await getStore()
  store.products = store.products.filter((p) => p.slug !== slug)
  await saveStore(store)
  refreshSite()
}

export async function toggleProductPublished(slug: string) {
  await requireAdmin()
  const store = await getStore()
  const product = store.products.find((p) => p.slug === slug)
  if (!product) return
  product.published = !product.published
  await saveStore(store)
  refreshSite()
}

export async function saveCategory(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const slug = text(formData, 'slug', 20)
  const name = text(formData, 'name', 60)
  const tagline = text(formData, 'tagline', 200)
  const image = text(formData, 'image', 500)

  if (!isCategorySlug(slug)) return { error: 'Unknown category.' }
  if (!name) return { error: 'Name is required.' }
  if (!image || !isSafeImagePath(image)) return { error: 'Choose a valid image.' }

  const store = await getStore()
  store.categories = store.categories.map((c) => (c.slug === slug ? { slug, name, tagline, image } : c))
  await saveStore(store)
  refreshSite()
  return { success: `${name} saved.` }
}

export async function saveContent(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const heroImage = text(formData, 'heroImage', 500)
  const heroSecondaryHref = text(formData, 'heroSecondaryHref', 200) || '/shop'

  if (!heroImage || !isSafeImagePath(heroImage)) return { error: 'Choose a valid hero image.' }
  if (!isSafeHref(heroSecondaryHref)) {
    return { error: 'Secondary button link must be a site path like /shop/kids.' }
  }

  const content: SiteContent = {
    announcement: text(formData, 'announcement', 200),
    heroEyebrow: text(formData, 'heroEyebrow', 100),
    heroTitle: text(formData, 'heroTitle', 160) || 'Welcome',
    heroSubtitle: text(formData, 'heroSubtitle', 300),
    heroImage,
    heroPrimaryLabel: text(formData, 'heroPrimaryLabel', 40) || 'Shop now',
    heroSecondaryLabel: text(formData, 'heroSecondaryLabel', 40),
    heroSecondaryHref,
    categoriesHeading: text(formData, 'categoriesHeading', 100),
    featuredHeading: text(formData, 'featuredHeading', 100),
    perks: [0, 1, 2, 3].map((i) => ({
      title: text(formData, `perkTitle${i}`, 60),
      text: text(formData, `perkText${i}`, 160),
    })),
    footerTagline: text(formData, 'footerTagline', 300),
  }

  const store = await getStore()
  store.content = content
  await saveStore(store)
  refreshSite()
  return { success: 'Site content saved.' }
}
