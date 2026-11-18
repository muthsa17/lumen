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
          <DialogTitle className="font-heading text-h2">Energi kamu hari ini?</DialogTitle>
          <DialogDescription className="text-body-2">
            Pilih yang paling jujur. LUMEN menyesuaikan durasi fokus dan jumlah langkah hari ini. Bisa diubah kapan saja.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2">
          {ENERGY_ORDER.map((lvl) => {
            const { label, icon: Icon } = ENERGY_COPY[lvl]
            return (
              <button
                key={lvl}
                type="button"
                aria-pressed={current === lvl}
                onClick={async () => {
                  await onPick(lvl)
                  onOpenChange(false)
                }}
                className={cn(
                  'flex min-h-16 items-center gap-3 rounded-lg border bg-card p-3 text-left transition-colors hover:border-green hover:bg-green-light focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none',
                  current === lvl && 'border-green bg-green-light',
                )}
              >
                <Icon aria-hidden="true" className="size-6 shrink-0 text-green-darker" />
                <span>
                  <span className="block font-heading text-h4 font-bold text-ink">{label}</span>
                  <span className="block text-body-2 text-neutral-darker">{ruleSummary(lvl)}</span>
                </span>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
