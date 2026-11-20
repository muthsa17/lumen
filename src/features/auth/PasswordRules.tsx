import { Check, Circle } from 'lucide-react'
import type { PasswordCheck } from '@/lib/password'
import { cn } from '@/lib/utils'

/** Checklist aturan kata sandi. Dipakai Register dan ResetPassword. */
export function PasswordRules({
  id,
  pw,
}: {
  id: string
  pw: Pick<PasswordCheck, 'length' | 'digit'>
}) {
  return (
    <ul id={id} className="space-y-0.5 text-caption text-muted-foreground">
      {[
        [pw.length, 'Minimal 8 karakter'],
        [pw.digit, 'Mengandung satu angka'],
      ].map(([ok, label]) => (
        <li
          key={String(label)}
          className={cn('flex items-center gap-1.5', ok && 'text-emerald-deep')}
        >
          {ok ? (
            <Check className="size-3" aria-hidden />
          ) : (
            <Circle className="size-3" aria-hidden />
          )}
          {label}
          <span className="sr-only">
            {ok ? ' (terpenuhi)' : ' (belum terpenuhi)'}
          </span>
        </li>
      ))}
    </ul>
  )
}
