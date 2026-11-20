# 06: Header aplikasi

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:274`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-274
  - `166:1329`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1329
  - `93:276`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=93-276
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di semua halaman aplikasi, pengguna melihat header sesuai Figma: logo, tanggal hari ini, nav Dasbor/Progres dengan penanda aktif, pill "Energi Mental" untuk mengubah energi hari ini, dan avatar dengan menu Profil/Keluar.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [x] Tanggal diambil dari helper tanggal lokal (bukan UTC)
- [x] Pill energi menampilkan level hari ini (default Sedang) dan membuka pilihan Rendah/Sedang/Tinggi yang menyimpan check-in lewat hook yang ada
- [ ] Avatar menampilkan inisial dari `full_name`, dengan fallback ke email, lalu "T" untuk tamu. Menu berisi Profil dan Keluar
- [x] Rute `/progress` dan `/profile` dibuat di dalam layout terproteksi dengan isi sementara; "Pustaka Jeda" tidak ditampilkan
- [x] Di bawah `md`, link nav pindah ke menu avatar
- [x] Menu bisa dioperasikan dengan keyboard; target sentuh ≥44px
- [x] Build, lint, dan tes lulus

## Catatan implementasi

- Kode: `AppHeader` (menu pakai `DropdownMenu` dari `radix-ui`), `src/lib/initials.ts`, `todayLabel` di `src/lib/format.ts`, halaman sementara `Progress` dan `Profile`, rute `/progress` dan `/profile`. Tes murni ditambahkan untuk `initials` dan `todayLabel`.
- Belum dicentang karena belum dicek di browser: tidak ada `.env.local` (Supabase) di mesin ini, jadi halaman terproteksi tidak bisa dibuka. Perlu dicek: pill energi menyimpan check-in, inisial avatar, menu Profil/Keluar, nav pindah ke menu avatar di bawah `md`, keyboard (Tab/Enter/Esc/panah), target sentuh 44px, dan kecocokan dengan Figma.
- Perubahan di luar tiket: tombol "Daftarkan email"/"Buat password" dan "Keluar" yang lama dipindah ke menu avatar; link "Fokus" dihapus dari nav (sesuai spec, Dasbor dan Progres saja).

## Comments

**File yang diubah (sesi ini):** `src/components/AppHeader.tsx` saja, untuk menyamakan dengan Figma `166:274`: logo gambar `/logo.png` + "LUMEN" hijau, tanggal dengan pemisah garis, nav aktif bergaris bawah (bukan latar mint), chevron di pill energi, avatar mint bertulisan `emerald-deep`, tinggi header 96px di `md+`, jarak antar link nav lebih lebar. Kode lain (`initials.ts`, `todayLabel`, halaman Progress/Profile, rute) sudah ada dari sesi sebelumnya.

**Penggantian warna untuk AA:** tidak ada hex mentah. Teks nav aktif, pill, dan inisial avatar memakai `text-emerald-deep` di atas putih/`bg-mint`; nav tidak aktif memakai `text-ink-soft`. `emerald` (`#059669`) tidak dipakai untuk teks.

**Langkah manual Supabase:** tidak ada. Login tamu (`signInAnonymously`) sudah aktif di project, jadi pengecekan di browser bisa jalan.

**Sudah dicek di browser (Orca, login tamu, 1280px dan 390px):**
- Header cocok dengan Figma; tanggal memakai tanggal lokal ("Sabtu, 21 November 2026").
- Pill energi: Tab ke pill, Enter membuka Rendah/Sedang/Tinggi, panah + Enter memilih Tinggi, `POST energy_checkins` 201, pill dan banner Dasbor ikut berubah.
- Avatar tamu menampilkan "T"; menu berisi Profil, Daftarkan email, Keluar. Esc menutup menu; item "Daftarkan email" membuka dialog.
- Di 390px link Dasbor/Progres hilang dari header dan muncul di menu avatar.
- `/progress` dan `/profile` terbuka di dalam layout terproteksi dengan header yang sama.
- Build, lint (hanya warning lama), dan 38 tes lulus.

**Belum dicek, tolong cek:**
- Inisial dari `full_name` dan fallback email: hanya tertutup tes `initials.test.ts`; login dengan akun nyata untuk melihat "MC"-style inisial. Kriteria avatar sengaja belum dicentang karena itu.
- Klik mouse pada item menu (pill dan avatar). Klik sintetis dari CLI tidak memicu dropdown Radix, jadi hanya jalur keyboard yang terbukti. Coba klik asli sekali.
- "Keluar" pada akun tamu (dialog konfirmasi) dan pada akun biasa; tidak saya jalankan agar sesi tamu tetap utuh.
- Bandingkan visual dengan Figma pada lebar tablet (~768px), serta kontras fokus ring.
