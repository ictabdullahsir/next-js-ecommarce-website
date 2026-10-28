import { CartProvider } from '@/components/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getStore } from '@/lib/store'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { content, blog } = await getStore()
  const blogLabel = blog.enabled ? blog.title : undefined
  return (
    <CartProvider>
      <SiteHeader announcement={content.announcement} blogLabel={blog.showInNav ? blogLabel : undefined} />
      <main>{children}</main>
      <SiteFooter tagline={content.footerTagline} blogLabel={blogLabel} />
    </CartProvider>
  )
}
