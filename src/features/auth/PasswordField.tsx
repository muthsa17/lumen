import { useState, type ComponentProps } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

/** Input kata sandi dengan tombol tampil/sembunyi. */
export function PasswordField({
  label = 'kata sandi',
  ...props
}: Omit<ComponentProps<typeof Input>, 'type'> & { label?: string }) {
  const [shown, setShown] = useState(false)
  return (
    <div className="relative">
      <Input
        {...props}
        type={shown ? 'text' : 'password'}
        className={cn('pr-11', props.className)}
      />
      <button
        type="button"
        onClick={() => setShown((s) => !s)}
        aria-label={`${shown ? 'Sembunyikan' : 'Tampilkan'} ${label}`}
        className="absolute inset-y-0 right-0 grid w-11 place-items-center rounded-r-lg text-muted-foreground hover:text-ink focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
      >
        {shown ? (
          <EyeOff className="size-4" aria-hidden />
        ) : (
          <Eye className="size-4" aria-hidden />
        )}
      </button>
    </div>
  )
}
