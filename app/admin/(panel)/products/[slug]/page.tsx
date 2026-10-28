import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ExternalLink } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ProductForm } from '@/components/admin/product-form'
import { getCategories, getImageLibrary, getProduct } from '@/lib/store'

export const metadata = { title: 'Edit Product' }

type Props = { params: Promise<{ slug: string }> }

export default async function EditProductPage({ params }: Props) {
  const { slug } = await params
  const [product, categories, library] = await Promise.all([
    getProduct(slug, { includeDrafts: true }),
    getCategories(),
    getImageLibrary(),
  ])
  if (!product) notFound()

  return (
    <>
      <AdminPageHeader
        title={product.name}
        description="Edit product details, pricing and availability."
        action={
          product.published && (
            <Link
              href={`/product/${product.slug}`}
              target="_blank"
              className={buttonVariants({ variant: 'outline', className: 'h-10 px-4' })}
            >
              View in store <ExternalLink className="size-4" />
            </Link>
          )
        }
      />
      <ProductForm key={product.slug} product={product} categories={categories} library={library} />
    </>
  )
}
