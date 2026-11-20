# 01: Prefactor: migrasi 0002, tipe database, dan catatan dokumen

**What to build:** Fondasi data untuk semua tiket lain, dalam satu file SQL yang cukup dijalankan pemilik repo sekali di SQL Editor. Aplikasi lama tetap berjalan tanpa perubahan perilaku.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [x] Migrasi `0002` bersifat additive dan sesuai bagian "Skema" di spec:
  - `tasks`: `category`, `priority`, `notes`, `status` (dengan check dan default), plus check panjang judul ≤60 `NOT VALID`
  - `micro_tasks`: `minutes` (default 15, 1–180) dan `done_at`
  - tabel `focus_sessions` dengan RLS "own rows" dan index `(user_id, started_at)`
  - bucket `avatars` (publik baca, ≤1MB, JPG/GIF/PNG) dengan policy tulis/ubah/hapus hanya di folder `<user_id>/`
- [x] Migrasi aman dijalankan ulang di bagian yang memungkinkan (`if not exists` / `on conflict`)
- [x] Langkah rollback ditulis sebagai komentar di akhir file
- [x] Tipe database diperbarui manual mengikuti skema baru
- [x] Spec stack: "Statistik/riwayat sesi fokus" tidak lagi ditunda; profil, reset kata sandi, dan aturan kata sandi masuk scope
- [x] Bagian skema di CLAUDE.md diperbarui
- [x] README: langkah setup menyebut migrasi `0002`, panjang minimal kata sandi 8, dan Redirect URL `/reset-password`
- [x] `npm run build`, `npm run lint`, `npm test` lulus
