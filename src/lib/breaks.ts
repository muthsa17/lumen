import { Eye, Footprints, GlassWater, Hand, PersonStanding, RotateCw, Wind, type LucideIcon } from 'lucide-react'

export type BreakTip = { title: string; desc: string; icon: LucideIcon }

export const BREAKS: BreakTip[] = [
  { title: 'Putar bahu', desc: 'Putar kedua bahu ke belakang 10 kali dengan pelan, lalu ke depan 10 kali.', icon: RotateCw },
  { title: 'Napas 4-7-8', desc: 'Tarik napas 4 hitungan, tahan 7 hitungan, hembuskan 8 hitungan. Ulangi 3 kali.', icon: Wind },
  { title: 'Regangkan leher', desc: 'Miringkan kepala ke kanan, tahan 15 detik, lalu ke kiri. Jangan dipaksa.', icon: PersonStanding },
  { title: 'Lihat jauh 20 detik', desc: 'Alihkan pandangan dari layar ke benda sejauh 6 meter selama 20 detik.', icon: Eye },
  { title: 'Minum air', desc: 'Ambil segelas air dan minum perlahan sebelum lanjut belajar.', icon: GlassWater },
  { title: 'Berdiri & jalan sebentar', desc: 'Berdiri dan jalan keliling ruangan selama satu menit.', icon: Footprints },
  { title: 'Lemaskan jari', desc: 'Kepalkan tangan 5 detik lalu buka lebar. Ulangi 5 kali untuk tangan yang lelah mengetik.', icon: Hand },
]

export function pickBreak(rand: () => number = Math.random): BreakTip {
  return BREAKS[Math.floor(rand() * BREAKS.length)]
}
