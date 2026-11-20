# LUMEN: Tech Stack & Design System Spec

- **Tanggal:** 2026-11-13
- **Status:** Draft, menunggu review tim
- **Konteks:** GCJ 2026 (DevGirls), Kelompok 6, target Progres 1 SoftDev (penentuan teknologi, repo, struktur awal)
- **Deadline pengumpulan:** 20 November 2026
- **Sumber:** PRD LUMEN, Laporan Progres Kelompok 6, Brainstorm Ide Kelompok 6, Figma design system (`cEhdAQvduiD4OwOHK5UQdh`, node `100:95` dan `100:237`)

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

**Sumber:** Figma `cEhdAQvduiD4OwOHK5UQdh` (LUMEN GCJ 2026), frame **Design System Foundations** (`100:95`) dan **UI Component Library** (`100:237`). File lama `S3ccwOWDXWoCeQf4zHadF3` tidak dipakai lagi. Penyimpangan dari Figma demi kontras tercatat di 7.5.

### 7.1 Warna

| Token Tailwind | Nama Figma | Hex | Pemakaian |
|---|---|---|---|
| `ink` | Charcoal Black | `#252525` | Heading |
| `ink-soft` (= `foreground`) | Primary Text | `#333333` | Teks utama |
| `muted-foreground` | Muted Text | `#6E6E6E` (Figma `#757575`, lihat 7.5) | Teks sekunder, ghost button |
| `background` / `muted` | App Background | `#F4F4F4` | Latar halaman |
| `card` / `popover` | Pure White | `#FEFEFE` | Kartu, dialog |
| `border` | Subtle Border | `#E5E7EB` | Border kartu, track progress |
| `input` | Input Border | `#D1D5DB` | Border input, outline button |
| `mint` (= `accent`) | Mint Tint | `#E6F7F0` | Latar terpilih, badge |
| `soft-mint` | Soft Mint | `#A7F3D0` | Garis pemisah di atas mint |
| `emerald-hover` | Emerald Hover | `#10B981` | Belum dipakai |
| `emerald` (= `ring`) | Primary Emerald | `#059669` | Elemen non-teks: progress, checkbox, border terpilih, fokus |
| `emerald-deep` (= `primary`) | Deep Emerald | `#047857` | Tombol utama, teks hijau |
| `emerald-deeper` | (di luar Figma) | `#065F46` | Hover/active tombol utama |
| `cream` | Pale Cream | `#FEF9C3` | Kotak tips, badge "complete", latar CTA Landing |
| `gold` (= `secondary`) | Soft Gold | `#FDE68A` | Tombol secondary, ring kotak tips |
| `amber` | Warm Amber | `#F59E0B` | Aksen motif StepMark |
| `danger` (= `destructive`) | Danger Red | `#EF4444` | Border tombol hapus, error |
| `warning` / `success` | Warning Amber / Success Green | `#F59E0B` / `#10B981` | Status |

### 7.2 Tipografi

Satu keluarga: **Poppins** (400/500/600/700, Google Fonts). Nunito tidak dipakai lagi.

| Kelas | Figma | Ukuran / line-height | Weight |
|---|---|---|---|
| `text-hero` | Heading 1 (Hero) | 28 / 36px | 700 |
| `text-section` | Heading 2 (Section) | 20 / 28px | 700 |
| `text-card-title` | Heading 3 (Card Title) | 16 / 24px | 600 |
| `text-body` | Body Regular | 14 / 22px | 400 |
| `text-caption` | Caption & Badges | 12 / 16px | 500 |

- Figma juga punya **Timer Display** (48/64px Bold, tabular). Timer di halaman Focus sengaja lebih besar (72–96px) karena menjadi titik fokus layar, jadi tidak dibuat token.
- Input memakai 16px (bukan 14px) supaya Safari iOS tidak zoom saat input difokus.

### 7.3 Radius, shadow, spacing

| Token | Nilai |
|---|---|
| `--radius` / `rounded-lg` (tombol, input, baris micro-task) | 10px |
| `rounded-xl` (kartu, opsi energi) | 14px (turunan shadcn) |
| `rounded-panel` (panel besar, dialog) | 16px |
| `shadow-lg` | `0 12px 16px -4px #10182814, 0 4px 6px -2px #10182808` |
| Spacing | Skala bawaan Tailwind (kelipatan 4px) |
| Dark mode | Tidak ada untuk MVP |

### 7.4 Implementasi

Semua nilai ada di `src/index.css`: blok `@theme` (warna, tipografi, radius) dan `:root` (variabel shadcn). Tidak ada `tailwind.config.js`.

Komponen dari Component Library:

| Figma | Kode |
|---|---|
| Button (Primary, Secondary, Ghost, Disabled) | `ui/button.tsx`: `default`, `outline`, `ghost`; disabled primary = latar mint. Varian `secondary` (gold) dipakai untuk ajakan upgrade akun tamu. |
| Text input (Default, Focus) | `ui/input.tsx`: border `input`, fokus border + ring 1px `emerald` (≈ 2px) |
| Status badge (Active, Energy, Complete) | `ui/badge.tsx`: `default` (mint), `complete` (cream), `muted` (chip abu-abu) |
| Linear progress | `ui/progress.tsx`: track 8px `border`, fill `emerald` |
| Micro-task row (Default, Selected, Completed) | `StepRow` di `features/tasks/TaskCard.tsx`. Badge durasi diganti label hari (tidak ada field durasi). "Selected" = `focus-within`. Tombol ubah/hapus tetap ada. |
| Energy check-in option | `features/checkin/CheckinDialog.tsx`: kartu ditumpuk vertikal (3 level), radio dekoratif, `aria-pressed` membawa state |

### 7.5 Catatan aksesibilitas (penyimpangan dari Figma)

| Kombinasi di Figma | Rasio | Keputusan |
|---|---|---|
| Teks putih di atas `#059669` (tombol primary) | 3.74:1, gagal AA | Tombol memakai `#047857` (5.44:1). Teks `#252525` di atas `#059669` juga gagal (4.07:1). |
| Teks `#059669` di atas mint `#E6F7F0` (badge, kartu energi terpilih) | 3.4:1, gagal AA | Teks memakai `#047857` (4.94:1) |
| Muted Text `#757575` di atas `#F4F4F4` | 4.19:1, gagal AA | Memakai `#6E6E6E` (4.64:1 di `#F4F4F4`, 4.6:1 di mint) |
| Border checkbox dan radio abu-abu muda | ≈ 1.5:1, gagal 3:1 (non-teks) | Border unchecked memakai `muted-foreground` |

- Tombol danger tidak memakai teks di atas merah: bahaya ditandai lewat border `danger`, teks tetap `ink`.

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
- i18n
- Service Worker untuk notifikasi tepat waktu
- Green Gradient

**Catatan pembaruan (2026-11-21):** "Statistik/riwayat sesi fokus" tidak lagi ditunda. Profil (ganti nama, foto, email), reset kata sandi, dan aturan kata sandi (minimal 8 karakter) kini masuk scope. Skema tambahan ada di `supabase/migrations/0002_ui_slicing.sql`; rinciannya di `.scratch/lumen-figma-slicing/spec.md`.

**Risiko:**
- Notifikasi bisa terlambat saat tab di-throttle browser.
- Tanpa CAPTCHA, user palsu bisa dibuat lewat login tamu (mitigasi: rate limit Supabase).
- Layout halaman bisa berubah setelah desain hi-fi selesai. Mitigasinya, token sudah terpusat di `index.css`.
- Ada ketidaksesuaian label di Figma (7.1). Konfirmasi dengan Fahma sebelum UI final.

## 10. Langkah berikutnya

1. Tim mereview spec ini.
2. Buat rencana implementasi (writing-plans).
3. Clone repo GitHub LUMEN, scaffold sesuai bagian 2, terapkan 7.4, lalu commit spec ini ke repo.
