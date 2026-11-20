import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { BreakTip } from '@/lib/breaks'

type Props = { tip: BreakTip | null; breakMin: number; onStartBreak: () => void; onSkip: () => void }

export function BreakDialog({ tip, breakMin, onStartBreak, onSkip }: Props) {
  const Icon = tip?.icon
  return (
    <Dialog open={tip !== null} onOpenChange={(o) => !o && onSkip()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-section">Waktunya jeda</DialogTitle>
          <DialogDescription className="text-body">Sesi fokus selesai. Istirahat sebentar sebelum lanjut.</DialogDescription>
        </DialogHeader>
        {tip && Icon && (
          <div className="flex gap-3 rounded-lg bg-cream p-4 ring-1 ring-gold">
            <Icon aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-ink" />
            <div>
              <p className="text-card-title font-semibold text-ink">{tip.title}</p>
              <p className="mt-1 text-body text-ink-soft">{tip.desc}</p>
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={onSkip}>
            Lewati jeda
          </Button>
          <Button onClick={onStartBreak}>Mulai jeda {breakMin} menit</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
