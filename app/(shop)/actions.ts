'use server'

import { getDb } from '@/lib/mongo'
import { ordersCollection, type Order, type OrderItem } from '@/lib/orders'
import { getStore } from '@/lib/store'
import type { Coupon, Settings } from '@/lib/products'

type CartLine = { slug: string; size: string; color: string; quantity: number }

function priceCart(lines: CartLine[], products: Awaited<ReturnType<typeof getStore>>['products']) {
  const items: OrderItem[] = []
  for (const l of lines.slice(0, 50)) {
    const p = products.find((x) => x.slug === l.slug && x.published)
    const quantity = Math.max(1, Math.min(10, Math.floor(Number(l.quantity) || 0)))
    if (!p) throw new Error('An item in your bag is no longer available.')
    if (!p.sizes.includes(l.size) || !p.colors.includes(l.color)) throw new Error(`${p.name} has an invalid size or color.`)
    items.push({ slug: p.slug, name: p.name, image: p.image, price: p.price, size: l.size, color: l.color, quantity })
  }
  if (items.length === 0) throw new Error('Your bag is empty.')
  return items
}

function discountFor(coupon: Coupon | undefined, subtotal: number) {
  if (!coupon) return 0
  const raw = coupon.type === 'percent' ? (subtotal * coupon.value) / 100 : coupon.value
  return Math.min(subtotal, Math.round(raw * 100) / 100)
}

function findCoupon(coupons: Coupon[], code: string, subtotal: number): { coupon?: Coupon; error?: string } {
  const c = coupons.find((x) => x.code.toLowerCase() === code.trim().toLowerCase())
  if (!c || !c.active) return { error: 'That coupon code is not valid.' }
  if (c.expiresAt && new Date(c.expiresAt).getTime() < Date.now()) return { error: 'That coupon has expired.' }
  if (c.maxUses && c.used >= c.maxUses) return { error: 'That coupon has been fully redeemed.' }
  if (c.minSubtotal && subtotal < c.minSubtotal) return { error: `Spend at least $${c.minSubtotal} to use this coupon.` }
  return { coupon: c }
}

const shippingFor = (s: Settings, afterDiscount: number) => (afterDiscount >= s.freeShippingThreshold ? 0 : s.shippingFee)

export async function previewCoupon(code: string, lines: CartLine[]) {
  try {
    const { products, coupons } = await getStore()
    const subtotal = priceCart(lines, products).reduce((n, i) => n + i.price * i.quantity, 0)
    const { coupon, error } = findCoupon(coupons, code, subtotal)
    if (error) return { error }
    return { code: coupon!.code, discount: discountFor(coupon, subtotal) }
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Could not check the coupon.' }
  }
}

export async function placeOrder(input: {
  lines: CartLine[]
  couponCode?: string
  customer: Order['customer']
  note?: string
}): Promise<{ number: string } | { error: string }> {
  const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max)
  const customer = {
    name: str(input.customer?.name, 100),
    email: str(input.customer?.email, 150),
    phone: str(input.customer?.phone, 30),
    address: str(input.customer?.address, 300),
    city: str(input.customer?.city, 80),
    postalCode: str(input.customer?.postalCode, 20),
  }
  if (!customer.name || !customer.phone || !customer.address || !customer.city) {
    return { error: 'Please fill in your name, phone, address and city.' }
  }
  if (!/^\S+@\S+\.\S+$/.test(customer.email)) return { error: 'Enter a valid email address.' }

  const store = await getStore()
  let items: OrderItem[]
  try {
    items = priceCart(input.lines, store.products)
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Invalid bag.' }
  }

  const qtyBySlug = new Map<string, number>()
  for (const i of items) qtyBySlug.set(i.slug, (qtyBySlug.get(i.slug) ?? 0) + i.quantity)
  for (const [slug, qty] of qtyBySlug) {
    const p = store.products.find((x) => x.slug === slug)!
    if (p.stock !== undefined && p.stock < qty) {
      return { error: p.stock === 0 ? `${p.name} is sold out.` : `Only ${p.stock} of ${p.name} left in stock.` }
    }
  }

  const subtotal = items.reduce((n, i) => n + i.price * i.quantity, 0)
  let coupon: Coupon | undefined
  if (input.couponCode?.trim()) {
    const r = findCoupon(store.coupons, input.couponCode, subtotal)
    if (r.error) return { error: r.error }
    coupon = r.coupon
  }
  const discount = discountFor(coupon, subtotal)
  const shipping = shippingFor(store.settings, subtotal - discount)

  // Reserve stock atomically; roll back if any line fails.
  const db = await getDb()
  const storeCol = db.collection<{ _id: string }>('store')
  const reserved: [string, number][] = []
  for (const [slug, qty] of qtyBySlug) {
    const p = store.products.find((x) => x.slug === slug)!
    if (p.stock === undefined) continue
    const res = await storeCol.updateOne(
      { _id: 'main', products: { $elemMatch: { slug, stock: { $gte: qty } } } } as never,
      { $inc: { 'products.$.stock': -qty } } as never,
    )
    if (res.modifiedCount === 0) {
      for (const [s, q] of reserved) {
        await storeCol.updateOne({ _id: 'main', 'products.slug': s } as never, { $inc: { 'products.$.stock': q } } as never)
      }
      return { error: `${p.name} just sold out. Please update your bag.` }
    }
    reserved.push([slug, qty])
  }
  if (coupon) {
    await storeCol.updateOne({ _id: 'main', 'coupons.code': coupon.code } as never, { $inc: { 'coupons.$.used': 1 } } as never)
  }

  const number = `LM-${Date.now().toString(36).toUpperCase()}${Math.floor(Math.random() * 36).toString(36).toUpperCase()}`
  const order: Order = {
    number,
    createdAt: new Date().toISOString(),
    status: 'pending',
    customer,
    items,
    subtotal,
    discount,
    couponCode: coupon?.code,
    shipping,
    total: Math.round((subtotal - discount + shipping) * 100) / 100,
    paymentMethod: 'cash-on-delivery',
    note: str(input.note, 500) || undefined,
  }
  await (await ordersCollection()).insertOne(order)
  return { number }
}
