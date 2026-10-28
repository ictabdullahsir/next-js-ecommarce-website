'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { ImagePicker } from '@/components/admin/image-picker'
import { saveCategory } from '@/app/admin/actions'
import type { Category } from '@/lib/products'

export function CategoryForm({ category, library }: { category: Category; library: string[] }) {
  const [state, action] = useActionState(saveCategory, null)
  const id = (field: string) => `${category.slug}-${field}`

  return (
    <AdminCard title={category.name} description={`/shop/${category.slug}`}>
      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="slug" value={category.slug} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Display name" htmlFor={id('name')}>
            <Input id={id('name')} name="name" defaultValue={category.name} required maxLength={60} />
          </Field>
          <Field label="Tagline" htmlFor={id('tagline')}>
            <Input id={id('tagline')} name="tagline" defaultValue={category.tagline} maxLength={200} />
          </Field>
        </div>
        <ImagePicker name="image" label="Cover image" defaultValue={category.image} library={library} />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="sm:mr-auto">
            <FormMessage state={state} />
          </div>
          <SubmitButton>Save {category.name}</SubmitButton>
        </div>
      </form>
    </AdminCard>
  )
}
