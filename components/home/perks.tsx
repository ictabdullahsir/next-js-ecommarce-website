import { Leaf, RotateCcw, ShieldCheck, Truck } from 'lucide-react'
import type { Perk } from '@/lib/products'

const icons = [Truck, RotateCcw, Leaf, ShieldCheck]

export function Perks({ perks }: { perks: Perk[] }) {
  const visible = perks.filter((p) => p.title)
  if (visible.length === 0) return null
  return (
    <section className="mx-auto max-w-7xl px-4 pt-20 md:px-6" aria-label="Why shop with us">
      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {perks.map(({ title, text }, i) => {
          if (!title) return null
          const Icon = icons[i % icons.length]
          return (
            <li key={i} className="flex gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                <Icon className="size-5" />
              </span>
              <div>
                <h3 className="font-medium">{title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
