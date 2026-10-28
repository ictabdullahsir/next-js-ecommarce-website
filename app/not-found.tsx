import Link from 'next/link'
import { buttonVariants } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="font-serif text-4xl">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link href="/shop" className={buttonVariants({ className: 'mt-8 h-11 px-6' })}>
        Browse the shop
      </Link>
    </div>
  )
}
