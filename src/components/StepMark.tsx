import { cn } from '@/lib/utils'

/** LUMEN's "small steps" motif: three bars that grow, the last one in the energy accent. */
export function StepMark({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('flex flex-col gap-1.5', className)}>
      <span className="h-2 w-8 rounded-full bg-emerald" />
      <span className="h-2 w-14 rounded-full bg-emerald" />
      <span className="h-2 w-20 rounded-full bg-amber" />
    </div>
  )
}
