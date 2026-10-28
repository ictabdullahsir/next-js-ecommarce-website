import { Badge } from '@/components/ui/badge'
import { AdminPageHeader } from '@/components/admin/admin-page-header'
import { AdminCard } from '@/components/admin/form-bits'
import { CouponForm } from '@/components/admin/coupon-form'
import { DeleteButton } from '@/components/admin/delete-button'
import { deleteCoupon } from '@/app/admin/actions'
import { getStore } from '@/lib/store'

export const metadata = { title: 'Coupons' }

export default async function CouponsPage() {
  const { coupons } = await getStore()
  return (
    <>
      <AdminPageHeader title="Coupons" description="Discount codes customers can enter in their bag." />
      <div className="flex flex-col gap-6">
        <AdminCard title="New coupon"><CouponForm /></AdminCard>
        <AdminCard title={`All coupons (${coupons.length})`}>
          {coupons.length === 0 && <p className="text-sm text-muted-foreground">No coupons yet. Create one above.</p>}
          <div className="flex flex-col gap-3">
            {coupons.map((c) => (
              <details key={c.code} className="rounded-lg border border-border p-4 open:bg-secondary/40">
                <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm">
                  <span className="font-mono font-semibold">{c.code}</span>
                  <span>{c.type === 'percent' ? `${c.value}% off` : `$${c.value} off`}</span>
                  <Badge variant={c.active ? 'default' : 'outline'}>{c.active ? 'Active' : 'Inactive'}</Badge>
                  <span className="text-muted-foreground">Used {c.used}{c.maxUses ? ` / ${c.maxUses}` : ''}</span>
                </summary>
                <div className="mt-5 flex flex-col gap-5">
                  <CouponForm coupon={c} />
                  <div><DeleteButton action={deleteCoupon.bind(null, c.code)} confirmText={`Delete coupon ${c.code}?`} label="Delete coupon" /></div>
                </div>
              </details>
            ))}
          </div>
        </AdminCard>
      </div>
    </>
  )
}
