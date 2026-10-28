import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getStore } from '@/lib/store'

type Props = { params: Promise<{ slug: string }> }

async function find(slug: string) {
  return (await getStore()).pages.find((p) => p.slug === slug && p.published)
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await find((await params).slug)
  return page ? { title: page.title, description: page.seoDescription } : {}
}

// Plain-text content: blank line = new paragraph, "## " = heading. No raw HTML is rendered.
export default async function CmsPage({ params }: Props) {
  const page = await find((await params).slug)
  if (!page) notFound()
  const blocks = page.content.split(/\n{2,}/).map((b) => b.trim()).filter(Boolean)
  return (
    <article className="mx-auto max-w-2xl px-4 py-14 md:py-20">
      <h1 className="font-serif text-4xl md:text-5xl">{page.title}</h1>
      <div className="mt-8 flex flex-col gap-5 leading-relaxed">
        {blocks.map((b, i) =>
          b.startsWith('## ') ? (
            <h2 key={i} className="mt-4 font-serif text-2xl">
              {b.slice(3)}
            </h2>
          ) : (
            <p key={i} className="whitespace-pre-line text-muted-foreground">
              {b}
            </p>
          ),
        )}
      </div>
    </article>
  )
}
