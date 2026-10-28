'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Minus, Plus, X } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { placeOrder, previewCoupon } from '@/app/(shop)/actions'
import { itemKey, useCart } from '@/components/cart-provider'
import { formatPrice } from '@/lib/products'

type Props = { shippingFee: number; freeShipping: number; categories: { slug: string; name: string }[] }

const emptyCustomer = { name: '', email: '', phone: '', address: '', city: '', postalCode: '' }

export function CartView({ shippingFee, freeShipping, categories }: Props) {
  const { items, subtotal, update, remove, clear } = useCart()
  const [placed, setPlaced] = useState<string | null>(null)
  const [customer, setCustomer] = useState(emptyCustomer)
  const [note, setNote] = useState('')
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<{ code: string; discount: number } | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const lines = items.map((i) => ({ slug: i.slug, size: i.size, color: i.color, quantity: i.quantity }))

  async function applyCoupon() {
    setError('')
    const r = await previewCoupon(code, lines)
    if ('error' in r && r.error) {
      setApplied(null)
      setError(r.error)
    } else if ('code' in r) setApplied({ code: r.code, discount: r.discount })
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const r = await placeOrder({ lines, couponCode: applied?.code, customer, note })
    setBusy(false)
    if ('error' in r) return setError(r.error)
    clear()
    setPlaced(r.number)
  }

  if (placed) {
    return (
      <div className="mx-auto max-w-md py-16 text-center">
        <h2 className="font-serif text-3xl">Thank you for your order</h2>
        <p className="mt-3 text-muted-foreground">
          Your order number is <strong className="text-foreground">{placed}</strong>. Pay with cash when it
          arrives. We will contact you to confirm delivery.
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
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/shop/${c.slug}`}
              className={buttonVariants({ variant: 'outline', className: 'h-11 px-5' })}
            >
              {c.name}
            </Link>
          ))}
        </div>
      </div>
    )
  }

  const discount = applied?.discount ?? 0
  const shipping = subtotal - discount >= freeShipping ? 0 : shippingFee
  const total = subtotal - discount + shipping

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

      <form onSubmit={submit} className="h-fit w-full rounded-lg bg-secondary p-6 lg:w-96">
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
          {discount > 0 && (
            <div className="flex justify-between text-primary">
              <dt>Coupon {applied?.code}</dt>
              <dd>-{formatPrice(discount)}</dd>
            </div>
          )}
          {shipping > 0 && (
            <p className="text-xs text-muted-foreground">
              Add {formatPrice(Math.max(0, freeShipping - (subtotal - discount)))} more for free shipping.
            </p>
          )}
          <div className="flex justify-between border-t border-border pt-3 text-base font-semibold">
            <dt>Total</dt>
            <dd>{formatPrice(total)}</dd>
          </div>
        </dl>
        <div className="mt-6 flex gap-2">
          <Input
            aria-label="Coupon code"
            placeholder="Coupon code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={applyCoupon} disabled={!code.trim()}>
            Apply
          </Button>
        </div>

        <h3 className="mt-8 text-sm font-semibold">Delivery details</h3>
        <div className="mt-3 flex flex-col gap-3">
          {(
            [
              ['name', 'Full name', 'text'],
              ['email', 'Email', 'email'],
              ['phone', 'Phone', 'tel'],
              ['address', 'Street address', 'text'],
              ['city', 'City', 'text'],
              ['postalCode', 'Postal code (optional)', 'text'],
            ] as const
          ).map(([key, label, type]) => (
            <div key={key} className="flex flex-col gap-1.5">
              <Label htmlFor={`co-${key}`}>{label}</Label>
              <Input
                id={`co-${key}`}
                type={type}
                required={key !== 'postalCode'}
                value={customer[key]}
                onChange={(e) => setCustomer({ ...customer, [key]: e.target.value })}
              />
            </div>
          ))}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="co-note">Order note (optional)</Label>
            <Input id="co-note" value={note} onChange={(e) => setNote(e.target.value)} />
          </div>
        </div>

        {error && (
          <p role="alert" className="mt-4 text-sm text-destructive">
            {error}
          </p>
        )}
        <Button type="submit" disabled={busy} className="mt-6 h-12 w-full text-base">
          {busy ? 'Placing order…' : 'Place order'}
        </Button>
        <p className="mt-3 text-center text-xs text-muted-foreground">Payment: cash on delivery</p>
      </form>
    </div>
  )
}
