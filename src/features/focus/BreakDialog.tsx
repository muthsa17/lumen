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
          <DialogTitle className="font-heading text-h2">Waktunya jeda</DialogTitle>
          <DialogDescription className="text-body-2">Sesi fokus selesai. Istirahat sebentar sebelum lanjut.</DialogDescription>
        </DialogHeader>
        {tip && Icon && (
          <div className="flex gap-3 rounded-lg bg-yellow-light p-4 ring-1 ring-yellow">
            <Icon aria-hidden="true" className="mt-0.5 size-7 shrink-0 text-yellow-darker" />
            <div>
              <p className="font-heading text-h3 font-semibold text-ink">{tip.title}</p>
              <p className="mt-1 text-body-1 text-neutral-darker">{tip.desc}</p>
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
