'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { ADMIN_PASSWORD, requireAdmin } from '@/lib/admin-auth'
import { SESSION_COOKIE, SESSION_TTL_MS, createSessionToken, safeEqual } from '@/lib/admin-session'
import { promises as fs } from 'fs'
import path from 'path'
import { isCategorySlug, slugify, type CmsPage, type Coupon, type FooterColumn, type NavLink, type Product, type SiteContent } from '@/lib/products'
import { ORDER_STATUSES, ordersCollection, type OrderStatus } from '@/lib/orders'
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
  const stockRaw = text(formData, 'stock', 10)
  const stock = stockRaw === '' ? undefined : Math.floor(Number(stockRaw))

  if (!name) return { error: 'Name is required.' }
  if (!slug) return { error: 'A valid URL slug is required.' }
  if (stock !== undefined && (!Number.isFinite(stock) || stock < 0)) return { error: 'Stock must be 0 or more.' }
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
  if (!store.categories.some((c) => c.slug === category)) return { error: 'Choose a valid category.' }
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
    stock,
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
  const originalSlug = text(formData, 'originalSlug', 40)
  const name = text(formData, 'name', 60)
  const slug = originalSlug || slugify(text(formData, 'slug', 40) || name)
  const tagline = text(formData, 'tagline', 200)
  const image = text(formData, 'image', 500)

  if (!name) return { error: 'Name is required.' }
  if (!isCategorySlug(slug)) return { error: 'Use letters, numbers and dashes for the URL slug.' }
  if (!image || !isSafeImagePath(image)) return { error: 'Choose a valid image.' }

  const store = await getStore()
  if (originalSlug) {
    store.categories = store.categories.map((c) => (c.slug === slug ? { slug, name, tagline, image } : c))
  } else {
    if (store.categories.some((c) => c.slug === slug)) return { error: `A category with slug "${slug}" already exists.` }
    store.categories.push({ slug, name, tagline, image })
  }
  await saveStore(store)
  refreshSite()
  return { success: originalSlug ? `${name} saved.` : `${name} added. Fill the form again to add another.` }
}

export async function deleteCategory(slug: string): Promise<FormState> {
  await requireAdmin()
  const store = await getStore()
  const count = store.products.filter((p) => p.category === slug).length
  if (count > 0) return { error: `Move or delete its ${count} product(s) first.` }
  store.categories = store.categories.filter((c) => c.slug !== slug)
  await saveStore(store)
  refreshSite()
  return { success: 'Category deleted.' }
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

// ---------- Orders ----------

export async function updateOrder(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const number = text(formData, 'number', 40)
  const status = text(formData, 'status', 20) as OrderStatus
  if (!(ORDER_STATUSES as readonly string[]).includes(status)) return { error: 'Choose a valid status.' }
  const col = await ordersCollection()
  const existing = await col.findOne({ number })
  if (!existing) return { error: 'Order not found.' }

  // Cancelling returns stock to the shelf; un-cancelling takes it back.
  if ((status === 'cancelled') !== (existing.status === 'cancelled')) {
    const sign = status === 'cancelled' ? 1 : -1
    const store = await getStore()
    for (const item of existing.items) {
      const p = store.products.find((x) => x.slug === item.slug)
      if (p && p.stock !== undefined) p.stock = Math.max(0, p.stock + sign * item.quantity)
    }
    await saveStore(store)
  }
  await col.updateOne({ number }, { $set: { status, adminNote: text(formData, 'adminNote', 1000) } })
  revalidatePath('/admin', 'layout')
  refreshSite()
  return { success: 'Order updated.' }
}

export async function deleteOrder(number: string) {
  await requireAdmin()
  await (await ordersCollection()).deleteOne({ number })
  revalidatePath('/admin', 'layout')
  redirect('/admin/orders')
}

// ---------- Coupons ----------

export async function saveCoupon(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const code = text(formData, 'code', 30).toUpperCase().replace(/\s+/g, '')
  const originalCode = text(formData, 'originalCode', 30)
  const type = text(formData, 'type', 10) === 'fixed' ? 'fixed' : 'percent'
  const value = Number(text(formData, 'value', 10))
  const num = (k: string) => {
    const v = text(formData, k, 10)
    return v ? Number(v) : undefined
  }
  const minSubtotal = num('minSubtotal')
  const maxUses = num('maxUses')
  const expiresAt = text(formData, 'expiresAt', 10) || undefined

  if (!/^[A-Z0-9_-]{3,30}$/.test(code)) return { error: 'Code must be 3-30 letters, numbers, dashes or underscores.' }
  if (!Number.isFinite(value) || value <= 0 || (type === 'percent' && value > 100)) {
    return { error: type === 'percent' ? 'Percent must be between 1 and 100.' : 'Amount must be greater than 0.' }
  }

  const store = await getStore()
  if (store.coupons.some((c) => c.code === code && c.code !== originalCode)) return { error: 'That code already exists.' }
  const prev = store.coupons.find((c) => c.code === originalCode)
  const coupon: Coupon = { code, type, value, minSubtotal, maxUses, expiresAt, used: prev?.used ?? 0, active: formData.get('active') === 'on' }
  store.coupons = prev ? store.coupons.map((c) => (c.code === originalCode ? coupon : c)) : [coupon, ...store.coupons]
  await saveStore(store)
  revalidatePath('/admin/coupons')
  return { success: prev ? 'Coupon saved.' : `Coupon ${code} created.` }
}

export async function deleteCoupon(code: string) {
  await requireAdmin()
  const store = await getStore()
  store.coupons = store.coupons.filter((c) => c.code !== code)
  await saveStore(store)
  revalidatePath('/admin/coupons')
}

// ---------- Pages ----------

export async function savePage(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const originalSlug = text(formData, 'originalSlug', 80)
  const title = text(formData, 'title', 120)
  const slug = slugify(text(formData, 'slug', 80) || title)
  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'A valid URL slug is required.' }

  const store = await getStore()
  if (store.pages.some((p) => p.slug === slug && p.slug !== originalSlug)) return { error: `The slug "${slug}" is already used.` }
  const page: CmsPage = {
    slug,
    title,
    content: text(formData, 'content', 20000),
    seoDescription: text(formData, 'seoDescription', 200) || undefined,
    published: formData.get('published') === 'on',
  }
  const i = store.pages.findIndex((p) => p.slug === originalSlug)
  if (i >= 0) store.pages[i] = page
  else store.pages.unshift(page)
  await saveStore(store)
  refreshSite()
  redirect('/admin/pages')
}

export async function deletePage(slug: string) {
  await requireAdmin()
  const store = await getStore()
  store.pages = store.pages.filter((p) => p.slug !== slug)
  await saveStore(store)
  refreshSite()
}

// ---------- Navigation ----------

const parseLinks = (raw: string): NavLink[] =>
  raw
    .split('\n')
    .map((l) => l.split('|').map((x) => x.trim()))
    .filter(([label, href]) => label && href)
    .map(([label, href]) => ({ label: label.slice(0, 40), href: href.slice(0, 200) }))
    .slice(0, 12)

export async function saveNavigation(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const header = parseLinks(text(formData, 'header', 2000))
  const footer: FooterColumn[] = [0, 1, 2].map((i) => ({
    title: text(formData, `footerTitle${i}`, 40),
    links: parseLinks(text(formData, `footerLinks${i}`, 2000)),
  })).filter((c) => c.title && c.links.length)
  const bad = [...header, ...footer.flatMap((c) => c.links)].find((l) => !/^(\/[\w\-./?=&#]*|https:\/\/[^\s"'<>]+)$/.test(l.href))
  if (bad) return { error: `"${bad.href}" is not a valid link. Use a site path like /shop or an https:// URL.` }

  const store = await getStore()
  store.nav = { header, footer }
  await saveStore(store)
  refreshSite()
  return { success: 'Navigation saved.' }
}

// ---------- Settings ----------

export async function saveSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const storeName = text(formData, 'storeName', 40)
  const shippingFee = Number(text(formData, 'shippingFee', 10) || 0)
  const freeShippingThreshold = Number(text(formData, 'freeShippingThreshold', 10) || 0)
  const instagram = text(formData, 'instagram', 200)
  const facebook = text(formData, 'facebook', 200)
  if (!storeName) return { error: 'Store name is required.' }
  if (![shippingFee, freeShippingThreshold].every((n) => Number.isFinite(n) && n >= 0)) return { error: 'Shipping amounts must be 0 or more.' }
  if ([instagram, facebook].some((u) => u && !/^https:\/\//.test(u))) return { error: 'Social links must start with https://' }

  const store = await getStore()
  store.settings = { storeName, email: text(formData, 'email', 150), phone: text(formData, 'phone', 40), address: text(formData, 'address', 300), instagram, facebook, shippingFee, freeShippingThreshold }
  await saveStore(store)
  refreshSite()
  return { success: 'Settings saved.' }
}

// ---------- Media ----------

export async function deleteMedia(src: string) {
  await requireAdmin()
  if (!/^\/uploads\/[\w\-.]+$/.test(src)) return
  await fs.unlink(path.join(process.cwd(), 'public', src)).catch(() => {})
  revalidatePath('/admin/media')
}
