# 14: Profil: nama, bidang, dan email

**What to build:** Di `/profile` (frame `166:1229`), pengguna mengubah nama lengkap, pekerjaan/bidang, dan email. Nama dan inisial di header ikut berubah.

**Blocked by:** 06

**Status:** ready-for-agent

- [ ] Layout "Akun & Preferensi" dengan tab vertikal; hanya Profil (dan Keamanan dari tiket 16) yang tampil
- [ ] Simpan `full_name` dan `occupation` ke `user_metadata`; header ikut diperbarui
- [ ] Ganti email lewat `updateUser({ email })` dengan pesan bahwa konfirmasi dikirim ke email baru
- [ ] Tamu melihat ajakan upgrade akun (memakai dialog upgrade yang ada)
- [ ] Avatar menampilkan inisial
- [ ] Kolom bertumpuk di mobile
- [ ] Build, lint, dan tes lulus
