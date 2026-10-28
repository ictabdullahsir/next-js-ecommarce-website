'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { FormState } from '@/app/admin/actions'
import { requireAdmin } from '@/lib/admin-auth'
import { RESERVED_POST_SLUGS, todayISO, type BlogPost, type BlogSettings } from '@/lib/blog'
import { formList, formText, isSafeImagePath } from '@/lib/form-data'
import { slugify } from '@/lib/products'
import { getStore, saveStore } from '@/lib/store'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function refreshSite() {
  revalidatePath('/', 'layout')
}

export async function savePost(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()

  const originalSlug = formText(formData, 'originalSlug', 120)
  const title = formText(formData, 'title', 160)
  const slug = slugify(formText(formData, 'slug', 120) || title)
  const excerpt = formText(formData, 'excerpt', 400)
  const content = formText(formData, 'content', 50000)
  const coverImage = formText(formData, 'coverImage', 500)
  const coverAlt = formText(formData, 'coverAlt', 200)
  const author = formText(formData, 'author', 80)
  const category = formText(formData, 'category', 60)
  const tags = formList(formData, 'tags', 12).map((t) => t.slice(0, 40).toLowerCase())
  const publishedAt = formText(formData, 'publishedAt', 10) || todayISO()
  const seoTitle = formText(formData, 'seoTitle', 160)
  const seoDescription = formText(formData, 'seoDescription', 300)

  if (!title) return { error: 'Title is required.' }
  if (!slug) return { error: 'A valid URL slug is required.' }
  if (RESERVED_POST_SLUGS.includes(slug)) return { error: `"${slug}" is a reserved slug.` }
  if (!content) return { error: 'Write some content for the post.' }
  if (!coverImage || !isSafeImagePath(coverImage)) return { error: 'Choose a valid cover image.' }
  if (!DATE_PATTERN.test(publishedAt) || Number.isNaN(Date.parse(publishedAt))) {
    return { error: 'Publish date must be a valid date.' }
  }

  const store = await getStore()
  if (store.posts.some((p) => p.slug === slug && p.slug !== originalSlug)) {
    return { error: `Another post already uses the slug "${slug}".` }
  }

  const post: BlogPost = {
    slug,
    title,
    excerpt,
    content,
    coverImage,
    coverAlt: coverAlt || title,
    author: author || 'The LOOM Studio',
    category: category || 'Journal',
    tags,
    publishedAt,
    updatedAt: todayISO(),
    status: formData.get('published') === 'on' ? 'published' : 'draft',
    featured: formData.get('featured') === 'on',
    seoTitle: seoTitle || undefined,
    seoDescription: seoDescription || undefined,
  }

  const index = originalSlug ? store.posts.findIndex((p) => p.slug === originalSlug) : -1
  if (index >= 0) store.posts[index] = post
  else store.posts.unshift(post)

  await saveStore(store)
  refreshSite()
  redirect('/admin/blog')
}

async function updatePost(slug: string, update: (post: BlogPost) => void) {
  await requireAdmin()
  if (typeof slug !== 'string') return
  const store = await getStore()
  const post = store.posts.find((p) => p.slug === slug)
  if (!post) return
  update(post)
  post.updatedAt = todayISO()
  await saveStore(store)
  refreshSite()
}

export async function togglePostStatus(slug: string) {
  await updatePost(slug, (post) => {
    post.status = post.status === 'published' ? 'draft' : 'published'
  })
}

export async function togglePostFeatured(slug: string) {
  await updatePost(slug, (post) => {
    post.featured = !post.featured
  })
}

export async function duplicatePost(slug: string) {
  await requireAdmin()
  if (typeof slug !== 'string') return
  const store = await getStore()
  const source = store.posts.find((p) => p.slug === slug)
  if (!source) return

  let copySlug = `${source.slug}-copy`
  for (let i = 2; store.posts.some((p) => p.slug === copySlug); i++) {
    copySlug = `${source.slug}-copy-${i}`
  }

  store.posts.unshift({
    ...source,
    slug: copySlug,
    title: `${source.title} (Copy)`,
    status: 'draft',
    featured: false,
    updatedAt: todayISO(),
  })
  await saveStore(store)
  refreshSite()
}

export async function deletePost(slug: string) {
  await requireAdmin()
  if (typeof slug !== 'string') return
  const store = await getStore()
  store.posts = store.posts.filter((p) => p.slug !== slug)
  await saveStore(store)
  refreshSite()
}

export async function saveBlogSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  await requireAdmin()
  const postsPerPage = Number(formText(formData, 'postsPerPage', 3))
  if (!Number.isInteger(postsPerPage) || postsPerPage < 3 || postsPerPage > 48) {
    return { error: 'Posts per page must be a whole number between 3 and 48.' }
  }

  const settings: BlogSettings = {
    enabled: formData.get('enabled') === 'on',
    title: formText(formData, 'title', 60) || 'Journal',
    description: formText(formData, 'description', 300),
    showInNav: formData.get('showInNav') === 'on',
    showOnHome: formData.get('showOnHome') === 'on',
    homeHeading: formText(formData, 'homeHeading', 100) || 'From the journal',
    postsPerPage,
  }

  const store = await getStore()
  store.blog = settings
  await saveStore(store)
  refreshSite()
  return { success: 'Blog settings saved.' }
}
