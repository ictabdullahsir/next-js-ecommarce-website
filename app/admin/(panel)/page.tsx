import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCard } from '@/components/admin/form-bits'
import { formatPrice } from '@/lib/products'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const { products, categories } = await getStore()
  const published = products.filter((p) => p.published).length
  const onSale = products.filter((p) => p.compareAt).length

  const stats = [
    { label: 'Total products', value: products.length },
    { label: 'Published', value: published },
    { label: 'Drafts', value: products.length - published },
    { label: 'On sale', value: onSale },
  ]

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your store catalog and content."
        action={
          <Link href="/admin/products/new" className={buttonVariants({ className: 'h-10 px-4' })}>
            <Plus className="size-4" /> New product
          </Link>
        }
      />

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-border bg-background p-5">
            <dt className="text-sm text-muted-foreground">{s.label}</dt>
            <dd className="mt-2 font-serif text-3xl">{s.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <AdminCard title="Categories" className="lg:col-span-1">
          <ul className="flex flex-col divide-y divide-border">
            {categories.map((c) => (
              <li key={c.slug} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <span className="font-medium">{c.name}</span>
                <span className="text-sm text-muted-foreground">
                  {products.filter((p) => p.category === c.slug).length} products
                </span>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/categories"
            className="mt-5 flex items-center gap-1 text-sm font-medium hover:text-primary"
          >
            Edit categories <ArrowRight className="size-4" />
          </Link>
        </AdminCard>

        <AdminCard title="Recently added" className="lg:col-span-2">
          <ul className="flex flex-col divide-y divide-border">
            {products.slice(0, 5).map((p) => (
              <li key={p.slug} className="py-3 first:pt-0 last:pb-0">
                <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3">
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={p.image || '/placeholder.svg'} alt="" fill sizes="44px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{p.name}</span>
                    <span className="block text-xs capitalize text-muted-foreground">
                      {p.category} &middot; {p.type}
                    </span>
                  </span>
                  {!p.published && <Badge variant="outline">Draft</Badge>}
                  <span className="text-sm">{formatPrice(p.price)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/admin/products"
            className="mt-5 flex items-center gap-1 text-sm font-medium hover:text-primary"
          >
            Manage products <ArrowRight className="size-4" />
          </Link>
        </AdminCard>
      </div>
    </>
  )
}
