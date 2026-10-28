'use client'

import { useFormStatus } from 'react-dom'
import { CircleAlert, CircleCheck, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import type { FormState } from '@/app/admin/actions'
import { cn } from '@/lib/utils'

export function Field({
  label,
  htmlFor,
  hint,
  className,
  children,
}: {
  label: string
  htmlFor: string
  hint?: string
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export const selectClass =
  'h-9 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50'

export function SubmitButton({ children, className }: { children: React.ReactNode; className?: string }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending} className={cn('h-10 px-5', className)}>
      {pending && <Loader2 className="size-4 animate-spin" />}
      {pending ? 'Saving…' : children}
    </Button>
  )
}

export function FormMessage({ state }: { state: FormState }) {
  if (!state) return null
  if (state.error) {
    return (
      <p role="alert" className="flex items-center gap-2 text-sm text-destructive">
        <CircleAlert className="size-4 shrink-0" /> {state.error}
      </p>
    )
  }
  if (state.success) {
    return (
      <p role="status" className="flex items-center gap-2 text-sm text-primary">
        <CircleCheck className="size-4 shrink-0" /> {state.success}
      </p>
    )
  }
  return null
}

export function AdminCard({
  title,
  description,
  children,
  className,
}: {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('rounded-xl border border-border bg-background p-5 md:p-6', className)}>
      {title && <h2 className="font-semibold">{title}</h2>}
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      <div className={cn(title && 'mt-5')}>{children}</div>
    </section>
  )
}
