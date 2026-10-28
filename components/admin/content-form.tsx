'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { ImagePicker } from '@/components/admin/image-picker'
import { saveContent } from '@/app/admin/actions'
import type { SiteContent } from '@/lib/products'

export function ContentForm({ content, library }: { content: SiteContent; library: string[] }) {
  const [state, action] = useActionState(saveContent, null)

  return (
    <form action={action} className="flex flex-col gap-6">
      <AdminCard title="Announcement bar" description="Shown above the header on every page. Leave blank to hide.">
        <Field label="Message" htmlFor="announcement">
          <Input id="announcement" name="announcement" defaultValue={content.announcement} maxLength={200} />
        </Field>
      </AdminCard>

      <AdminCard title="Homepage hero">
        <div className="flex flex-col gap-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Eyebrow" htmlFor="heroEyebrow">
              <Input id="heroEyebrow" name="heroEyebrow" defaultValue={content.heroEyebrow} />
            </Field>
            <Field label="Headline" htmlFor="heroTitle">
              <Input id="heroTitle" name="heroTitle" defaultValue={content.heroTitle} required />
            </Field>
            <Field label="Subtitle" htmlFor="heroSubtitle" className="sm:col-span-2">
              <Textarea id="heroSubtitle" name="heroSubtitle" rows={2} defaultValue={content.heroSubtitle} />
            </Field>
            <Field label="Primary button label" htmlFor="heroPrimaryLabel" hint="Links to /shop">
              <Input id="heroPrimaryLabel" name="heroPrimaryLabel" defaultValue={content.heroPrimaryLabel} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Secondary label" htmlFor="heroSecondaryLabel" hint="Blank hides it">
                <Input id="heroSecondaryLabel" name="heroSecondaryLabel" defaultValue={content.heroSecondaryLabel} />
              </Field>
              <Field label="Secondary link" htmlFor="heroSecondaryHref">
                <Input id="heroSecondaryHref" name="heroSecondaryHref" defaultValue={content.heroSecondaryHref} />
              </Field>
            </div>
          </div>
          <ImagePicker name="heroImage" label="Hero image" defaultValue={content.heroImage} library={library} />
        </div>
      </AdminCard>

      <AdminCard title="Section headings">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Categories section" htmlFor="categoriesHeading">
            <Input id="categoriesHeading" name="categoriesHeading" defaultValue={content.categoriesHeading} />
          </Field>
          <Field label="Featured products section" htmlFor="featuredHeading">
            <Input id="featuredHeading" name="featuredHeading" defaultValue={content.featuredHeading} />
          </Field>
        </div>
      </AdminCard>

      <AdminCard title="Store perks" description="Four highlights shown at the bottom of the homepage. Leave a title blank to hide it.">
        <div className="grid gap-5 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-3 rounded-lg border border-border p-4">
              <Field label={`Perk ${i + 1} title`} htmlFor={`perkTitle${i}`}>
                <Input id={`perkTitle${i}`} name={`perkTitle${i}`} defaultValue={content.perks[i]?.title} />
              </Field>
              <Field label="Description" htmlFor={`perkText${i}`}>
                <Input id={`perkText${i}`} name={`perkText${i}`} defaultValue={content.perks[i]?.text} />
              </Field>
            </div>
          ))}
        </div>
      </AdminCard>

      <AdminCard title="Footer">
        <Field label="Brand tagline" htmlFor="footerTagline">
          <Textarea id="footerTagline" name="footerTagline" rows={2} defaultValue={content.footerTagline} />
        </Field>
      </AdminCard>

      <div className="sticky bottom-0 -mx-4 flex flex-col-reverse gap-3 border-t border-border bg-secondary/95 px-4 py-4 backdrop-blur sm:flex-row sm:items-center sm:justify-end md:mx-0 md:rounded-xl md:border md:bg-background">
        <div className="sm:mr-auto">
          <FormMessage state={state} />
        </div>
        <SubmitButton>Save content</SubmitButton>
      </div>
    </form>
  )
}
