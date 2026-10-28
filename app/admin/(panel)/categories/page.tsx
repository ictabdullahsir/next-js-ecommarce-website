import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { CategoryForm } from '@/components/admin/category-form'
import { getCategories, getImageLibrary } from '@/lib/store'

export const metadata = { title: 'Categories' }

export default async function CategoriesPage() {
  const [categories, library] = await Promise.all([getCategories(), getImageLibrary()])
  return (
    <>
      <AdminPageHeader
        title="Categories"
        description="Add, edit and remove the collections shown on your homepage and in the shop."
      />
      <div className="flex flex-col gap-6">
        {categories.map((c) => (
          <CategoryForm key={c.slug} category={c} library={library} />
        ))}
        <CategoryForm library={library} />
      </div>
    </>
  )
}
