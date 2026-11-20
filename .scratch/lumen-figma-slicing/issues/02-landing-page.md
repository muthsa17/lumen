# 02: Landing page

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:449`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-449
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Pengunjung melihat landing page sesuai frame Figma `166:449`: nav dengan anchor, hero dengan mock kartu sesi, fitur, cara kerja, mode energi, FAQ accordion, CTA, dan footer. Semua tombol ajakan mengarah ke pendaftaran; pengguna yang sudah login diarahkan ke dasbor.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Tampilan desktop 1280 sesuai Figma; teks yang gagal AA diganti token yang lolos AA, dan tiap penggantian dicatat
- [x] Link Fitur/Cara Kerja/Energi Mental/Tanya Jawab menggulir ke bagian yang sesuai
- [x] "Mulai Sekarang", "Mulai Gratis", dan CTA bawah ke `/register`; "Masuk" ke `/login`; "Buka Aplikasi" ke `/app`
- [x] Durasi tiap mode energi dibaca dari `ENERGY_RULES` (15/25/50 mnt), bukan angka Figma
- [x] FAQ: accordion yang bisa dioperasikan dengan keyboard; jawaban ditulis dengan nada lembut
- [ ] Logo LUMEN diekspor dari Figma dan juga dipakai sebagai favicon; ikon dari lucide
- [x] Responsif di 390px tanpa scroll horizontal; nav ringkas di mobile
- [x] Build, lint, dan tes lulus

## Catatan implementasi

- Audit AA pada frame `166:449` (piksel teks vs latar): teks hijau Figma sudah `#047857` (4,99–5,21:1) dan abu `#4B5563` (6,87:1). Tidak ada teks Figma yang gagal AA. Penggantian hanya pemetaan token: `#4B5563` → `ink-soft` (`#333`, lebih gelap), `#047857` → `emerald-deep`.
- Durasi Figma (5/15/25 mnt) diganti nilai `ENERGY_RULES` (15/25/50 mnt) di kartu mode, fitur Timer, dan kartu pratinjau hero (50:00, Fokus Tinggi). Chip "+5m" di kartu pratinjau dihapus karena tidak ada di aplikasi.
- Copy Figma yang berbahasa Inggris atau berklaim ADHD disesuaikan: judul hero jadi "Sedikit fokus. Sedikit kemajuan.", badge jadi "Pendamping fokus yang tenang".
- `/register` belum ada sampai issue 03; sementara rute tak dikenal jatuh ke `/`.
- Tombol "Coba tanpa daftar" (tamu) dihapus dari landing; ditangani di issue 04.
- Logo: `public/logo.png` (256px dari ekspor Figma `195:104`), dipakai juga sebagai favicon.

## Catatan verifikasi (browser, 2026-11-21)

- Dicek di browser tertanam Orca: desktop 1280 (tanpa scroll horizontal, favicon `/logo.png`), 390px (nav ringkas, tanpa overflow), anchor menggulir ke bagian yang sesuai, href CTA (`/register`, `/login`, `/app`), durasi mode energi 15/25/50, FAQ memakai `<details>` bawaan sehingga bisa dioperasikan keyboard.
- Belum dicentang: kecocokan piksel dengan Figma 1280 (dinilai dari screenshot, tidak dibandingkan berdampingan) dan asal logo dari ekspor Figma.
- Nav mobile (<768px): tombol Menu membuka daftar anchor (dan "Masuk" di bawah `sm`), menutup setelah klik; dicek di iframe 390px dan 320px tanpa overflow. Latar CTA bawah tetap `mint`: sampel piksel Figma `166:449` memberi `#ECFDF5`, bukan cream seperti di spec §7.1.
