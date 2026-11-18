# LUMEN: Tech Stack & Design System Spec

- **Tanggal:** 2026-11-13
- **Status:** Draft, menunggu review tim
- **Konteks:** GCJ 2026 (DevGirls), Kelompok 6, target Progres 1 SoftDev (penentuan teknologi, repo, struktur awal)
- **Deadline pengumpulan:** 20 November 2026
- **Sumber:** PRD LUMEN, Laporan Progres Kelompok 6, Brainstorm Ide Kelompok 6, Figma design system (`S3ccwOWDXWoCeQf4zHadF3`, node `1001:53` dan `1001:114`)

## 1. Tujuan dan batasan

LUMEN adalah web app untuk mahasiswa (18–24 tahun) yang mudah kewalahan oleh tugas akademik. Ada tiga fitur inti:

1. **Micro-Task Breakdown:** memecah tugas besar menjadi sub-tugas harian yang bisa dicentang.
2. **Adaptive Focus Timer:** timer fokus dengan jeda otomatis dan saran peregangan atau pernapasan.
3. **Energy Check-in:** pengguna memilih energi harian (tinggi/sedang/rendah). Pilihan ini menentukan durasi timer dan beban tugas hari itu.

Selain itu ada Landing Page. Seluruh tampilan harus responsif di mobile dan desktop.

**Batasan:**
- Hanya satu developer.
- Sisa waktu sekitar 7 hari.
- UI/UX hi-fi belum ada. Yang sudah ada baru design system (warna dan tipografi).

**Di luar scope (PRD):** kolaborasi real-time antar akun dan integrasi Google Calendar.

## 2. Keputusan stack

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Runtime | Node 24 LTS, npm | React Router v8 butuh Node ≥ 22.22 |
| Build | Vite 8, template `react-ts` | React 19.2.7+ (syarat React Router v8) |
| Bahasa | TypeScript | Tipe DB di-generate dari Supabase |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) | Tanpa `tailwind.config.js`. Token ditulis di `@theme` dalam `src/index.css` |
| Komponen UI | shadcn/ui (`shadcn@latest`) | `button checkbox dialog input card sonner progress`. Pakai `sonner`, bukan `toast` (deprecated) |
| Ikon | `lucide-react` | Ikut terpasang dengan shadcn. Dipakai juga untuk ilustrasi jeda sementara |
| Routing | React Router v8 (`react-router`) | Data mode `createBrowserRouter`. `RouterProvider` di-import dari `react-router/dom` |
| Backend | Supabase | Auth (email+password dan anonymous) serta Postgres dengan RLS |
| Akses data | `@supabase/supabase-js` langsung di custom hook | Tanpa TanStack Query |
| Test | Vitest | Hanya untuk logika murni |
| Lint/format | ESLint (bawaan template Vite) + Prettier | |
| Deploy | Vercel | SPA rewrite, deploy otomatis dari GitHub |

### Setup

```bash
npm create vite@latest lumen -- --template react-ts
npm install tailwindcss @tailwindcss/vite react-router @supabase/supabase-js
npm install -D @types/node vitest prettier
npx shadcn@latest init -t vite
npx shadcn@latest add button checkbox dialog input card sonner progress
```

- Isi `"baseUrl": "."` dan `"paths": { "@/*": ["./src/*"] }` di **`tsconfig.json` dan `tsconfig.app.json`**.
- Tambahkan alias `@` di `vite.config.ts` (`path.resolve(__dirname, "./src")`).
- Pasang `<Toaster />` dari sonner satu kali di root aplikasi.

### Environment variables

| Variabel | Isi |
|---|---|
| `VITE_SUPABASE_URL` | URL project Supabase |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Key `sb_publishable_...` (pengganti anon key) |

- Semua `VITE_*` ikut ter-bundle dan bisa dilihat publik. **Jangan pernah memasukkan service-role/secret key.**
- Di Vercel, isi kedua variabel untuk environment Production dan Preview. Setelah nilai diubah, lakukan redeploy.

### `vercel.json`

```json
{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }
```

## 3. Model data (Supabase Postgres)

```sql
create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  course text,
  deadline date,
  created_at timestamptz not null default now()
);

create table micro_tasks (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null references tasks(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  planned_date date not null,
  is_done boolean not null default false,
  position int not null default 0
);

create type energy_level as enum ('high', 'medium', 'low');

create table energy_checkins (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  date date not null,
  level energy_level not null,
  unique (user_id, date)
);
```

**RLS** aktif di ketiga tabel, dengan satu policy per tabel:

```sql
alter table tasks enable row level security;
create policy "own rows" on tasks for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
-- ulangi untuk micro_tasks dan energy_checkins
```

- User tamu (anonymous) mendapat role `authenticated`, jadi policy di atas juga berlaku untuknya.
- Riwayat sesi fokus **tidak** disimpan.
- Migrasi SQL disimpan di `supabase/migrations/`.
- Tipe di-generate dengan:

```bash
npx supabase gen types typescript --remote="$PROJECT_REF" --schema public > src/database.types.ts
```

## 4. Logika inti

### 4.1 Aturan energi (`src/lib/energy.ts`)

| Level | Fokus / jeda | Maks micro-task per hari |
|---|---|---|
| `high` | 50 / 10 menit | 6 |
| `medium` | 25 / 5 menit | 4 |
| `low` | 15 / 5 menit | 2 |

- Aturan ini disimpan sebagai satu konstanta. Angkanya boleh disesuaikan bersama PnB/UI-UX.
- Satu check-in per user per hari. Pilihan bisa diubah di hari yang sama lewat upsert pada `(user_id, date)`.
- Kalau hari ini belum check-in, dashboard menampilkan dialog check-in. Sebelum ada check-in, aturan `medium` dipakai sebagai default.

### 4.2 Batas harian bersifat soft

- Micro-task dengan `planned_date = hari ini` diurutkan berdasarkan `position`.
- N teratas tampil di **"Fokus hari ini"**. N adalah batas dari level energi.
- Sisanya tampil di **"Bisa ditunda"** dengan pesan lembut.
- Penambahan task **tidak pernah diblokir**.

### 4.3 Timer (`src/lib/timer.ts`, `src/hooks/useTimer.ts`)

- Saat mulai, simpan `{ phase, endAt }` di localStorage dengan `endAt = Date.now() + durasi`.
- Sisa waktu dihitung ulang setiap tick: `endAt - Date.now()`. Jangan menghitung jumlah tick, karena tab di background di-throttle oleh browser.
- Saat event `visibilitychange` (tab kembali terlihat), sisa waktu dihitung ulang. Kalau `endAt` sudah lewat, jalankan aksi selesai.
- Aksi selesai:
  1. Buka dialog jeda berisi saran acak dari daftar statis (6–8 item peregangan/pernapasan, teks + ikon lucide).
  2. Putar suara.
  3. Jika izin sudah diberikan, tampilkan `new Notification(...)` dalam `try/catch`. Constructor ini melempar `TypeError` di Chrome Android, jadi harus dibungkus dan dipanggil paling akhir.
- Aksi selesai hanya dijalankan oleh tab yang masih menemukan `endAt` di localStorage. Dengan begitu, dua tab yang terbuka tidak membunyikan jeda dua kali.
- `Notification.requestPermission()` hanya dipanggil dari klik tombol "Mulai", karena Firefox dan Safari menolak permintaan tanpa gesture pengguna.
- Timer tetap berjalan setelah refresh, karena state dipulihkan dari localStorage.

### 4.4 Auth

- `AuthProvider` di root:
  - Memuat sesi awal dengan `getSession()`.
  - Berlangganan `onAuthStateChange` dan melakukan `unsubscribe` saat cleanup.
  - Menyediakan state `loading`, supaya guard tidak redirect sebelum sesi selesai dipulihkan.
- `RequireAuth` adalah layout route. Kalau belum ada sesi, ia me-render `<Navigate to="/login" replace />`. Kalau ada sesi, ia me-render `<Outlet />`.
- Cara masuk:
  - email + password (`signUp`, `signInWithPassword`);
  - tombol **"Coba sebagai tamu"** (`signInAnonymously()`).
- Upgrade dari tamu ke akun permanen:
  1. `updateUser({ email })`. `user_id` tetap sama, jadi data aman.
  2. Pengguna memverifikasi email.
  3. `updateUser({ password })`.
- Anonymous sign-in harus diaktifkan di Dashboard Supabase.
- Tidak ada CAPTCHA untuk MVP. Rate limit bawaan adalah 30 per jam per IP dan bisa dinaikkan sebelum demo.

## 5. Routing (sementara)

| Path | Halaman | Akses |
|---|---|---|
| `/` | Landing | Publik |
| `/login` | Login / daftar / masuk sebagai tamu | Publik |
| `/app` | Dashboard: check-in, Fokus hari ini, daftar tugas | `RequireAuth` |
| `/focus` | Focus timer | `RequireAuth` |

Daftar ini **sementara**. Finalisasi dilakukan setelah tim menyepakati user flow dan wireframe kasar dengan UI/UX.

## 6. Struktur folder

```
src/
  lib/          supabase.ts, energy.ts, timer.ts, breaks.ts (+ *.test.ts)
  hooks/        useTasks.ts, useCheckin.ts, useTimer.ts
  features/     auth/, tasks/, checkin/, focus/
  components/ui/  (hasil shadcn, jangan diedit manual kecuali styling)
  pages/        Landing.tsx, Login.tsx, Dashboard.tsx, Focus.tsx
  routes.tsx, main.tsx, index.css, database.types.ts
supabase/migrations/
vercel.json
```

## 7. Design System

**Sumber:** Figma `S3ccwOWDXWoCeQf4zHadF3`, frame **Color Styles** (`1001:53`) dan **Typography** (`1001:114`).

**Aturan pembacaan:** di beberapa swatch, label hex tidak cocok dengan warna isinya. Spec ini memakai **warna fill/variabel Figma** sebagai acuan. Pengecualian yang sudah disepakati tim tercantum di 7.1.

### 7.1 Warna

**Base dan teks**

| Token | Hex | Catatan |
|---|---|---|
| `white` | `#FEFEFE` | Latar utama |
| `black` | `#252525` | |
| `ink` | `#181818` | Warna teks utama (frame Typography) |
| `maroon` | `#3B0000` | Aksen khusus, bukan warna tombol utama |

**Primary (hijau)**

| Token | Hex | Sumber |
|---|---|---|
| `green-light` | `#E6F9F1` | variabel |
| `green-light-hover` | `#DAF6EA` | variabel |
| `green-light-active` | `#B2EDD4` | variabel |
| `green` (**primary**) | `#05AF6C` | variabel `Foundation/Green/Normal` |
| `green-hover` | `#059E61` | label swatch (fill-nya duplikat) |
| `green-active` | `#048C56` | label swatch (fill-nya duplikat) |
| `green-dark` | `#059357` | variabel |
| `green-dark-hover` | `#16824D` | variabel |
| `green-dark-active` | `#035834` | variabel |
| `green-darker` | `#08401F` | variabel `Dark` |

**Secondary (kuning).** Label di Figma keliru, jadi semua nilai diambil dari variabel.

| Token | Hex |
|---|---|
| `yellow-light` | `#FFFAF0` |
| `yellow-light-hover` | `#FFF8E8` |
| `yellow-light-active` | `#FFF1D0` |
| `yellow` (**secondary**) | `#FFD166` |
| `yellow-hover` | `#E6BC5C` |
| `yellow-active` | `#CCA752` |
| `yellow-dark` | `#BF9D4D` |
| `yellow-dark-hover` | `#997D3D` |
| `yellow-dark-active` | `#735E2E` |
| `yellow-darker` | `#594924` |

**Neutral**

| Token | Hex |
|---|---|
| `neutral-light` | `#F4F4F4` |
| `neutral-light-hover` | `#EFEFEF` |
| `neutral-light-active` | `#DDDDDD` |
| `neutral` | `#929292` |
| `neutral-hover` | `#838383` |
| `neutral-active` | `#757575` |
| `neutral-dark` | `#6E6E6E` |
| `neutral-dark-active` | `#585858` |
| `neutral-darker` | `#333333` |

**Status**

| Token | Hex | Catatan |
|---|---|---|
| `danger` | `#F1323E` | |
| `warning` | `#FFA200` | Diambil dari fill. Label Figma menulis `#FFC837` |
| `success` | `#12AA50` | Variabel `Primary` di Figma |

**Gradient**
- **Black Gradient** = `linear-gradient(0deg, rgba(37,37,37,0) 0%, rgba(80,80,80,0.8) 89.6%)`.
- **Green Gradient belum terdefinisi.** Isinya masih placeholder abu-abu `#A9A9A9`. Tunggu nilai dari UI/UX.

### 7.2 Tipografi

- **Headline:** Poppins, line-height 1.2.
- **Body:** Nunito, line-height 1.2.
- Kedua font dimuat dari Google Fonts.

| Token | Font | Weight | Ukuran |
|---|---|---|---|
| `h1` | Poppins | 700 | 24px |
| `h2` | Poppins | 700 | 20px |
| `h3` | Poppins | 600 | 18px |
| `h4` | Poppins | 700 | 16px |
| `h5` | Poppins | 700 | 14px |
| `body-1` | Nunito | 500 / 600 | 16px |
| `body-2` | Nunito | 500 / 600 | 14px |
| `body-3` | Nunito | 500 / 600 | 12px |
| `body-4` | Nunito | 500 / 600 | 10px |

- `body-4` (10px) hanya untuk keterangan kecil. Teks yang dibaca minimal 12px.
- Ukuran body disamakan ke 16/14/12/10. Label kolom SemiBold di Figma (18/16/14/12) diabaikan.

### 7.3 Radius, shadow, spacing

| Token | Nilai |
|---|---|
| `radius` (card, input, tombol) | 8px |
| `radius-xl` (container besar) | 24px |
| `shadow-lg` | `0 12px 16px -4px #10182814, 0 4px 6px -2px #10182808` |
| Spacing | Skala bawaan Tailwind (kelipatan 4px) |
| Dark mode | Tidak ada untuk MVP |

### 7.4 Implementasi di `src/index.css`

`shadcn init` akan membuat blok `:root` sendiri. Setelah init:
- **Ganti** nilai variabel shadcn dengan yang di bawah.
- **Pertahankan** variabel lain yang dibuat shadcn (misalnya `--chart-*`, `--sidebar-*`).
- **Hapus** blok `.dark`, karena dark mode tidak dipakai.

```css
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@500;600;700&family=Poppins:wght@600;700;800&display=swap");
@import "tailwindcss";

@theme {
  --font-heading: "Poppins", sans-serif;
  --font-sans: "Nunito", sans-serif;

  --color-ink: #181818;
  --color-maroon: #3b0000;

  --color-green-light: #e6f9f1;
  --color-green-light-hover: #daf6ea;
  --color-green-light-active: #b2edd4;
  --color-green: #05af6c;
  --color-green-hover: #059e61;
  --color-green-active: #048c56;
  --color-green-dark: #059357;
  --color-green-dark-hover: #16824d;
  --color-green-dark-active: #035834;
  --color-green-darker: #08401f;

  --color-yellow-light: #fffaf0;
  --color-yellow-light-hover: #fff8e8;
  --color-yellow-light-active: #fff1d0;
  --color-yellow: #ffd166;
  --color-yellow-hover: #e6bc5c;
  --color-yellow-active: #cca752;
  --color-yellow-dark: #bf9d4d;
  --color-yellow-dark-hover: #997d3d;
  --color-yellow-dark-active: #735e2e;
  --color-yellow-darker: #594924;

  --color-neutral-light: #f4f4f4;
  --color-neutral-light-hover: #efefef;
  --color-neutral-light-active: #dddddd;
  --color-neutral: #929292;
  --color-neutral-hover: #838383;
  --color-neutral-active: #757575;
  --color-neutral-dark: #6e6e6e;
  --color-neutral-dark-active: #585858;
  --color-neutral-darker: #333333;

  --color-danger: #f1323e;
  --color-warning: #ffa200;
  --color-success: #12aa50;

  --text-h1: 24px;  --text-h1--line-height: 1.2;
  --text-h2: 20px;  --text-h2--line-height: 1.2;
  --text-h3: 18px;  --text-h3--line-height: 1.2;
  --text-h4: 16px;  --text-h4--line-height: 1.2;
  --text-h5: 14px;  --text-h5--line-height: 1.2;
  --text-body-1: 16px; --text-body-1--line-height: 1.2;
  --text-body-2: 14px; --text-body-2--line-height: 1.2;
  --text-body-3: 12px; --text-body-3--line-height: 1.2;
  --text-body-4: 10px; --text-body-4--line-height: 1.2;

  --radius-xl: 24px;
  --shadow-lg: 0 12px 16px -4px #10182814, 0 4px 6px -2px #10182808;
}

/* Pemetaan ke variabel semantik shadcn */
:root {
  --radius: 8px;
  --background: #fefefe;
  --foreground: #181818;
  --card: #ffffff;
  --card-foreground: #181818;
  --popover: #ffffff;
  --popover-foreground: #181818;
  --primary: #05af6c;
  --primary-foreground: #181818; /* lihat 7.5: putih di atas #05AF6C gagal kontras */
  --secondary: #ffd166;
  --secondary-foreground: #181818;
  --muted: #f4f4f4;
  --muted-foreground: #6e6e6e;
  --accent: #e6f9f1;
  --accent-foreground: #08401f;
  --destructive: #f1323e;
  --border: #dddddd;
  --input: #dddddd;
  --ring: #05af6c;
}
```

**Contoh pemakaian:**
- Teks dan warna: `font-heading text-h1`, `text-body-2 font-semibold`, `bg-green-light`, `hover:bg-green-hover`.
- Komponen shadcn otomatis memakai `--primary` dan variabel semantik lainnya.

### 7.5 Catatan aksesibilitas (perlu konfirmasi UI/UX)

| Kombinasi | Rasio kontras | Status |
|---|---|---|
| Teks putih di atas `#05AF6C` | ≈ 2.9:1 | Gagal WCAG AA, baik untuk teks normal (4.5:1) maupun teks besar (3:1) |
| Teks `#181818` di atas `#05AF6C` | ≈ 6.2:1 | Lulus (default di 7.4) |
| Teks putih di atas `#16824D` (`green-dark-hover`) | ≈ 4.9:1 | Lulus |
| Teks putih di atas `#F1323E` (`danger`) | ≈ 4:1 | Hanya aman untuk teks ≥ 18px atau bold ≥ 14px |

- **Opsi tombol utama:** teks `#181818` di atas `#05AF6C`, atau teks putih di atas `#16824D`. Pilihan akhirnya diputuskan bersama UI/UX.
- **Tombol danger:** pastikan label tombol memakai teks ≥ 18px atau bold ≥ 14px.

## 8. Testing

- **Vitest** untuk logika murni:
  - aturan energi (durasi dan batas harian);
  - pemisahan "Fokus hari ini" dan "Bisa ditunda";
  - perhitungan sisa waktu timer dari `endAt`, termasuk saat `endAt` sudah lewat.
- **UI dan integrasi Supabase:** dicek manual di browser (mobile dan desktop) sebelum setiap demo.

## 9. Ditunda dan risiko yang diketahui

**Ditunda setelah lomba:**
- Google OAuth
- Cloudflare Turnstile
- Statistik/riwayat sesi fokus
- i18n
- Service Worker untuk notifikasi tepat waktu
- Green Gradient

**Risiko:**
- Notifikasi bisa terlambat saat tab di-throttle browser.
- Tanpa CAPTCHA, user palsu bisa dibuat lewat login tamu (mitigasi: rate limit Supabase).
- Layout halaman bisa berubah setelah desain hi-fi selesai. Mitigasinya, token sudah terpusat di `index.css`.
- Ada ketidaksesuaian label di Figma (7.1). Konfirmasi dengan Fahma sebelum UI final.

## 10. Langkah berikutnya

1. Tim mereview spec ini.
2. Buat rencana implementasi (writing-plans).
3. Clone repo GitHub LUMEN, scaffold sesuai bagian 2, terapkan 7.4, lalu commit spec ini ke repo.
