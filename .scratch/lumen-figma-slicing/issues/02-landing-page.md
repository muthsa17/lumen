# 02: Landing page

**What to build:** Pengunjung melihat landing page sesuai frame Figma `166:449`: nav dengan anchor, hero dengan mock kartu sesi, fitur, cara kerja, mode energi, FAQ accordion, CTA, dan footer. Semua tombol ajakan mengarah ke pendaftaran; pengguna yang sudah login diarahkan ke dasbor.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Tampilan desktop 1280 sesuai Figma; teks yang gagal AA diganti token yang lolos AA, dan tiap penggantian dicatat
- [ ] Link Fitur/Cara Kerja/Energi Mental/Tanya Jawab menggulir ke bagian yang sesuai
- [ ] "Mulai Sekarang", "Mulai Gratis", dan CTA bawah ke `/register`; "Masuk" ke `/login`; "Buka Aplikasi" ke `/app`
- [ ] Durasi tiap mode energi dibaca dari `ENERGY_RULES` (15/25/50 mnt), bukan angka Figma
- [ ] FAQ: accordion yang bisa dioperasikan dengan keyboard; jawaban ditulis dengan nada lembut
- [ ] Logo LUMEN diekspor dari Figma dan juga dipakai sebagai favicon; ikon dari lucide
- [ ] Responsif di 390px tanpa scroll horizontal; nav ringkas di mobile
- [ ] Build, lint, dan tes lulus

## Catatan implementasi

- Audit AA pada frame `166:449` (piksel teks vs latar): teks hijau Figma sudah `#047857` (4,99–5,21:1) dan abu `#4B5563` (6,87:1). Tidak ada teks Figma yang gagal AA. Penggantian hanya pemetaan token: `#4B5563` → `ink-soft` (`#333`, lebih gelap), `#047857` → `emerald-deep`.
- Durasi Figma (5/15/25 mnt) diganti nilai `ENERGY_RULES` (15/25/50 mnt) di kartu mode, fitur Timer, dan kartu pratinjau hero (50:00, Fokus Tinggi). Chip "+5m" di kartu pratinjau dihapus karena tidak ada di aplikasi.
- Copy Figma yang berbahasa Inggris atau berklaim ADHD disesuaikan: judul hero jadi "Sedikit fokus. Sedikit kemajuan.", badge jadi "Pendamping fokus yang tenang".
- `/register` belum ada sampai issue 03; sementara rute tak dikenal jatuh ke `/`.
- Tombol "Coba tanpa daftar" (tamu) dihapus dari landing; ditangani di issue 04.
- Logo: `public/logo.png` (256px dari ekspor Figma `195:104`), dipakai juga sebagai favicon.
