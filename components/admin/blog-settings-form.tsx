'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { saveBlogSettings } from '@/app/admin/blog-actions'
import type { BlogSettings } from '@/lib/blog'

const toggles = [
  { name: 'enabled', label: 'Blog enabled', hint: 'When off, /blog returns 404 and all blog links are hidden.' },
  { name: 'showInNav', label: 'Show in header menu', hint: 'Adds a link to the main navigation.' },
  { name: 'showOnHome', label: 'Show on homepage', hint: 'Displays the three latest stories on the home page.' },
] as const

export function BlogSettingsForm({ settings }: { settings: BlogSettings }) {
  const [state, action] = useActionState(saveBlogSettings, null)

  return (
    <form action={action} className="grid gap-6 lg:grid-cols-3">
      <AdminCard title="Visibility" className="lg:col-span-1">
        <div className="flex flex-col gap-5">
          {toggles.map((t) => (
            <label key={t.name} className="flex items-start gap-3 text-sm">
              <input
                type="checkbox"
                name={t.name}
                defaultChecked={settings[t.name]}
                className="mt-0.5 size-4 accent-primary"
              />
              <span>
                <span className="font-medium">{t.label}</span>
                <span className="block text-muted-foreground">{t.hint}</span>
              </span>
            </label>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Blog page" className="lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Blog title" htmlFor="title" hint="Used for the page heading and menu link.">
            <Input id="title" name="title" defaultValue={settings.title} required maxLength={60} />
          </Field>
          <Field label="Posts per page" htmlFor="postsPerPage">
            <Input
              id="postsPerPage"
              name="postsPerPage"
              type="number"
              min={3}
              max={48}
              defaultValue={settings.postsPerPage}
              required
            />
          </Field>
          <Field label="Description" htmlFor="description" className="sm:col-span-2">
            <Textarea id="description" name="description" rows={3} defaultValue={settings.description} maxLength={300} />
          </Field>
          <Field label="Homepage section heading" htmlFor="homeHeading" className="sm:col-span-2">
            <Input id="homeHeading" name="homeHeading" defaultValue={settings.homeHeading} maxLength={100} />
          </Field>
        </div>
      </AdminCard>

      <div className="flex items-center justify-end gap-4 lg:col-span-3">
        <div className="mr-auto">
          <FormMessage state={state} />
        </div>
        <SubmitButton>Save settings</SubmitButton>
      </div>
    </form>
  )
}
