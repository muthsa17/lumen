# 04: Login, Ingat saya, dan link tamu

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:937`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-937
  - `166:789`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-789
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Pengguna masuk di `/login` (frame `166:937`). Kalau "Ingat saya" tidak dicentang, sesi hilang saat tab ditutup. Pengunjung juga bisa mencoba sebagai tamu, dan upgrade akun tamu tetap berfungsi.

**Blocked by:** 03

**Status:** ready-for-human

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

## Comments

**File yang diubah** (sudah ada di HEAD, sesi ini hanya memverifikasi ulang): `src/lib/auth-storage.ts` + `auth-storage.test.ts` (storage adapter dan flag `lumen.remember`), `src/lib/supabase.ts` (`auth: { storage: authStorage }`), `src/pages/Login.tsx` (layout split, Ingat saya, link tamu, error kredensial).

**Warna AA:** tidak ada penggantian baru. Teks hijau dan tombol utama memakai `emerald-deep` (`#047857`), bukan `emerald`.

**Langkah manual Supabase:** pastikan "Allow anonymous sign-ins" aktif di dashboard Auth. Isi `.env.local`.

**Verifikasi sesi ini:** `npm run build` lulus, `npm run lint` hanya warning lama, `npm test` 38/38 lulus. Diff terhadap HEAD kosong, jadi `/code-review` tidak punya perubahan baru untuk ditinjau.

**Cek di browser dengan Supabase sungguhan:**
- Login benar dan salah, dengan dan tanpa "Ingat saya" (tutup tab lalu buka `/app`).
- "Coba dulu tanpa akun", lalu `UpgradeAccountDialog` dan flag password-pending.
- Tujuan "Lupa kata sandi?" setelah tiket `/forgot-password` selesai.

**Risiko diketahui:** flag `lumen.remember` bersifat global. `Register.tsx` belum memanggil `setRemember(true)`, jadi daftar setelah sempat login tanpa "Ingat saya" menyimpan sesi di `sessionStorage`.

## Verifikasi Supabase sungguhan (2026-11-21)

Dicek di browser tertanam Orca dengan `.env.local` asli dan login anonim aktif:
- Kredensial salah (`nobody@example.com`) menampilkan "Email atau kata sandi tidak cocok. Tarik napas dan coba lagi."
- "Coba dulu tanpa akun": `signInAnonymously` berhasil, token `is_anonymous: true` hanya di `localStorage`, masuk ke `/app`.
- Menu akun menampilkan "Daftarkan email", dialog "Simpan datamu dengan email" terbuka, Esc menutupnya.

Belum dicek: login email+password dengan akun valid (tidak ada akun uji), tanpa "Ingat saya" dengan sesi sungguhan, pengiriman email verifikasi upgrade (tidak dikirim agar tidak mengirim email ke alamat sungguhan), flag password-pending setelah verifikasi, dan tujuan "Lupa kata sandi?".
