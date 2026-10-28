export type PostStatus = 'published' | 'draft'
export type PostState = 'published' | 'scheduled' | 'draft'

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  coverAlt: string
  author: string
  category: string
  tags: string[]
  publishedAt: string
  updatedAt: string
  status: PostStatus
  featured: boolean
  seoTitle?: string
  seoDescription?: string
}

export type BlogSettings = {
  enabled: boolean
  title: string
  description: string
  showInNav: boolean
  showOnHome: boolean
  homeHeading: string
  postsPerPage: number
}

export const RESERVED_POST_SLUGS = ['new', 'settings']

export function todayISO() {
  return new Date().toISOString().slice(0, 10)
}

export function getPostState(post: BlogPost): PostState {
  if (post.status === 'draft') return 'draft'
  return post.publishedAt > todayISO() ? 'scheduled' : 'published'
}

export function isPostLive(post: BlogPost) {
  return getPostState(post) === 'published'
}

export function sortPostsByDate(posts: BlogPost[]) {
  return [...posts].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
}

export function readingTime(content: string) {
  const words = content.trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 220))
}

export function formatPostDate(date: string) {
  const parsed = new Date(`${date}T00:00:00Z`)
  if (Number.isNaN(parsed.getTime())) return date
  return new Intl.DateTimeFormat('en-US', { dateStyle: 'long', timeZone: 'UTC' }).format(parsed)
}
