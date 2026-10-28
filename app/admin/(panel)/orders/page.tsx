import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ORDER_STATUSES, listOrders } from '@/lib/orders'
import { formatPrice } from '@/lib/products'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Orders' }

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const orders = await listOrders(status)
  const tabs = [undefined, ...ORDER_STATUSES]

  return (
    <>
      <AdminPageHeader title="Orders" description="Review, fulfil and track customer orders." />
      <nav aria-label="Filter by status" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Link
            key={t ?? 'all'}
            href={t ? `/admin/orders?status=${t}` : '/admin/orders'}
            aria-current={t === status ? 'page' : undefined}
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm capitalize',
              t === status ? 'border-foreground bg-foreground text-background' : 'border-border bg-background hover:border-foreground/40',
            )}
          >
            {t ?? 'All'}
          </Link>
        ))}
      </nav>
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Order</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="pr-4 text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  {status ? `No ${status} orders.` : 'No orders yet. Customers can check out from the bag page.'}
                </TableCell>
              </TableRow>
            )}
            {orders.map((o) => (
              <TableRow key={o.number}>
                <TableCell className="pl-4">
                  <Link href={`/admin/orders/${o.number}`} className="font-medium hover:underline">{o.number}</Link>
                </TableCell>
                <TableCell>{o.customer.name}</TableCell>
                <TableCell className="hidden sm:table-cell">{new Date(o.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</TableCell>
                <TableCell><Badge variant={o.status === 'pending' ? 'default' : 'outline'} className="capitalize">{o.status}</Badge></TableCell>
                <TableCell className="pr-4 text-right">{formatPrice(o.total)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
