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

**Status:** in-progress (kode selesai, cek browser belum dilakukan)

- [x] Tanggal diambil dari helper tanggal lokal (bukan UTC)
- [ ] Pill energi menampilkan level hari ini (default Sedang) dan membuka pilihan Rendah/Sedang/Tinggi yang menyimpan check-in lewat hook yang ada
- [ ] Avatar menampilkan inisial dari `full_name`, dengan fallback ke email, lalu "T" untuk tamu. Menu berisi Profil dan Keluar
- [ ] Rute `/progress` dan `/profile` dibuat di dalam layout terproteksi dengan isi sementara; "Pustaka Jeda" tidak ditampilkan
- [ ] Di bawah `md`, link nav pindah ke menu avatar
- [ ] Menu bisa dioperasikan dengan keyboard; target sentuh ≥44px
- [x] Build, lint, dan tes lulus

## Catatan implementasi

- Kode: `AppHeader` (menu pakai `DropdownMenu` dari `radix-ui`), `src/lib/initials.ts`, `todayLabel` di `src/lib/format.ts`, halaman sementara `Progress` dan `Profile`, rute `/progress` dan `/profile`. Tes murni ditambahkan untuk `initials` dan `todayLabel`.
- Belum dicentang karena belum dicek di browser: tidak ada `.env.local` (Supabase) di mesin ini, jadi halaman terproteksi tidak bisa dibuka. Perlu dicek: pill energi menyimpan check-in, inisial avatar, menu Profil/Keluar, nav pindah ke menu avatar di bawah `md`, keyboard (Tab/Enter/Esc/panah), target sentuh 44px, dan kecocokan dengan Figma.
- Perubahan di luar tiket: tombol "Daftarkan email"/"Buat password" dan "Keluar" yang lama dipindah ke menu avatar; link "Fokus" dihapus dari nav (sesuai spec, Dasbor dan Progres saja).
