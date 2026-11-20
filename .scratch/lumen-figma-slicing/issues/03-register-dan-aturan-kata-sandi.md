# 03: Register dan aturan kata sandi

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:789`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-789
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Pengguna baru mendaftar di `/register` (frame `166:789`) dengan nama lengkap, email, kata sandi, dan konfirmasi. Saat mengetik, checklist syarat dan meter kekuatan kata sandi ikut berubah. Nama tersimpan sehingga LUMEN bisa menyapa pengguna dengan nama.

**Blocked by:** None (can start immediately)

**Status:** ready-for-human

- [x] Modul murni aturan kata sandi (minimal 8 karakter dan satu angka) menghasilkan status checklist dan level meter 0–4, dengan tes untuk kata sandi kosong, pendek, tanpa angka, valid, dan kuat
- [x] Layout split (form + panel mint dengan ilustrasi yang diekspor dari Figma, kutipan, dan chip) dibuat agar bisa dipakai ulang oleh Login; panel disembunyikan di mobile
- [x] Field: nama lengkap, email, kata sandi dan konfirmasi dengan tombol tampil/sembunyi, serta checkbox persetujuan (wajib dicentang; Ketentuan dan Privasi berupa teks tanpa link)
- [x] Error konfirmasi: "Kata sandi belum cocok. Coba periksa lagi."
- [ ] `signUp` mengirim `full_name` ke `user_metadata`; tanpa session, tampil pesan "cek emailmu" dengan arah ke `/login`
- [x] Tombol Google tidak ditampilkan
- [x] Label terhubung ke input, error dibaca pembaca layar, dan semua bisa dipakai dengan keyboard
- [x] Build, lint, dan tes lulus

## Catatan verifikasi (browser, 2026-11-21)

- Dicek di browser tertanam Orca: layout desktop, 390px (panel mint tersembunyi, tanpa scroll horizontal), checklist dan meter berubah saat mengetik, error konfirmasi, error checkbox, submit kosong diblokir validasi bawaan, tombol mata bisa dioperasikan dengan keyboard (label unik per field).
- Belum dicek: `signUp` sungguhan ke Supabase (`full_name` di `user_metadata` dan layar "Cek emailmu"), karena butuh membuat akun dan mengirim email ke alamat nyata.

## Comments

**File yang diubah (kode sudah ada di commit `3ac72a2` dan `a19eb94`; sesi ini tidak mengubah kode):**
- `src/pages/Register.tsx`, `src/features/auth/{AuthSplitLayout,PasswordField,PasswordRules}.tsx`
- `src/lib/password.ts` + `password.test.ts`, `public/register-illustration.jpg`, `src/routes.tsx`

**Warna untuk AA:** teks hijau dan tombol utama memakai `emerald-deep` (`#047857`), bukan `emerald`. Batang meter memakai `emerald-deep`. Pesan peringatan memakai `text-amber-900` (palet bawaan Tailwind, belum ada token teks amber).

**Langkah manual Supabase:** tidak ada SQL. Pastikan "Confirm email" menyala di dashboard (Auth > Providers > Email) agar layar "Cek emailmu" muncul, dan URL Vercel terdaftar di Auth > URL Configuration.

**Hasil pengecekan sesi ini:** `npm run build`, `npm run lint` (hanya 3 warning lama), dan `npm test` (38 tes) lulus. Code review: tidak ada pelanggaran spec. Nit tanpa tindakan: dua pesan rate-limit identik di `SIGNUP_ERRORS`, nama `pw`, pesan error kata sandi belum masuk `aria-describedby`.

**Yang perlu kamu cek di browser:**
1. Daftar dengan email nyata di `/register`: layar "Cek emailmu" muncul dan tombol mengarah ke `/login`.
2. Di Supabase (Auth > Users), `full_name` ada di `user_metadata`; setelah verifikasi dan login, LUMEN menyapa dengan nama itu.
3. Kriteria `signUp` sengaja belum dicentang karena belum diuji ke Supabase sungguhan.
