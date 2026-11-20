# 04: Login, Ingat saya, dan link tamu

**What to build:** Pengguna masuk di `/login` (frame `166:937`). Kalau "Ingat saya" tidak dicentang, sesi hilang saat tab ditutup. Pengunjung juga bisa mencoba sebagai tamu, dan upgrade akun tamu tetap berfungsi.

**Blocked by:** 03

**Status:** ready-for-agent

- [x] Memakai layout split dari tiket 03 dengan copy Login dari Figma
- [x] Klien Supabase memakai storage adapter yang memilih `localStorage` atau `sessionStorage` berdasarkan flag preferensi (default: ingat). Flag ditulis sebelum login, dan semua akses storage dibungkus try/catch
- [x] Error kredensial: "Email atau kata sandi tidak cocok. Tarik napas dan coba lagi."
- [x] Link "Lupa kata sandi?" ke `/forgot-password` dan "Buat akun" ke `/register`
- [x] Link "Coba dulu tanpa akun" memakai login anonim; `UpgradeAccountDialog` dan flag password-pending tetap berfungsi
- [x] Tombol Google tidak ditampilkan; toggle masuk/daftar lama dihapus
- [x] Cek manual: tanpa "Ingat saya", tutup lalu buka tab → kembali ke halaman login
- [x] Build, lint, dan tes lulus

## Catatan verifikasi (browser, 2026-11-21)

- Dicek di browser tertanam Orca dengan `.env.local` kosong: dev server memakai env sementara, dan `fetch` ke endpoint auth Supabase ditimpa dengan respons palsu. Jadi yang terbukti adalah perilaku klien dan penyimpanan, bukan Supabase sungguhan.
- Layout desktop cocok dengan Figma `166:937`; 390px tanpa scroll horizontal. Urutan Tab: email → kata sandi → tombol mata → Ingat saya → Lupa kata sandi? → Masuk → Coba dulu tanpa akun.
- Kredensial salah (`invalid_credentials`) menampilkan "Email atau kata sandi tidak cocok. Tarik napas dan coba lagi." sebagai `role="alert"`.
- Tanpa "Ingat saya": token hanya di `sessionStorage`; tab baru ke `/app` diarahkan ke `/login`. Dengan "Ingat saya": token di `localStorage` dan flag lama `'0'` terhapus. Login tamu: token di `localStorage`, masuk ke `/app`.
- Belum dicek: login dan `signInAnonymously` sungguhan ke Supabase, `UpgradeAccountDialog` dan flag password-pending setelah login tamu (butuh `.env.local` dan akun Supabase), serta tujuan "Lupa kata sandi?" (`/forgot-password` belum ada, tiket lain).
- Risiko diketahui: flag `lumen.remember` global, jadi login gagal dengan "Ingat saya" mati membuat tab lain yang masih mengingat sesi tampak keluar. `Register.tsx` belum memanggil `setRemember(true)`.
