import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { EnergyBatteryIcon } from '@/components/AppHeader'
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
          <DialogTitle className="font-heading text-h2 font-bold text-neutral-darker">
            Energi kamu hari ini?
          </DialogTitle>
          <DialogDescription className="text-body-2 text-muted-foreground">
            Pilih yang paling jujur. LUMEN menyesuaikan durasi timer dan target fokus hari ini agar kamu tidak merasa kewalahan.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-2 grid gap-3">
          {ENERGY_ORDER.map((lvl) => {
            const { label } = ENERGY_COPY[lvl]
            const isSelected = current === lvl
            return (
              <button
                key={lvl}
                type="button"
                aria-pressed={isSelected}
                onClick={async () => {
                  await onPick(lvl)
                  onOpenChange(false)
                }}
                className={cn(
                  'group flex items-center gap-3.5 rounded-[12px] border border-border bg-card p-4 text-left transition-all hover:border-green hover:bg-green-light/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                  isSelected && 'border-green bg-green-light ring-1 ring-green shadow-xs',
                )}
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-green-light transition-colors group-hover:bg-green-light-hover">
                  <EnergyBatteryIcon level={lvl} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-heading text-body-1 font-bold text-neutral-darker">
                      {label}
                    </span>
                    {isSelected && (
                      <span className="rounded-full bg-green px-2 py-0.5 text-body-4 font-semibold text-white">
                        Dipilih
                      </span>
                    )}
                  </div>
                  <span className="mt-0.5 block text-body-2 text-neutral-active">
                    {ruleSummary(lvl)}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
