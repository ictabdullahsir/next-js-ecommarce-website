'use client'

import { useActionState } from 'react'
import { Input } from '@/components/ui/input'
import { Field, FormMessage, SubmitButton } from '@/components/admin/form-bits'
import { login } from '@/app/admin/actions'

export function LoginForm() {
  const [state, action] = useActionState(login, null)
  return (
    <form action={action} className="mt-6 flex flex-col gap-4">
      <Field label="Password" htmlFor="password">
        <Input id="password" name="password" type="password" autoComplete="current-password" required autoFocus />
      </Field>
      <FormMessage state={state} />
      <SubmitButton className="w-full">Sign in</SubmitButton>
    </form>
  )
}
