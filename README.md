# LUMEN

Web app untuk mahasiswa yang kewalahan dengan tugas kuliah. LUMEN membantu memecah tugas besar jadi langkah harian (Micro-Task Breakdown), menyesuaikan target dengan energi hari itu (Energy Check-in), dan menjaga fokus dengan jeda terjadwal (Adaptive Focus Timer).

Girls Code Jam 2026, Kelompok 6.

- Spec: `docs/superpowers/specs/2026-11-13-lumen-tech-stack-design.md`
- Rencana implementasi: `docs/superpowers/plans/2026-11-13-lumen-mvp.md`

## Stack

React 19 + Vite 8 + TypeScript, Tailwind CSS v4 + shadcn/ui, React Router v8, Supabase (Auth + Postgres dengan RLS), Vitest, deploy di Vercel.

## Menjalankan secara lokal

Butuh Node 22.22 atau lebih baru (disarankan Node 24 LTS).

1. Pasang dependency:

   ```bash
   npm install
   ```

2. Siapkan Supabase (sekali saja):
   1. Buat project di [supabase.com](https://supabase.com).
   2. Buka **Authentication > Sign In / Providers**, lalu aktifkan **Anonymous sign-ins** (dipakai tombol "Coba tanpa daftar").
   3. Buka **SQL Editor**, lalu jalankan isi `supabase/migrations/0001_init.sql`.
   4. Salin **Project URL** dan **Publishable key** dari **Project Settings > API Keys**.

3. Buat file `.env.local` dari contoh, lalu isi kedua nilainya:

   ```bash
   cp .env.example .env.local
   ```

   Jangan pernah mengisi `service_role` / secret key di sini. Semua variabel `VITE_*` ikut terkirim ke browser.

4. Jalankan:

   ```bash
   npm run dev
   ```

## Perintah lain

| Perintah | Fungsi |
|---|---|
| `npm test` | Tes logika (`src/lib`), dijalankan dalam zona waktu WIB |
| `npm run build` | Cek tipe lalu build produksi ke `dist/` |
| `npm run lint` | Lint dengan oxlint |

## Memperbarui tipe database

`src/database.types.ts` saat ini ditulis manual mengikuti skema. Setelah project Supabase ada, buat ulang dari skema asli:

```bash
npx supabase gen types typescript --remote="$PROJECT_REF" --schema public > src/database.types.ts
```

## Deploy ke Vercel

1. Import repo ini di Vercel (framework terdeteksi sebagai Vite).
2. Isi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` di **Settings > Environment Variables** untuk Production dan Preview.
3. Deploy. `vercel.json` sudah mengarahkan semua rute ke `index.html`, jadi refresh di `/app` atau `/focus` tidak 404.
4. Di Supabase, isi URL Vercel di **Authentication > URL Configuration** (Site URL dan Redirect URLs) supaya link verifikasi email mengarah ke aplikasi.
