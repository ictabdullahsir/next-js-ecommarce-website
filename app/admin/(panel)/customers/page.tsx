import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { listCustomers } from '@/lib/orders'
import { formatPrice } from '@/lib/products'

export const metadata = { title: 'Customers' }

export default async function CustomersPage() {
  const customers = await listCustomers()
  return (
    <>
      <AdminPageHeader title="Customers" description="Built automatically from placed orders, ranked by total spend." />
      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Customer</TableHead>
              <TableHead className="hidden sm:table-cell">Phone</TableHead>
              <TableHead>Orders</TableHead>
              <TableHead className="hidden md:table-cell">Last order</TableHead>
              <TableHead className="pr-4 text-right">Spent</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers.length === 0 && (
              <TableRow><TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No customers yet.</TableCell></TableRow>
            )}
            {customers.map((c) => (
              <TableRow key={c.email}>
                <TableCell className="pl-4"><span className="block font-medium">{c.name}</span><span className="block text-xs text-muted-foreground">{c.email}</span></TableCell>
                <TableCell className="hidden sm:table-cell">{c.phone}</TableCell>
                <TableCell>{c.orders}</TableCell>
                <TableCell className="hidden md:table-cell">{new Date(c.lastOrder).toLocaleDateString('en-US', { dateStyle: 'medium' })}</TableCell>
                <TableCell className="pr-4 text-right">{formatPrice(c.spent)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
