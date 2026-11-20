# 03: Register dan aturan kata sandi

**What to build:** Pengguna baru mendaftar di `/register` (frame `166:789`) dengan nama lengkap, email, kata sandi, dan konfirmasi. Saat mengetik, checklist syarat dan meter kekuatan kata sandi ikut berubah. Nama tersimpan sehingga LUMEN bisa menyapa pengguna dengan nama.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Modul murni aturan kata sandi (minimal 8 karakter dan satu angka) menghasilkan status checklist dan level meter 0–4, dengan tes untuk kata sandi kosong, pendek, tanpa angka, valid, dan kuat
- [ ] Layout split (form + panel mint dengan ilustrasi yang diekspor dari Figma, kutipan, dan chip) dibuat agar bisa dipakai ulang oleh Login; panel disembunyikan di mobile
- [ ] Field: nama lengkap, email, kata sandi dan konfirmasi dengan tombol tampil/sembunyi, serta checkbox persetujuan (wajib dicentang; Ketentuan dan Privasi berupa teks tanpa link)
- [ ] Error konfirmasi: "Kata sandi belum cocok. Coba periksa lagi."
- [ ] `signUp` mengirim `full_name` ke `user_metadata`; tanpa session, tampil pesan "cek emailmu" dengan arah ke `/login`
- [ ] Tombol Google tidak ditampilkan
- [ ] Label terhubung ke input, error dibaca pembaca layar, dan semua bisa dipakai dengan keyboard
- [ ] Build, lint, dan tes lulus
