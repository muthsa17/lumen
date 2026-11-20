# 05: Lupa kata sandi dan atur kata sandi baru

**What to build:** Pengguna yang lupa kata sandi meminta tautan di `/forgot-password` (frame `166:906`), membuka tautan dari email, lalu menyimpan kata sandi baru di `/reset-password` (frame `166:1031`) dan langsung masuk ke dasbor.

**Blocked by:** 03

**Status:** ready-for-human

- [x] `/forgot-password` memanggil `resetPasswordForEmail` dengan `redirectTo` `<origin>/reset-password`. Setelah itu tampil state sukses dengan pesan yang sama apa pun hasilnya (keberadaan akun tidak bocor)
- [x] `/reset-password` menunggu session pemulihan (event `PASSWORD_RECOVERY` atau session yang sudah ada), lalu menampilkan form dengan checklist dari modul aturan kata sandi dan konfirmasi
- [x] Simpan memanggil `updateUser({ password })`, lalu ke `/app`
- [x] Tanpa session pemulihan: pesan bahwa tautan kedaluwarsa dan link ke `/forgot-password`
- [x] Link "Kembali ke halaman masuk" ke `/login`
- [ ] Cek manual alur penuh lewat email asli
- [x] Build, lint, dan tes lulus

## Catatan implementasi

- Sesi pemulihan: `getSession()` di AuthProvider menunggu inisialisasi klien (token di hash URL ditukar dulu), jadi `loading` selesai + `session` sudah mencakup event `PASSWORD_RECOVERY`. Sesi tamu anonim diperlakukan sebagai tanpa sesi pemulihan.
- Seam tes: `src/lib/recovery.ts` (`resetPasswordError`). Halaman tidak punya tes otomatis.
- Checklist diekstrak ke `PasswordRules` (dipakai Register dan ResetPassword).
- **Belum dicek**: kriteria manual lewat email asli dan pengecekan browser/Figma (`.env.local` tidak ada, CLI `orca browser` tidak tersedia). Kriteria "Cek manual alur penuh" sengaja dibiarkan tidak tercentang. Pastikan `<origin>/reset-password` terdaftar di Supabase Auth > URL Configuration.
