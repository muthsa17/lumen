# 15: Upload foto profil (✂️ bisa dipotong)

**What to build:** Pengguna mengganti foto profil lewat "Ubah foto", lalu foto tampil di halaman profil dan di header.

**Blocked by:** 01, 14

**Status:** ready-for-agent

- [ ] Validasi di klien: JPG/GIF/PNG dan ≤1MB, dengan pesan lembut kalau ditolak
- [ ] Upload ke folder `<user_id>/` di bucket `avatars`; URL publik disimpan ke `user_metadata.avatar_url`
- [ ] Avatar di header dan profil memakai foto, dengan inisial sebagai cadangan kalau foto gagal dimuat
- [ ] Cek manual: tidak bisa menulis ke folder pengguna lain (RLS)
- [ ] Build, lint, dan tes lulus
