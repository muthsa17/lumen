# 04: Login, Ingat saya, dan link tamu

**What to build:** Pengguna masuk di `/login` (frame `166:937`). Kalau "Ingat saya" tidak dicentang, sesi hilang saat tab ditutup. Pengunjung juga bisa mencoba sebagai tamu, dan upgrade akun tamu tetap berfungsi.

**Blocked by:** 03

**Status:** ready-for-agent

- [ ] Memakai layout split dari tiket 03 dengan copy Login dari Figma
- [ ] Klien Supabase memakai storage adapter yang memilih `localStorage` atau `sessionStorage` berdasarkan flag preferensi (default: ingat). Flag ditulis sebelum login, dan semua akses storage dibungkus try/catch
- [ ] Error kredensial: "Email atau kata sandi tidak cocok. Tarik napas dan coba lagi."
- [ ] Link "Lupa kata sandi?" ke `/forgot-password` dan "Buat akun" ke `/register`
- [ ] Link "Coba dulu tanpa akun" memakai login anonim; `UpgradeAccountDialog` dan flag password-pending tetap berfungsi
- [ ] Tombol Google tidak ditampilkan; toggle masuk/daftar lama dihapus
- [ ] Cek manual: tanpa "Ingat saya", tutup lalu buka tab → kembali ke halaman login
- [ ] Build, lint, dan tes lulus
