import { promises as fs } from 'fs'
import path from 'path'
import { connection } from 'next/server'
import type { CategorySlug, Store } from '@/lib/products'
import { seedStore } from '@/lib/seed-data'
import { isPostLive, sortPostsByDate } from '@/lib/blog'

const STORE_FILE = path.join(process.cwd(), 'data', 'store.json')

// Fallback for read-only filesystems (e.g. serverless deployments), where edits
// only live for the lifetime of the running instance.
let memoryStore: Store | null = null

export async function getStore(): Promise<Store> {
  await connection()
  if (memoryStore) return memoryStore
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8')
    return withDefaults(JSON.parse(raw) as Partial<Store>)
  } catch {
    return structuredClone(seedStore)
  }
}

// Older store files were saved before the blog existed, so fill in missing sections.
function withDefaults(store: Partial<Store>): Store {
  const seed = structuredClone(seedStore)
  return {
    ...seed,
    ...store,
    posts: store.posts ?? seed.posts,
    blog: { ...seed.blog, ...store.blog },
  }
}

export async function getBlogSettings() {
  return (await getStore()).blog
}

export async function getLivePosts() {
  const { posts } = await getStore()
  return sortPostsByDate(posts.filter(isPostLive))
}

export async function getPost(slug: string, { includeDrafts = false } = {}) {
  const { posts } = await getStore()
  return posts.find((p) => p.slug === slug && (includeDrafts || isPostLive(p)))
}

export async function saveStore(store: Store) {
  memoryStore = store
  try {
    await fs.mkdir(path.dirname(STORE_FILE), { recursive: true })
    await fs.writeFile(STORE_FILE, JSON.stringify(store, null, 2), 'utf8')
  } catch (error) {
    console.error('Could not persist store to disk, keeping changes in memory.', error)
  }
}

export async function getContent() {
  return (await getStore()).content
}

export async function getCategories() {
  return (await getStore()).categories
}

export async function getCategory(slug: string) {
  return (await getCategories()).find((c) => c.slug === slug)
}

export async function getPublishedProducts(category?: CategorySlug) {
  const { products } = await getStore()
  return products.filter((p) => p.published && (!category || p.category === category))
}

export async function getProduct(slug: string, { includeDrafts = false } = {}) {
  const { products } = await getStore()
  return products.find((p) => p.slug === slug && (includeDrafts || p.published))
}

export async function getImageLibrary() {
  const folders = ['images', 'uploads']
  const files: string[] = []
  for (const folder of folders) {
    try {
      const entries = await fs.readdir(path.join(process.cwd(), 'public', folder))
      for (const entry of entries) {
        if (/\.(png|jpe?g|webp|gif|svg)$/i.test(entry)) files.push(`/${folder}/${entry}`)
      }
    } catch {
      // folder may not exist
    }
  }
  return files.sort()
}
