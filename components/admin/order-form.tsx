'use client'

import { useActionState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton, selectClass } from '@/components/admin/form-bits'
import { updateOrder } from '@/app/admin/actions'
import { ORDER_STATUSES } from '@/lib/order-statuses'

export function OrderForm({ number, status, adminNote }: { number: string; status: string; adminNote: string }) {
  const [state, action] = useActionState(updateOrder, null)
  return (
    <form action={action} className="h-fit">
      <input type="hidden" name="number" value={number} />
      <AdminCard title="Fulfilment">
        <div className="flex flex-col gap-5">
          <Field label="Status" htmlFor="status" hint="Cancelling an order puts its items back in stock.">
            <select id="status" name="status" defaultValue={status} className={selectClass}>
              {ORDER_STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </Field>
          <Field label="Internal note" htmlFor="adminNote" hint="Only visible to admins.">
            <Textarea id="adminNote" name="adminNote" rows={4} defaultValue={adminNote} maxLength={1000} />
          </Field>
          <FormMessage state={state} />
          <SubmitButton>Update order</SubmitButton>
        </div>
      </AdminCard>
    </form>
  )
}
