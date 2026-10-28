import Image from 'next/image'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ProductRowActions } from '@/components/admin/product-row-actions'
import { formatPrice, isCategorySlug } from '@/lib/products'
import { getStore } from '@/lib/store'
import { cn } from '@/lib/utils'

export const metadata = { title: 'Products' }

type Props = { searchParams: Promise<{ category?: string }> }

export default async function ProductsPage({ searchParams }: Props) {
  const { category } = await searchParams
  const { products, categories } = await getStore()
  const filter = category && isCategorySlug(category) ? category : undefined
  const rows = filter ? products.filter((p) => p.category === filter) : products

  const tabs = [{ slug: undefined, name: 'All' }, ...categories]

  return (
    <>
      <AdminPageHeader
        title="Products"
        description={`${products.length} products in your catalog.`}
        action={
          <Link href="/admin/products/new" className={buttonVariants({ className: 'h-10 px-4' })}>
            <Plus className="size-4" /> New product
          </Link>
        }
      />

      <nav aria-label="Filter by category" className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => {
          const active = t.slug === filter
          return (
            <Link
              key={t.name}
              href={t.slug ? `/admin/products?category=${t.slug}` : '/admin/products'}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm',
                active
                  ? 'border-foreground bg-foreground text-background'
                  : 'border-border bg-background hover:border-foreground/40',
              )}
            >
              {t.name}
            </Link>
          )
        })}
      </nav>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Product</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="hidden md:table-cell">Status</TableHead>
              <TableHead className="pr-4 text-right">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                  No products yet.
                </TableCell>
              </TableRow>
            )}
            {rows.map((p) => (
              <TableRow key={p.slug}>
                <TableCell className="pl-4">
                  <Link href={`/admin/products/${p.slug}`} className="flex items-center gap-3">
                    <span className="relative size-11 shrink-0 overflow-hidden rounded-md bg-secondary">
                      <Image src={p.image || '/placeholder.svg'} alt="" fill sizes="44px" className="object-cover" />
                    </span>
                    <span className="min-w-0">
                      <span className="block max-w-48 truncate font-medium hover:underline">{p.name}</span>
                      <span className="block text-xs text-muted-foreground">{p.type}</span>
                    </span>
                  </Link>
                </TableCell>
                <TableCell className="hidden capitalize sm:table-cell">{p.category}</TableCell>
                <TableCell>
                  {formatPrice(p.price)}
                  {p.compareAt && (
                    <span className="ml-2 text-xs text-muted-foreground line-through">
                      {formatPrice(p.compareAt)}
                    </span>
                  )}
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex gap-1.5">
                    {p.published ? <Badge>Published</Badge> : <Badge variant="outline">Draft</Badge>}
                    {p.isNew && <Badge variant="secondary">New</Badge>}
                  </div>
                </TableCell>
                <TableCell className="pr-4 text-right">
                  <ProductRowActions slug={p.slug} name={p.name} published={p.published} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}
