# 05: Lupa kata sandi dan atur kata sandi baru

**What to build:** Pengguna yang lupa kata sandi meminta tautan di `/forgot-password` (frame `166:906`), membuka tautan dari email, lalu menyimpan kata sandi baru di `/reset-password` (frame `166:1031`) dan langsung masuk ke dasbor.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] `/forgot-password` memanggil `resetPasswordForEmail` dengan `redirectTo` `<origin>/reset-password`. Setelah itu tampil state sukses dengan pesan yang sama apa pun hasilnya (keberadaan akun tidak bocor)
- [ ] `/reset-password` menunggu session pemulihan (event `PASSWORD_RECOVERY` atau session yang sudah ada), lalu menampilkan form dengan checklist dari modul aturan kata sandi dan konfirmasi
- [ ] Simpan memanggil `updateUser({ password })`, lalu ke `/app`
- [ ] Tanpa session pemulihan: pesan bahwa tautan kedaluwarsa dan link ke `/forgot-password`
- [ ] Link "Kembali ke halaman masuk" ke `/login`
- [ ] Cek manual alur penuh lewat email asli
- [ ] Build, lint, dan tes lulus
