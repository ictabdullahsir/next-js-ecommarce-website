import Image from 'next/image'
import { notFound } from 'next/navigation'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCard } from '@/components/admin/form-bits'
import { DeleteButton } from '@/components/admin/delete-button'
import { OrderForm } from '@/components/admin/order-form'
import { deleteOrder } from '@/app/admin/actions'
import { getOrder } from '@/lib/orders'
import { formatPrice } from '@/lib/products'

export const metadata = { title: 'Order' }

export default async function OrderPage({ params }: { params: Promise<{ number: string }> }) {
  const order = await getOrder((await params).number)
  if (!order) notFound()
  const c = order.customer

  return (
    <>
      <AdminPageHeader
        title={`Order ${order.number}`}
        description={`Placed ${new Date(order.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })} · Cash on delivery`}
        action={<DeleteButton action={deleteOrder.bind(null, order.number)} confirmText="Delete this order permanently? Stock is not restored." label="Delete order" />}
      />
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          <AdminCard title="Items">
            <ul className="flex flex-col divide-y divide-border">
              {order.items.map((i, n) => (
                <li key={n} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 text-sm">
                  <span className="relative size-12 shrink-0 overflow-hidden rounded-md bg-secondary">
                    <Image src={i.image || '/placeholder.svg'} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{i.name}</span>
                    <span className="block text-xs text-muted-foreground">{i.color} · Size {i.size} · Qty {i.quantity}</span>
                  </span>
                  <span>{formatPrice(i.price * i.quantity)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-5 flex flex-col gap-2 border-t border-border pt-4 text-sm">
              <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
              {order.discount > 0 && <div className="flex justify-between"><dt className="text-muted-foreground">Coupon {order.couponCode}</dt><dd>-{formatPrice(order.discount)}</dd></div>}
              <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping ? formatPrice(order.shipping) : 'Free'}</dd></div>
              <div className="flex justify-between text-base font-semibold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
            </dl>
          </AdminCard>
          <AdminCard title="Customer">
            <address className="text-sm not-italic leading-relaxed">
              <strong>{c.name}</strong><br />
              <a href={`mailto:${c.email}`} className="underline underline-offset-4">{c.email}</a> · {c.phone}<br />
              {c.address}, {c.city} {c.postalCode}
            </address>
            {order.note && <p className="mt-4 rounded-md bg-secondary px-3 py-2 text-sm"><span className="font-medium">Customer note:</span> {order.note}</p>}
          </AdminCard>
        </div>
        <OrderForm number={order.number} status={order.status} adminNote={order.adminNote ?? ''} />
      </div>
    </>
  )
}
