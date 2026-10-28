'use client'

import Link from 'next/link'
import { useActionState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { savePage } from '@/app/admin/actions'
import type { CmsPage } from '@/lib/products'

export function PageForm({ page }: { page?: CmsPage }) {
  const [state, action] = useActionState(savePage, null)
  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="originalSlug" value={page?.slug ?? ''} />
      <AdminCard title="Content">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Title" htmlFor="title"><Input id="title" name="title" defaultValue={page?.title} required maxLength={120} /></Field>
          <Field label="URL slug" htmlFor="slug" hint="Page address: /pages/your-slug"><Input id="slug" name="slug" defaultValue={page?.slug} placeholder="about-us" /></Field>
          <Field label="Body" htmlFor="content" className="sm:col-span-2" hint="Leave a blank line between paragraphs. Start a line with ## for a heading.">
            <Textarea id="content" name="content" rows={14} defaultValue={page?.content} />
          </Field>
          <Field label="Search description" htmlFor="seoDescription" className="sm:col-span-2" hint="Shown in search results. Up to 200 characters.">
            <Input id="seoDescription" name="seoDescription" defaultValue={page?.seoDescription} maxLength={200} />
          </Field>
        </div>
      </AdminCard>
      <label className="flex items-center gap-3 text-sm">
        <input type="checkbox" name="published" defaultChecked={page?.published ?? true} className="size-4 accent-primary" />
        Published (visible on the site)
      </label>
      <div className="flex flex-wrap items-center gap-3">
        <SubmitButton>{page ? 'Save page' : 'Create page'}</SubmitButton>
        <Link href="/admin/pages" className={buttonVariants({ variant: 'outline', className: 'h-10 px-5' })}>Cancel</Link>
        <FormMessage state={state} />
      </div>
    </form>
  )
}
