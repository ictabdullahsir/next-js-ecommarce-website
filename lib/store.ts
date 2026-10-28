import { promises as fs } from 'fs'
import path from 'path'
import { connection } from 'next/server'
import type { CategorySlug, Store } from '@/lib/products'
import { getDb } from '@/lib/mongo'
import { seedStore } from '@/lib/seed-data'

// The catalog, site content, coupons, pages, settings and navigation live in one
// MongoDB document (collection "store", _id "main"). It is created from
// lib/seed-data.ts the first time the site runs. Orders have their own collection.
const col = async () => (await getDb()).collection<{ _id: string } & Partial<Store>>('store')

export async function getStore(): Promise<Store> {
  await connection()
  const c = await col()
  const doc = await c.findOne({ _id: 'main' })
  const base = structuredClone(seedStore)
  if (!doc) {
    await c.insertOne({ _id: 'main', ...base })
    return base
  }
  const { _id, ...saved } = doc
  void _id
  return {
    ...base,
    ...saved,
    content: { ...base.content, ...saved.content },
    settings: { ...base.settings, ...saved.settings },
    nav: { ...base.nav, ...saved.nav },
  } as Store
}

export async function saveStore(store: Store) {
  const c = await col()
  await c.replaceOne({ _id: 'main' }, { _id: 'main', ...store }, { upsert: true })
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
