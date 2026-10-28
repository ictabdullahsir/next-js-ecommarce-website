import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { ProductForm } from '@/components/admin/product-form'
import { getCategories, getImageLibrary } from '@/lib/store'

export const metadata = { title: 'New Product' }

export default async function NewProductPage() {
  const [categories, library] = await Promise.all([getCategories(), getImageLibrary()])
  return (
    <>
      <AdminPageHeader title="New product" description="Add a product to your catalog." />
      <ProductForm categories={categories} library={library} />
    </>
  )
}
