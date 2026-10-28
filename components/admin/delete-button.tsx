'use client'

import { useTransition } from 'react'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function DeleteButton({
  action,
  confirmText,
  label = 'Delete',
  iconOnly = false,
}: {
  action: () => Promise<unknown>
  confirmText: string
  label?: string
  iconOnly?: boolean
}) {
  const [pending, start] = useTransition()
  return (
    <Button
      type="button"
      variant="destructive"
      size={iconOnly ? 'icon' : 'default'}
      disabled={pending}
      aria-label={label}
      onClick={() => confirm(confirmText) && start(async () => void (await action()))}
    >
      <Trash2 className="size-4" />
      {!iconOnly && label}
    </Button>
  )
}
