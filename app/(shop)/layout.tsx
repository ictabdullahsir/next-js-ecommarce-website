import { CartProvider } from '@/components/cart-provider'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getStore } from '@/lib/store'

export default async function ShopLayout({ children }: { children: React.ReactNode }) {
  const { content, nav, settings } = await getStore()
  return (
    <CartProvider>
      <SiteHeader announcement={content.announcement} links={nav.header} storeName={settings.storeName} />
      <main>{children}</main>
      <SiteFooter tagline={content.footerTagline} columns={nav.footer} settings={settings} />
    </CartProvider>
  )
}
