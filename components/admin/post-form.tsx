'use client'

import Link from 'next/link'
import { useActionState, useState } from 'react'
import { buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { AdminCard, Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { ImagePicker } from '@/components/admin/image-picker'
import { Markdown } from '@/components/blog/markdown'
import { savePost } from '@/app/admin/blog-actions'
import { readingTime, todayISO, type BlogPost } from '@/lib/blog'
import { cn } from '@/lib/utils'

function Checkbox({
  name,
  defaultChecked,
  label,
  hint,
}: {
  name: string
  defaultChecked: boolean
  label: string
  hint: string
}) {
  return (
    <label className="flex items-start gap-3 text-sm">
      <input type="checkbox" name={name} defaultChecked={defaultChecked} className="mt-0.5 size-4 accent-primary" />
      <span>
        <span className="font-medium">{label}</span>
        <span className="block text-muted-foreground">{hint}</span>
      </span>
    </label>
  )
}

export function PostForm({
  post,
  library,
  categories,
}: {
  post?: BlogPost
  library: string[]
  categories: string[]
}) {
  const [state, action] = useActionState(savePost, null)
  const [content, setContent] = useState(post?.content ?? '')
  const [tab, setTab] = useState<'write' | 'preview'>('write')

  return (
    <form action={action} className="flex flex-col gap-6">
      <input type="hidden" name="originalSlug" value={post?.slug ?? ''} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-6 lg:col-span-2">
          <AdminCard title="Post">
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Title" htmlFor="title" className="sm:col-span-2">
                <Input id="title" name="title" defaultValue={post?.title} required maxLength={160} />
              </Field>
              <Field label="URL slug" htmlFor="slug" hint="Leave blank to generate from the title.">
                <Input id="slug" name="slug" defaultValue={post?.slug} placeholder="my-new-story" />
              </Field>
              <Field label="Author" htmlFor="author">
                <Input id="author" name="author" defaultValue={post?.author ?? 'The LOOM Studio'} maxLength={80} />
              </Field>
              <Field
                label="Excerpt"
                htmlFor="excerpt"
                hint="Short summary shown on cards and in search results."
                className="sm:col-span-2"
              >
                <Textarea id="excerpt" name="excerpt" rows={2} defaultValue={post?.excerpt} maxLength={400} />
              </Field>
            </div>
          </AdminCard>

          <AdminCard>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold">Content</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Markdown supported: ## headings, **bold**, lists, &gt; quotes, [links](/shop) and images.
                </p>
              </div>
              <div role="tablist" aria-label="Editor mode" className="flex rounded-md border border-border p-0.5 text-sm">
                {(['write', 'preview'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    role="tab"
                    aria-selected={tab === t}
                    onClick={() => setTab(t)}
                    className={cn(
                      'rounded px-3 py-1 capitalize',
                      tab === t ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-5">
              <Textarea
                id="content"
                name="content"
                aria-label="Post content"
                rows={20}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={50000}
                required
                className={cn('font-mono text-sm leading-relaxed', tab !== 'write' && 'hidden')}
              />
              {tab === 'preview' && (
                <div className="min-h-80 rounded-md border border-border p-5">
                  {content.trim() ? (
                    <Markdown content={content} />
                  ) : (
                    <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                  )}
                </div>
              )}
              <p className="mt-2 text-xs text-muted-foreground">
                {content.trim() ? content.trim().split(/\s+/).length : 0} words &middot; {readingTime(content)} min read
              </p>
            </div>
          </AdminCard>

          <AdminCard title="Cover image">
            <div className="flex flex-col gap-5">
              <ImagePicker name="coverImage" defaultValue={post?.coverImage ?? ''} library={library} label="Image" />
              <Field label="Alt text" htmlFor="coverAlt" hint="Describe the image for screen readers.">
                <Input id="coverAlt" name="coverAlt" defaultValue={post?.coverAlt} maxLength={200} />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Search engine listing" description="Optional overrides for the page title and meta description.">
            <div className="flex flex-col gap-5">
              <Field label="SEO title" htmlFor="seoTitle">
                <Input id="seoTitle" name="seoTitle" defaultValue={post?.seoTitle} maxLength={160} />
              </Field>
              <Field label="Meta description" htmlFor="seoDescription">
                <Textarea
                  id="seoDescription"
                  name="seoDescription"
                  rows={2}
                  defaultValue={post?.seoDescription}
                  maxLength={300}
                />
              </Field>
            </div>
          </AdminCard>
        </div>

        <div className="flex flex-col gap-6">
          <AdminCard title="Publishing">
            <div className="flex flex-col gap-5">
              <Checkbox
                name="published"
                defaultChecked={post ? post.status === 'published' : true}
                label="Published"
                hint="Unchecked posts are saved as drafts."
              />
              <Checkbox
                name="featured"
                defaultChecked={post?.featured ?? false}
                label="Featured"
                hint="Highlighted at the top of the blog."
              />
              <Field label="Publish date" htmlFor="publishedAt" hint="Future dates schedule the post.">
                <Input
                  id="publishedAt"
                  name="publishedAt"
                  type="date"
                  defaultValue={post?.publishedAt ?? todayISO()}
                  required
                />
              </Field>
            </div>
          </AdminCard>

          <AdminCard title="Organization">
            <div className="flex flex-col gap-5">
              <Field label="Category" htmlFor="category" hint="Pick an existing one or type a new one.">
                <Input
                  id="category"
                  name="category"
                  list="post-categories"
                  defaultValue={post?.category ?? 'Journal'}
                  maxLength={60}
                />
                <datalist id="post-categories">
                  {categories.map((c) => (
                    <option key={c} value={c} />
                  ))}
                </datalist>
              </Field>
              <Field label="Tags" htmlFor="tags" hint="Separate with commas.">
                <Input id="tags" name="tags" defaultValue={post?.tags.join(', ')} placeholder="linen, care" />
              </Field>
            </div>
          </AdminCard>
        </div>
      </div>

      <div className="sticky bottom-0 -mx-4 flex flex-wrap items-center justify-end gap-3 border-t border-border bg-background/95 px-4 py-4 backdrop-blur md:-mx-8 md:px-8">
        <div className="mr-auto">
          <FormMessage state={state} />
        </div>
        <Link href="/admin/blog" className={buttonVariants({ variant: 'outline', className: 'h-10 px-5' })}>
          Cancel
        </Link>
        <SubmitButton>{post ? 'Save post' : 'Create post'}</SubmitButton>
      </div>
    </form>
  )
}
