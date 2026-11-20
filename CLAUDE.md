# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Aturan kerja wajib

Di setiap sesi, sebelum menulis, mereview, atau me-refactor kode:

- Terapkan skill `/andrej-karpathy-skills:karpathy-guidelines` (perubahan minimal dan surgical, sebutkan asumsi, tentukan kriteria sukses yang bisa diverifikasi).
- Terapkan skill `/antislop:antislop` (hindari output generik khas AI di kode, copy, dan UI). Untuk pekerjaan UI/copy, muat juga sub-skill antislop yang relevan.
- Jangan pernah menjalankan `git commit` atau `git push`. Commit hanya dilakukan oleh pemilik repo. Biarkan perubahan tetap uncommitted.

## Produk

LUMEN adalah web app untuk mahasiswa 18–24 tahun yang kewalahan oleh tugas kuliah. Dibuat untuk Girls Code Jam (GCJ) 2026 DevGirls, Kelompok 6, subtema *Mindful Productivity & Digital Well-being*. Deadline pengumpulan: 20 November 2026. Satu developer.

Tiga fitur inti (PRD):

1. **Micro-Task Breakdown**: tugas besar (`tasks`) dipecah jadi langkah harian (`micro_tasks`) yang bisa dicentang.
2. **Adaptive Focus Timer**: timer gaya Pomodoro. Saat fokus selesai, muncul dialog jeda dengan saran peregangan/pernapasan, suara, dan notifikasi browser.
3. **Energy Check-in**: energi harian (`high`/`medium`/`low`) menentukan durasi fokus/jeda dan jumlah micro-task di "Fokus hari ini".

Di luar scope: kolaborasi real-time antar akun dan integrasi kalender eksternal. Ditunda: Google OAuth, CAPTCHA, i18n, Service Worker.

Semua teks UI berbahasa Indonesia dengan nada lembut dan tidak menghakimi. Pertahankan itu.

Dokumen sumber:
- `docs/superpowers/specs/2026-11-13-lumen-tech-stack-design.md`: keputusan stack, model data, logika inti, design system, catatan aksesibilitas. Baca ini sebelum perubahan besar.
- `docs/superpowers/plans/2026-11-13-lumen-mvp.md`: rencana implementasi MVP.
- `docs/pdf/`: PRD, brainstorm ide, laporan progres mentoring (konteks bisnis, bukan teknis). Desain hi-fi ada di Figma (link di PRD).

## Perintah

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b lalu vite build (ini juga type-check)
npm run lint      # oxlint (bukan ESLint, walau spec menyebut ESLint)
npm test          # vitest run
npx vitest run src/lib/timer.test.ts   # satu file tes
npx vitest run -t "nama tes"           # satu tes berdasarkan nama
npx prettier --write <file>            # format (tidak ada script npm)
```

Node ≥ 22.22 (disarankan 24). Butuh `.env.local` berisi `VITE_SUPABASE_URL` dan `VITE_SUPABASE_PUBLISHABLE_KEY` (lihat `.env.example`). `src/lib/supabase.ts` melempar error saat import jika keduanya kosong. Semua `VITE_*` ikut ke browser: jangan pernah pakai service_role key.

Tes hanya mencakup logika murni di `src/lib/*.test.ts`. UI dan integrasi Supabase dicek manual di browser (mobile dan desktop). `vite.config.ts` memaksa `TZ=Asia/Jakarta` saat Vitest supaya bug "hari ini" versi UTC tertangkap.

## Arsitektur

Stack: React 19 + Vite 8 + TypeScript 7, Tailwind CSS v4 + shadcn/ui (paket `radix-ui`), React Router v8 (data mode), Supabase (Auth + Postgres dengan RLS), sonner untuk toast, deploy di Vercel. Alias `@` → `src/`.

**Tidak ada backend sendiri.** Browser bicara langsung ke Supabase lewat custom hook (`src/hooks/useTasks.ts`, `useCheckin.ts`). Tanpa TanStack Query: hook memegang state lokal dan memperbaruinya secara optimistis setelah query sukses; error ditampilkan dengan `toast.error`. Keamanan data sepenuhnya bergantung pada RLS di `supabase/migrations/0001_init.sql`: setiap tabel punya `user_id default auth.uid()` dan policy "own rows", jadi insert tidak perlu mengirim `user_id`.

**Skema** (`tasks` → `micro_tasks` cascade, `energy_checkins` unik per `(user_id, date)`, `focus_sessions` dengan `micro_task_id` set null saat langkah dihapus). Migrasi `0002` menambah `tasks.category/priority/notes/status` (kolom text dengan check, judul ≤60 `NOT VALID`), `micro_tasks.minutes/done_at` (`done_at` diisi klien; baris lama null, hitungan selesai tetap pakai `is_done`), tabel `focus_sessions`, dan bucket publik `avatars` (tulis hanya di folder `<user_id>/`). `src/database.types.ts` saat ini ditulis manual. Kalau mengubah skema, buat file migrasi baru di `supabase/migrations/` dan perbarui tipe ini (atau generate ulang, lihat README).

**Alur provider dan routing** (`src/main.tsx`, `src/routes.tsx`):
- `AuthProvider` membungkus `RouterProvider` dan menyediakan `session`, `user`, `isGuest`, `loading`.
- `RequireAuth` adalah layout route untuk `/app` dan `/focus`. Ia juga memasang `FocusSessionProvider`, sehingga timer yang berjalan tetap selesai (dialog jeda, suara, notifikasi) walau pengguna pindah dari `/focus` ke `/app`.
- `FocusSessionProvider` menggabungkan check-in hari ini, `ENERGY_RULES`, dan `useTimer`, lalu mengekspos semuanya lewat `useFocusSession()`.

**Logika inti yang punya aturan tidak kasatmata:**
- `src/lib/energy.ts`: `ENERGY_RULES` adalah satu-satunya sumber angka fokus/jeda/batas harian. Default `medium` sebelum check-in. Batas harian bersifat *soft*: `splitToday` membagi micro-task hari ini menjadi "Fokus hari ini" dan "Bisa ditunda"; menambah task tidak pernah diblokir. Item yang sudah selesai tetap dihitung dalam batas.
- `src/lib/date.ts`: tanggal "hari ini" selalu lewat `todayLocal()`. Jangan pakai `toISOString()` untuk tanggal kalender (hasilnya UTC).
- `src/lib/timer.ts` + `src/hooks/useTimer.ts`: state `{ phase, endAt }` disimpan di `localStorage` (`lumen.timer`). Sisa waktu selalu `endAt - Date.now()`, bukan hitungan tick (tab background di-throttle). Saat `visibilitychange` dihitung ulang. Hanya tab yang masih menemukan `endAt` miliknya di storage yang menjalankan aksi selesai (`tickDecision`), supaya dua tab tidak berbunyi dua kali. Storage dikosongkan *sebelum* callback dipanggil.
- Notifikasi: `Notification.requestPermission()` hanya dari klik "Mulai" (Firefox/Safari butuh gesture), dan timer dimulai sebelum prompt dijawab. `new Notification()` dibungkus try/catch karena melempar di Chrome Android; `canNotify()` menangani Safari iOS yang tidak punya global `Notification`. `unlockChime()` dipanggil di gesture yang sama agar audio boleh diputar nanti.
- Auth: email+password dan login tamu (`signInAnonymously`, harus diaktifkan di dashboard Supabase). Upgrade tamu ke akun tetap (`UpgradeAccountDialog`): `updateUser({ email })` → verifikasi email → `updateUser({ password })`. `user_id` tidak berubah. Setelah verifikasi, `is_anonymous` jadi false, jadi flag `lumen.passwordPending` di localStorage (`password-pending.ts`) mengingat bahwa langkah password masih tertunda.
- Semua akses `localStorage` dibungkus try/catch dan harus tetap berfungsi kalau storage diblokir.

**Struktur:** `lib/` logika murni + tes, `hooks/` akses data/timer, `features/<auth|tasks|checkin|focus>/` komponen per fitur beserta context-nya, `pages/` komponen route, `components/ui/` hasil generate shadcn (jangan diedit manual kecuali styling; tambah komponen dengan `npx shadcn@latest add <nama>`).

## Design system

Token ada di blok `@theme` di `src/index.css` (sumber: Figma `cEhdAQvduiD4OwOHK5UQdh`, node `100:95` Foundations dan `100:237` Component Library). Tidak ada `tailwind.config.js`. Pakai token yang ada (`bg-mint`, `bg-emerald`, `text-emerald-deep`, `text-ink`, `text-ink-soft`, `text-hero`, `text-section`, `text-card-title`, `text-body`, `text-caption`), jangan hex mentah. Satu font: Poppins (`font-sans`). `#059669` (`emerald`) gagal kontras AA untuk teks di atas putih maupun mint, jadi hanya untuk elemen non-teks; teks hijau dan tombol utama memakai `emerald-deep` (`#047857`). Detail di spec §7.5.

## Deploy

Vercel, framework Vite. `vercel.json` me-rewrite semua rute ke `index.html` (SPA). Env var diisi di Vercel untuk Production dan Preview. URL Vercel harus didaftarkan di Supabase Auth > URL Configuration agar link verifikasi email benar.

## Agent skills

### Issue tracker

Issue dan spec disimpan sebagai file markdown lokal di `.scratch/<fitur>/`. Lihat `docs/agents/issue-tracker.md`.

### Triage labels

Lima label default (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`), ditulis sebagai baris `Status:` di tiap file issue. Lihat `docs/agents/triage-labels.md`.

### Domain docs

Single-context: satu `GLOSSARY.md` dan `docs/adr/` di root repo. Lihat `docs/agents/domain.md`.
