# 08: Dasbor: kartu tugas, langkah terpilih, kartu timer dan jeda

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:274`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-274
  - `93:276`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=93-276
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di `/app` (frame `166:274`), pengguna melihat tugas aktif sebagai kartu dengan progres dan langkah bermenit. Pengguna mencentang langkah, memilih langkah untuk sesi berikutnya, dan memulai fokus dari kartu timer. Ada juga kartu saran jeda dan state kosong yang ramah.

**Blocked by:** 01, 06

**Status:** ready-for-agent

- [ ] Kartu tugas: judul, badge status, catatan, progres keseluruhan (%), daftar langkah dengan menit, dan ringkasan "N tugas mikro · perkiraan X mnt"
- [ ] Batas energi tetap memakai `splitToday`: langkah di atas batas ditandai "Bisa ditunda", tidak diblokir; tugas draf tidak ikut
- [ ] Mencentang langkah memperbarui `is_done` dan `done_at`
- [ ] Langkah terpilih (default: langkah pertama yang belum selesai) disimpan sebagai state klien di provider sesi fokus dan ditandai "Dipilih untuk sesi fokusmu berikutnya"
- [ ] Kartu timer: durasi dari energi, "Fokus pada: <langkah>", Mulai Fokus (dengan izin notifikasi dan pembukaan audio di gesture yang sama) dan Atur Ulang
- [ ] Kartu "Jeda Sadar Berikutnya" memakai daftar saran jeda yang ada
- [ ] Hapus tugas dan hapus langkah tetap tersedia
- [ ] State kosong muncul saat tidak ada tugas
- [ ] Kolom bertumpuk di mobile
- [ ] Build, lint, dan tes lulus
