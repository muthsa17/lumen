import { Sparkles } from 'lucide-react'
import mindfulStretchSvg from '@/assets/mindful-stretch.svg'
import { useFocusSession } from '@/features/focus/focus-session'

export function NextMindfulBreakCard() {
  const { rules } = useFocusSession()

  return (
    <div className="flex items-center gap-5 rounded-[20px] border border-border bg-card p-6 drop-shadow-xs">
      <div className="flex size-[96px] shrink-0 items-center justify-center overflow-hidden rounded-[20px] border border-yellow/40 bg-yellow-light p-2">
        <img
          src={mindfulStretchSvg}
          alt="Ilustrasi peregangan meja sadar"
          className="size-full object-contain"
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-yellow-light px-2.5 py-0.5 text-[12px] font-medium text-yellow-darker">
          <Sparkles className="size-3 text-yellow-darker" />
          <span>Jeda Sadar Berikutnya</span>
        </div>
        <h3 className="mt-1 font-heading text-[18px] font-semibold leading-[26px] text-neutral-darker">
          Peregangan meja {rules.breakMin} menit
        </h3>
        <p className="text-[16px] leading-[24px] text-neutral-active">
          Lepaskan ketegangan. Segarkan kembali fokusmu.
        </p>
      </div>
    </div>
  )
}
