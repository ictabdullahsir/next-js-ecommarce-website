'use client'

import { useActionState, useState } from 'react'
import { Input } from '@/components/ui/input'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { DeleteButton } from '@/components/admin/delete-button'
import { ImagePicker } from '@/components/admin/image-picker'
import { deleteCategory, saveCategory, type FormState } from '@/app/admin/actions'
import type { Category } from '@/lib/products'

export function CategoryForm({ category, library }: { category?: Category; library: string[] }) {
  const [state, action] = useActionState(saveCategory, null)
  const [delState, setDelState] = useState<FormState>(null)
  const slug = category?.slug ?? 'new'
  const id = (field: string) => `${slug}-${field}`

  return (
    <AdminCard title={category?.name ?? 'Add a category'} description={category ? `/shop/${category.slug}` : 'Appears on the homepage and in the shop.'}>
      <form action={action} className="flex flex-col gap-5">
        <input type="hidden" name="originalSlug" value={category?.slug ?? ''} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Display name" htmlFor={id('name')}>
            <Input id={id('name')} name="name" defaultValue={category?.name} required maxLength={60} />
          </Field>
          <Field label="Tagline" htmlFor={id('tagline')}>
            <Input id={id('tagline')} name="tagline" defaultValue={category?.tagline} maxLength={200} />
          </Field>
          {!category && (
            <Field label="URL slug" htmlFor={id('slug')} hint="Leave blank to generate from the name.">
              <Input id={id('slug')} name="slug" placeholder="accessories" />
            </Field>
          )}
        </div>
        <ImagePicker name="image" label="Cover image" defaultValue={category?.image ?? ''} library={library} />
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
          <div className="flex flex-col gap-1 sm:mr-auto">
            <FormMessage state={state} />
            <FormMessage state={delState} />
          </div>
          {category && (
            <DeleteButton
              label="Delete"
              confirmText={`Delete the ${category.name} category?`}
              action={async () => setDelState(await deleteCategory(category.slug))}
            />
          )}
          <SubmitButton>{category ? `Save ${category.name}` : 'Add category'}</SubmitButton>
        </div>
      </form>
    </AdminCard>
  )
}
