import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { EnergyLevel } from '@/lib/energy'
import { cn } from '@/lib/utils'
import { ENERGY_COPY, ENERGY_ORDER, ruleSummary } from './energy-copy'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
  current: EnergyLevel | null
  onPick: (level: EnergyLevel) => Promise<void>
}

export function CheckinDialog({ open, onOpenChange, current, onPick }: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-section">Energi kamu hari ini?</DialogTitle>
          <DialogDescription className="text-body">
            Pilih yang paling jujur. LUMEN menyesuaikan durasi fokus dan jumlah langkah hari ini. Bisa diubah kapan saja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {ENERGY_ORDER.map((lvl) => {
            const { label, icon: Icon } = ENERGY_COPY[lvl]
            const selected = current === lvl
            return (
              <button
                key={lvl}
                type="button"
                aria-pressed={selected}
                onClick={async () => {
                  await onPick(lvl)
                  onOpenChange(false)
                }}
                className={cn(
                  'flex min-h-16 items-center gap-3 rounded-xl border bg-card p-4 text-left transition-colors hover:border-emerald hover:bg-mint focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  // Figma: 2px border when selected; padding drops 1px to keep the card size.
                  selected && 'border-2 border-emerald bg-mint p-[15px]',
                )}
              >
                <Icon aria-hidden="true" className={cn('size-6 shrink-0', selected ? 'text-emerald-deep' : 'text-muted-foreground')} />
                <span className="min-w-0 flex-1">
                  <span className={cn('block text-card-title', selected ? 'text-emerald-deep' : 'text-ink')}>{label}</span>
                  <span className="block text-body text-ink-soft">{ruleSummary(lvl)}</span>
                </span>
                {/* Decorative radio from Figma; state is carried by aria-pressed. */}
                <span aria-hidden="true" className={cn('grid size-5 shrink-0 place-items-center rounded-full border-2', selected ? 'border-emerald' : 'border-muted-foreground')}>
                  {selected && <span className="size-2 rounded-full bg-emerald" />}
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
