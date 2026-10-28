import type { Metadata } from 'next'
import { CartView } from '@/components/cart-view'
import { getStore } from '@/lib/store'

export const metadata: Metadata = { title: 'Shopping Bag' }

export default async function CartPage() {
  const { settings, categories } = await getStore()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
      <h1 className="font-serif text-4xl md:text-5xl">Shopping Bag</h1>
      <CartView
        shippingFee={settings.shippingFee}
        freeShipping={settings.freeShippingThreshold}
        categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      />
    </div>
  )
}
