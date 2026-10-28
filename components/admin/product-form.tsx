'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton, selectClass } from '@/components/admin/form-bits'
import { ImagePicker } from '@/components/admin/image-picker'
import { saveProduct } from '@/app/admin/actions'
import type { Category, Product } from '@/lib/products'

export function ProductForm({
  product,
  categories,
  library,
}: {
  product?: Product
  categories: Category[]
  library: string[]
}) {
  const [state, action] = useActionState(saveProduct, null)

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="originalSlug" value={product?.slug ?? ''} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <AdminCard title="Details">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Name" htmlFor="name" className="sm:col-span-2">
                <Input id="name" name="name" defaultValue={product?.name} required maxLength={120} />
              </Field>
              <Field label="URL slug" htmlFor="slug" hint="Leave blank to generate from the name.">
                <Input id="slug" name="slug" defaultValue={product?.slug} placeholder="linen-shirt" />
              </Field>
              <Field label="Product type" htmlFor="type" hint="e.g. Outerwear, Shoes, Knitwear">
                <Input id="type" name="type" defaultValue={product?.type} required />
              </Field>
              <Field label="Description" htmlFor="description" className="sm:col-span-2">
                <Textarea
                  id="description"
                  name="description"
                  rows={5}
                  defaultValue={product?.description}
                  maxLength={2000}
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Media">
            <ImagePicker name="image" defaultValue={product?.image ?? ''} library={library} />
          </AdminCard>

          <AdminCard title="Variants" description="Separate multiple values with commas.">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Sizes" htmlFor="sizes">
                <Input
                  id="sizes"
                  name="sizes"
                  defaultValue={product?.sizes.join(', ')}
                  placeholder="XS, S, M, L, XL"
                  required
                />
              </Field>
              <Field label="Colors" htmlFor="colors">
                <Input
                  id="colors"
                  name="colors"
                  defaultValue={product?.colors.join(', ')}
                  placeholder="Black, Cream"
                  required
                />
              </Field>
            </div>
          </AdminCard>
        </div>

        <div className="flex flex-col gap-6">
          <AdminCard title="Status">
            <div className="flex flex-col gap-4">
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="published"
                  defaultChecked={product?.published ?? true}
                  className="mt-0.5 size-4 accent-primary"
                />
                <span>
                  <span className="font-medium">Published</span>
                  <span className="block text-muted-foreground">Visible in the storefront.</span>
                </span>
              </label>
              <label className="flex items-start gap-3 text-sm">
                <input
                  type="checkbox"
                  name="isNew"
                  defaultChecked={product?.isNew ?? false}
                  className="mt-0.5 size-4 accent-primary"
                />
                <span>
                  <span className="font-medium">Mark as new</span>
                  <span className="block text-muted-foreground">Shows a &quot;New&quot; badge.</span>
                </span>
              </label>
            </div>
          </AdminCard>

          <AdminCard title="Organization">
            <Field label="Category" htmlFor="category">
              <select
                id="category"
                name="category"
                defaultValue={product?.category ?? categories[0]?.slug}
                className={selectClass}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </AdminCard>

          <AdminCard title="Pricing">
            <div className="flex flex-col gap-5">
              <Field label="Price (USD)" htmlFor="price">
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min={1}
                  step="0.01"
                  defaultValue={product?.price}
                  required
                />
              </Field>
              <Field label="Compare-at price" htmlFor="compareAt" hint="Optional. Shows the item as on sale.">
                <Input
                  id="compareAt"
                  name="compareAt"
                  type="number"
                  min={1}
                  step="0.01"
                  defaultValue={product?.compareAt}
                />
              </Field>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-border bg-secondary/95 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end md:mx-0 md:rounded-xl md:border md:bg-background">
        <div className="sm:mr-auto">
          <FormMessage state={state} />
        </div>
        <Link href="/admin/products" className={buttonVariants({ variant: 'outline', className: 'h-10 px-5' })}>
          Cancel
        </Link>
        <SubmitButton>{product ? 'Save changes' : 'Create product'}</SubmitButton>
      </div>
    </form>
  )
}
