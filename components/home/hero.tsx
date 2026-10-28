import Image from 'next/image'
import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'
import type { SiteContent } from '@/lib/products'

export function Hero({ content }: { content: SiteContent }) {
  return (
    <section className="relative">
      <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
        <Image
          src={content.heroImage || '/placeholder.svg'}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/60 via-foreground/20 to-transparent" />
        <div className="relative mx-auto flex h-full max-w-7xl flex-col justify-center px-4 md:px-6">
          {content.heroEyebrow && (
            <p className="text-sm uppercase tracking-[0.2em] text-background/80">
              {content.heroEyebrow}
            </p>
          )}
          <h1 className="mt-4 max-w-xl text-balance font-serif text-5xl leading-tight text-background md:text-6xl">
            {content.heroTitle}
          </h1>
          {content.heroSubtitle && (
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-background/85">
              {content.heroSubtitle}
            </p>
          )}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop" className={buttonVariants({ className: 'h-12 px-7 text-base' })}>
              {content.heroPrimaryLabel}
            </Link>
            {content.heroSecondaryLabel && (
              <Link
                href={content.heroSecondaryHref}
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-12 border-background bg-transparent px-7 text-base text-background',
                })}
              >
                {content.heroSecondaryLabel}
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
