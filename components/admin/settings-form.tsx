'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { saveSettings } from '@/app/admin/actions'
import type { Settings } from '@/lib/products'

export function SettingsForm({ settings: s }: { settings: Settings }) {
  const [state, action] = useActionState(saveSettings, null)
  return (
    <form action={action} className="flex flex-col gap-6">
      <AdminCard title="Store">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Store name" htmlFor="storeName"><Input id="storeName" name="storeName" defaultValue={s.storeName} required maxLength={40} /></Field>
          <Field label="Contact email" htmlFor="email"><Input id="email" name="email" type="email" defaultValue={s.email} /></Field>
          <Field label="Phone" htmlFor="phone"><Input id="phone" name="phone" defaultValue={s.phone} /></Field>
          <Field label="Address" htmlFor="address"><Input id="address" name="address" defaultValue={s.address} /></Field>
          <Field label="Instagram URL" htmlFor="instagram"><Input id="instagram" name="instagram" defaultValue={s.instagram} placeholder="https://instagram.com/yourstore" /></Field>
          <Field label="Facebook URL" htmlFor="facebook"><Input id="facebook" name="facebook" defaultValue={s.facebook} placeholder="https://facebook.com/yourstore" /></Field>
        </div>
      </AdminCard>
      <AdminCard title="Shipping" description="Applied at checkout. Set the free-shipping threshold to 0 for always-free shipping.">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Shipping fee (USD)" htmlFor="shippingFee"><Input id="shippingFee" name="shippingFee" type="number" min={0} step="0.01" defaultValue={s.shippingFee} /></Field>
          <Field label="Free shipping over (USD)" htmlFor="freeShippingThreshold"><Input id="freeShippingThreshold" name="freeShippingThreshold" type="number" min={0} step="0.01" defaultValue={s.freeShippingThreshold} /></Field>
        </div>
      </AdminCard>
      <div className="flex items-center gap-4"><SubmitButton>Save settings</SubmitButton><FormMessage state={state} /></div>
    </form>
  )
}
