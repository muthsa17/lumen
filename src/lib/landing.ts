import { ENERGY_RULES, type EnergyLevel } from './energy'

export const NAV_LINKS = [
  { id: 'fitur', label: 'Fitur' },
  { id: 'cara-kerja', label: 'Cara Kerja' },
  { id: 'energi-mental', label: 'Energi Mental' },
  { id: 'tanya-jawab', label: 'Tanya Jawab' },
] as const

const { low, medium, high } = ENERGY_RULES

// Figma tampil 5/15/25 menit; aplikasi memakai ENERGY_RULES, jadi semua angka durasi dibaca dari sana.
export const FEATURES = [
  {
    title: 'Langkah Kecil',
    body: 'Pecah tugas besar yang membingungkan menjadi langkah mikro dengan estimasi waktu jelas (5 hingga 15 menit). Tak ada hal yang terlalu berat jika dibagi bertahap.',
    note: 'Bagian kecil 5 hingga 15 mnt',
  },
  {
    title: 'Pengatur Waktu Fokus Adaptif',
    body: `Durasi sesi otomatis menyesuaikan energi mentalmu. Sesi ${low.focusMin} menit saat lelah, atau fokus mendalam ${high.focusMin} menit saat pikiran sedang jernih.`,
    note: 'Menyesuaikan kapasitas harianmu',
  },
  {
    title: 'Jeda',
    body: 'Panduan pemulihan lembut saat fokusmu terpecah. Gerakan bahu santai, tarik napas dalam, dan pengingat minum untuk mengembalikan ketenangan.',
    note: 'Istirahat tanpa rasa bersalah',
  },
]

export const STEPS = [
  {
    title: 'Tambah tugas besar',
    body: 'Tuliskan apa pun yang terasa membebani pikiranmu ke dalam LUMEN, seperti "Tulis laporan skripsi" atau "Rapikan meja kerja".',
  },
  {
    title: 'Pecah jadi langkah kecil',
    body: 'LUMEN mengurai tugas besar menjadi 3 atau 4 tindakan mikro dengan perkiraan waktu yang wajar agar kamu tahu persis dari mana harus memulai.',
  },
  {
    title: 'Mulai sesi fokus',
    body: 'Aktifkan mode tugas tunggal. Layar menyembunyikan gangguan lain sehingga perhatianmu bisa terfokus pada satu hal dalam satu waktu.',
  },
]

export const ENERGY_MODES: {
  level: EnergyLevel
  focusMin: number
  badge: string
  title: string
  body: string
  note: string
}[] = [
  {
    level: 'low',
    focusMin: low.focusMin,
    badge: 'Energi Rendah (Mode Tenang)',
    title: `Fokus ringan ${low.focusMin} menit`,
    body: `Cocok saat lelah atau sulit memulai. Fokus ${low.focusMin} menit, jeda ${low.breakMin} menit, dan paling banyak ${low.maxTasks} langkah. Tindakan sekecil apa pun tetap dihargai.`,
    note: 'Saran: pemanasan santai',
  },
  {
    level: 'medium',
    focusMin: medium.focusMin,
    badge: 'Energi Sedang (Seimbang)',
    title: `Fokus teratur ${medium.focusMin} menit`,
    body: `Kemajuan teratur dan nyaman. Fokus ${medium.focusMin} menit, jeda ${medium.breakMin} menit, dan paling banyak ${medium.maxTasks} langkah agar kamu tidak ragu melangkah.`,
    note: 'Paling sering digunakan sehari-hari',
  },
  {
    level: 'high',
    focusMin: high.focusMin,
    badge: 'Energi Tinggi (Hiperfokus)',
    title: `Fokus mendalam ${high.focusMin} menit`,
    body: `Saat motivasi sedang tinggi dan siap menyelami pekerjaan. Fokus ${high.focusMin} menit, jeda ${high.breakMin} menit, disertai pengingat lembut untuk meregangkan tubuh.`,
    note: 'Saran: sesi mendalam beruntun',
  },
]

export const FAQ = [
  {
    q: 'Apa bedanya LUMEN dengan aplikasi Pomodoro biasa?',
    a: 'Pomodoro biasa memberi durasi yang sama setiap hari. LUMEN bertanya dulu bagaimana energimu, lalu menyesuaikan lama fokus, lama jeda, dan jumlah langkah untuk hari itu.',
  },
  {
    q: 'Bagaimana jika saya macet atau belum menyelesaikan langkah saya?',
    a: 'Tidak apa-apa. Langkah yang belum selesai tidak dihitung sebagai kegagalan. Kamu bisa menggesernya ke hari lain, memecahnya lebih kecil, atau mengambil jeda dulu.',
  },
  {
    q: 'Apakah saya harus punya diagnosis untuk memakai LUMEN?',
    a: 'Tidak. LUMEN dibuat untuk siapa pun yang merasa kewalahan oleh tugas kuliah. Kamu tidak perlu menjelaskan apa-apa untuk mulai.',
  },
  {
    q: 'Apakah LUMEN bisa dipakai di ponsel dan tablet?',
    a: 'Bisa. Tampilannya menyesuaikan layar ponsel, tablet, maupun laptop, lewat browser apa saja.',
  },
]
