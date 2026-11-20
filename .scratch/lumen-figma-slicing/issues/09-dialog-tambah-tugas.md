# 09: Dialog Tambah Tugas dan saran langkah

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `167:1622`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=167-1622
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Pengguna menambah tugas besar lewat dialog (frame `167:1622`): judul, kategori, tenggat, prioritas, catatan, dan langkah kecil bermenit yang bisa diurutkan. Pengguna bisa meminta saran langkah, lalu menyimpan sebagai draf atau sebagai tugas aktif.

**Blocked by:** 01, 08

**Status:** ready-for-agent

- [ ] Judul wajib, maksimal 60 karakter, dengan penghitung
- [ ] Kategori (6 pilihan), tenggat opsional, prioritas (Santai/Penting/Mendesak), catatan opsional; default kategori `lainnya` dan prioritas `santai`
- [ ] Langkah: tambah, ubah judul, pilih menit, hapus, naik/turun (bisa dengan keyboard). Total "N tugas mikro · estimasi X menit" ikut berubah
- [ ] Modul murni saran langkah per kategori menghasilkan 3–4 langkah dengan menit 10–25, dengan tes. Saran tidak menimpa langkah yang ada tanpa konfirmasi
- [ ] "Simpan sebagai Draf" menyimpan `status = draft`; "Simpan Tugas" menyimpan `status = active`. Langkah mendapat `planned_date` hari ini dan `position` sesuai urutan
- [ ] Input cepat di dasbor membuka dialog dengan judul sudah terisi
- [ ] Gagal simpan menampilkan toast dan isi form tidak hilang
- [ ] Dialog nyaman di mobile (scroll di dalam dialog)
- [ ] Build, lint, dan tes lulus
