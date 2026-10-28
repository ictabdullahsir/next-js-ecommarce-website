'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { saveNavigation } from '@/app/admin/actions'
import type { NavLink, FooterColumn } from '@/lib/products'

const toLines = (links: NavLink[] = []) => links.map((l) => `${l.label}|${l.href}`).join('\n')

export function NavigationForm({ header, footer }: { header: NavLink[]; footer: FooterColumn[] }) {
  const [state, action] = useActionState(saveNavigation, null)
  return (
    <form action={action} className="flex flex-col gap-6">
      <AdminCard title="Header menu" description="One link per line as Label|/path. Example: Sale|/shop/sale">
        <Field label="Links" htmlFor="header"><Textarea id="header" name="header" rows={6} defaultValue={toLines(header)} /></Field>
      </AdminCard>
      {[0, 1, 2].map((i) => (
        <AdminCard key={i} title={`Footer column ${i + 1}`} description="Leave the title blank to hide the column.">
          <div className="flex flex-col gap-5">
            <Field label="Title" htmlFor={`footerTitle${i}`}><Input id={`footerTitle${i}`} name={`footerTitle${i}`} defaultValue={footer[i]?.title} maxLength={40} /></Field>
            <Field label="Links" htmlFor={`footerLinks${i}`}><Textarea id={`footerLinks${i}`} name={`footerLinks${i}`} rows={5} defaultValue={toLines(footer[i]?.links)} /></Field>
          </div>
        </AdminCard>
      ))}
      <div className="flex items-center gap-4"><SubmitButton>Save navigation</SubmitButton><FormMessage state={state} /></div>
    </form>
  )
}
