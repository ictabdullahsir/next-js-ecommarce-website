'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Check, Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/components/cart-provider'
import type { Product } from '@/lib/products'
import { cn } from '@/lib/utils'

export function AddToCart({ product }: { product: Product }) {
  const { add } = useCart()
  const [size, setSize] = useState(product.sizes.length === 1 ? product.sizes[0] : '')
  const [color, setColor] = useState(product.colors[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState(false)

  const soldOut = product.stock !== undefined && product.stock <= 0
  const maxQty = Math.min(10, product.stock ?? 10)

  function handleAdd() {
    if (soldOut) return
    if (!size) {
      setError(true)
      return
    }
    add({
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.image,
      size,
      color,
      quantity: qty,
    })
    setAdded(true)
    setError(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <fieldset>
        <legend className="text-sm font-medium">
          Color: <span className="font-normal text-muted-foreground">{color}</span>
        </legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              aria-pressed={color === c}
              className={cn(
                'rounded-md border px-3 py-2 text-sm',
                color === c ? 'border-foreground' : 'border-border hover:border-foreground/50',
              )}
            >
              {c}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-medium">Size</legend>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setSize(s)
                setError(false)
              }}
              aria-pressed={size === s}
              className={cn(
                'min-w-12 rounded-md border px-3 py-2 text-sm',
                size === s
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border hover:border-foreground/50',
              )}
            >
              {s}
            </button>
          ))}
        </div>
        {error && (
          <p role="alert" className="mt-2 text-sm text-destructive">
            Please select a size.
          </p>
        )}
      </fieldset>

      <div className="flex gap-3">
        <div className="flex items-center rounded-lg border border-border">
          <button
            type="button"
            className="p-3 disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-8 text-center text-sm" aria-live="polite">
            {qty}
          </span>
          <button
            type="button"
            className="p-3 disabled:opacity-40"
            onClick={() => setQty((q) => Math.min(maxQty, q + 1))}
            disabled={qty >= maxQty}
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button onClick={handleAdd} disabled={soldOut} className="h-12 flex-1 text-base">
          {soldOut ? 'Sold out' : 'Add to Bag'}
        </Button>
      </div>

      {added && (
        <div
          role="status"
          className="flex items-center justify-between rounded-lg bg-secondary px-4 py-3 text-sm"
        >
          <span className="flex items-center gap-2">
            <Check className="size-4 text-primary" /> Added to your bag
          </span>
          <Link href="/cart" className="font-medium underline underline-offset-4">
            View bag
          </Link>
        </div>
      )}
    </div>
  )
}
