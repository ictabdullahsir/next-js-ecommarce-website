'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { itemKey, useCart } from '@/components/cart-provider'
import { formatPrice } from '@/lib/products'

const FREE_SHIPPING = 100
const SHIPPING_FEE = 8

export function CartView() {
  const { items, subtotal, update, remove, clear } = useCart()
  const [placed, setPlaced] = useState(false)

  if (placed) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="font-serif text-3xl">Thank you for your order</h2>
        <p className="mt-3 text-muted-foreground">
          This is a demo store, so no payment was taken. Your bag has been cleared.
        </p>
        <Link href="/shop" className={buttonVariants({ className: 'mt-8 h-11 px-6' })}>
          Continue shopping
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="font-serif text-3xl">Your bag is empty</h2>
        <p className="mt-3 text-muted-foreground">Discover something you&apos;ll love.</p>
        <div className="mt-8 flex justify-center gap-3">
          {['men', 'women', 'kids'].map((c) => (
            <Link
              key={c}
              href={`/shop/${c}`}
              className={buttonVariants({ variant: 'outline', className: 'h-11 px-5 capitalize' })}
            >
              {c}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE
  const total = subtotal + shipping

  return (
    <div className="mt-8 flex flex-col gap-12 lg:flex-row">
      <ul className="flex flex-1 flex-col divide-y divide-border border-y border-border">
        {items.map((item) => {
          const product = item
          const key = itemKey(item)
          return (
            <li key={key} className="flex gap-4 py-6">
              <Link
                href={`/product/${product.slug}`}
                className="relative aspect-[4/5] w-24 shrink-0 overflow-hidden rounded-md bg-secondary sm:w-28"
              >
                <Image
                  src={product.image || '/placeholder.svg'}
                  alt={product.name}
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              </Link>
              <div className="flex flex-1 flex-col justify-between gap-3">
                <div className="flex justify-between gap-4">
                  <div>
                    <Link href={`/product/${product.slug}`} className="font-medium">
                      {product.name}
                    </Link>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.color} &middot; Size {item.size}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(key)}
                    className="-m-2 h-fit p-2 text-muted-foreground hover:text-foreground"
                    aria-label={`Remove ${product.name}`}
                  >
                    <X className="size-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-md border border-border">
                    <button
                      type="button"
                      className="p-2"
                      onClick={() => update(key, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="size-3.5" />
                    </button>
                    <span className="w-6 text-center text-sm">{item.quantity}</span>
                    <button
                      type="button"
                      className="p-2 disabled:opacity-40"
                      onClick={() => update(key, item.quantity + 1)}
                      disabled={item.quantity >= 10}
                      aria-label="Increase quantity"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <p className="font-medium">{formatPrice(product.price * item.quantity)}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <aside className="h-fit w-full rounded-lg bg-secondary p-6 lg:w-96">
        <h2 className="text-lg font-semibold">Order Summary</h2>
        <dl className="mt-6 flex flex-col gap-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd>{formatPrice(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Shipping</dt>
            <dd>{shipping === 0 ? 'Free' : formatPrice(shipping)}</dd>
          </div>
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add {formatPrice(FREE_SHIPPING - subtotal)} more for free shipping.
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <Button
          className="mt-6 h-12 w-full text-base"
          onClick={() => {
            clear()
            setPlaced(true)
          }}
        >
          Checkout
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Demo checkout &middot; no payment is processed
        </p>
      </aside>
    </div>
  )
}
