import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCard } from '@/components/admin/form-bits'
import { listOrders } from '@/lib/orders'
import { formatPrice } from '@/lib/products'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const [{ products }, orders] = await Promise.all([getStore(), listOrders()])
  const counted = orders.filter((o) => o.status !== 'cancelled')
  const revenue = counted.reduce((n, o) => n + o.total, 0)
  const pending = orders.filter((o) => o.status === 'pending').length
  const low = products.filter((p) => p.stock !== undefined && p.stock <= 5).sort((a, b) => (a.stock ?? 0) - (b.stock ?? 0))

  const sold = new Map<string, { name: string; qty: number }>()
  for (const o of counted) for (const i of o.items) sold.set(i.slug, { name: i.name, qty: (sold.get(i.slug)?.qty ?? 0) + i.quantity })
  const top = [...sold.values()].sort((a, b) => b.qty - a.qty).slice(0, 5)

  const stats = [
    { label: 'Revenue', value: formatPrice(revenue) },
    { label: 'Orders', value: orders.length },
    { label: 'Awaiting action', value: pending },
    { label: 'Products', value: products.length },
  ]

  return (
    <>
      <AdminPageHeader
        title="Dashboard"
        description="Sales, orders and stock at a glance."
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
        <AdminCard title="Recent orders" className="lg:col-span-2">
          {orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet. They appear here as soon as a customer checks out.</p>
          ) : (
            <ul className="flex flex-col divide-y divide-border">
              {orders.slice(0, 6).map((o) => (
                <li key={o.number} className="py-3 first:pt-0 last:pb-0">
                  <Link href={`/admin/orders/${o.number}`} className="flex items-center gap-3 text-sm">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{o.customer.name}</span>
                      <span className="block text-xs text-muted-foreground">{o.number}</span>
                    </span>
                    <Badge variant={o.status === 'pending' ? 'default' : 'outline'} className="capitalize">{o.status}</Badge>
                    <span>{formatPrice(o.total)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link href="/admin/orders" className="mt-5 flex items-center gap-1 text-sm font-medium hover:text-primary">
            All orders <ArrowRight className="size-4" />
          </Link>
        </AdminCard>

        <div className="flex flex-col gap-6">
          <AdminCard title="Low stock" description="5 units or fewer.">
            {low.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing is running low.</p>
            ) : (
              <ul className="flex flex-col divide-y divide-border">
                {low.slice(0, 6).map((p) => (
                  <li key={p.slug} className="py-2.5 first:pt-0 last:pb-0">
                    <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3 text-sm">
                      <span className="relative size-9 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image src={p.image || '/placeholder.svg'} alt="" fill sizes="36px" className="object-cover" />
                      </span>
                      <span className="min-w-0 flex-1 truncate">{p.name}</span>
                      <span className={p.stock === 0 ? 'font-medium text-destructive' : ''}>{p.stock === 0 ? 'Sold out' : `${p.stock} left`}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
          <AdminCard title="Best sellers">
            {top.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sales will rank here.</p>
            ) : (
              <ul className="flex flex-col gap-2 text-sm">
                {top.map((t) => (
                  <li key={t.name} className="flex justify-between gap-3">
                    <span className="truncate">{t.name}</span>
                    <span className="text-muted-foreground">{t.qty} sold</span>
                  </li>
                ))}
              </ul>
            )}
          </AdminCard>
        </div>
      </div>
    </>
  )
}
