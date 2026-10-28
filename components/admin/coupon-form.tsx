'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FormMessage, SubmitButton, selectClass } from '@/components/admin/form-bits'
import { saveCoupon } from '@/app/admin/actions'
import type { Coupon } from '@/lib/products'

export function CouponForm({ coupon }: { coupon?: Coupon }) {
  const [state, action] = useActionState(saveCoupon, null)
  const id = (f: string) => `${coupon?.code ?? 'new'}-${f}`
  return (
    <form action={action} className="flex flex-col gap-5" key={coupon?.code ?? 'new'}>
      <input type="hidden" name="originalCode" value={coupon?.code ?? ''} />
      <div className="grid gap-5 sm:grid-cols-3">
        <Field label="Code" htmlFor={id('code')}>
          <Input id={id('code')} name="code" defaultValue={coupon?.code} placeholder="SUMMER15" required />
        </Field>
        <Field label="Discount type" htmlFor={id('type')}>
          <select id={id('type')} name="type" defaultValue={coupon?.type ?? 'percent'} className={selectClass}>
            <option value="percent">Percent off</option>
            <option value="fixed">Fixed amount off</option>
          </select>
        </Field>
        <Field label="Value" htmlFor={id('value')}>
          <Input id={id('value')} name="value" type="number" step="0.01" min={0.01} defaultValue={coupon?.value} required />
        </Field>
        <Field label="Minimum spend" htmlFor={id('min')} hint="Optional">
          <Input id={id('min')} name="minSubtotal" type="number" min={0} defaultValue={coupon?.minSubtotal} />
        </Field>
        <Field label="Usage limit" htmlFor={id('max')} hint="Optional">
          <Input id={id('max')} name="maxUses" type="number" min={1} defaultValue={coupon?.maxUses} />
        </Field>
        <Field label="Expires" htmlFor={id('exp')} hint="Optional">
          <Input id={id('exp')} name="expiresAt" type="date" defaultValue={coupon?.expiresAt?.slice(0, 10)} />
        </Field>
      </div>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="active" defaultChecked={coupon?.active ?? true} className="size-4 accent-primary" />
        Active (customers can use it)
      </label>
      <div className="flex items-center gap-4">
        <SubmitButton>{coupon ? 'Save coupon' : 'Create coupon'}</SubmitButton>
        <FormMessage state={state} />
      </div>
    </form>
  )
}
