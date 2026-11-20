# 12: Halaman Progres

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:1329`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1329
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di `/progress` (frame `166:1329`), pengguna melihat waktu fokus minggu ini, jumlah langkah selesai, streak hari aktif, grafik menit fokus 7 hari, tren energi, dan daftar tugas beserta progresnya.

**Blocked by:** 06, 11

**Status:** ready-for-agent

- [ ] Modul murni statistik progres sesuai definisi di spec (minggu = 7 hari terakhir, hari aktif = ada sesi atau langkah selesai, tanggal lokal), dengan tes: batas tengah malam Asia/Jakarta, streak putus/lanjut, hari kosong, rata-rata, sesi tanpa langkah, dan data kosong
- [ ] Hook data mengambil `focus_sessions`, micro-task, dan check-in dalam rentang yang dibutuhkan; error ditampilkan lewat toast
- [ ] Kartu statistik, grafik batang menit harian (hari ini disorot, ada badge rata-rata), dan grafik garis tren energi dibuat dengan CSS/SVG, masing-masing dengan ringkasan teks untuk pembaca layar
- [ ] Daftar "Tugas yang Selesai": persen, jumlah langkah selesai/total, menit fokus, dan tanggal selesai kalau 100%. Badge jumlah tugas aktif
- [ ] Tanpa data, tampilan tetap ramah (angka nol dan ajakan memulai)
- [ ] Responsif di 390px
- [ ] Build, lint, dan tes lulus
