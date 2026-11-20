# Spec: Slicing Figma LUMEN (11 frame) dengan integrasi penuh

Status: ready-for-agent

Sumber desain: Figma `cEhdAQvduiD4OwOHK5UQdh`, halaman "UIUX (High Fidelity)", set frame 1280 (`166:*` dan `167:*`). Frame 1440 dan `189:2` adalah iterasi lama dan bukan acuan, kecuali `93:276` (Dashboard mobile 390) sebagai acuan responsif.

| Frame | Node | Rute |
|---|---|---|
| Landing page | `166:449` | `/` |
| Register | `166:789` | `/register` |
| Login | `166:937` | `/login` |
| Email atur kata sandi | `166:906` | `/forgot-password` |
| Atur kata sandi baru | `166:1031` | `/reset-password` |
| Dashboard | `166:274` | `/app` |
| Onboarding (cek energi) | `166:1094` | overlay di `/app` |
| Add tugas | `167:1622` | dialog di `/app` |
| Focus Session | `166:1173` | `/focus` |
| Progress-Mu | `166:1329` | `/progress` |
| Profil | `166:1229` | `/profile` |

## Problem Statement

Mahasiswa yang kewalahan oleh tugas kuliah butuh LUMEN terasa tenang, jelas, dan meyakinkan. UI sekarang masih MVP fungsional yang belum mengikuti desain hi-fi Figma. Beberapa hal yang ada di desain belum ada sama sekali:

- halaman daftar terpisah dan alur lupa kata sandi
- profil dengan nama dan foto
- kategori dan prioritas tugas, serta estimasi menit per langkah
- jeda/akhiri sesi fokus
- halaman progres yang menunjukkan bahwa langkah kecil memang bertumpuk menjadi kemajuan

Tanpa ini, pengguna tidak melihat kemajuannya, tidak bisa memulihkan akun yang lupa kata sandinya, dan pengalaman saat demo tidak sesuai dengan desain yang dinilai.

## Solution

Semua 11 frame diimplementasikan 1:1 di desktop, memakai design system dan komponen yang sudah diperbarui, lalu diadaptasi secara responsif untuk mobile. Setiap layar terhubung penuh ke Supabase (Auth, Postgres dengan RLS, Storage).

- Pengguna bisa daftar dengan nama lengkap, masuk dengan opsi "Ingat saya", memulihkan kata sandi lewat email, atau mencoba sebagai tamu.
- Di dasbor, pengguna menambah tugas besar dengan kategori, prioritas, catatan, dan langkah kecil bermenit (bisa minta saran langkah), memilih langkah untuk sesi berikutnya, lalu fokus dengan timer yang bisa dijeda dan diakhiri.
- Setiap sesi fokus tercatat, sehingga halaman Progres menampilkan waktu fokus mingguan, langkah selesai, streak hari aktif, grafik menit harian, tren energi, dan wawasan pola.
- Halaman Profil mengelola nama, bidang, email, foto, dan kata sandi.

## User Stories

### Landing

1. Sebagai calon pengguna, saya ingin landing page yang menjelaskan LUMEN (fitur, cara kerja, mode energi, FAQ), supaya saya paham manfaatnya sebelum mendaftar.
2. Sebagai calon pengguna, saya ingin link navigasi Fitur/Cara Kerja/Energi Mental/Tanya Jawab menggulir ke bagian yang sesuai, supaya saya cepat menemukan informasi.
3. Sebagai calon pengguna, saya ingin FAQ berbentuk accordion yang bisa dibuka-tutup dengan keyboard, supaya jawaban mudah diakses.
4. Sebagai calon pengguna, saya ingin tombol "Mulai Sekarang", "Mulai Gratis", dan CTA bawah mengarah ke pendaftaran, supaya saya langsung bisa mulai.
5. Sebagai calon pengguna, saya ingin durasi fokus per mode energi di landing sama dengan yang benar-benar dipakai aplikasi, supaya tidak ada janji yang tidak ditepati.
6. Sebagai pengguna yang sudah login, saya ingin "Masuk" atau "Buka Aplikasi" membawa saya ke dasbor, supaya saya tidak perlu login ulang.

### Daftar

7. Sebagai pengguna baru, saya ingin mendaftar dengan nama lengkap, email, kata sandi, dan konfirmasi kata sandi, supaya LUMEN menyapa saya dengan nama.
8. Sebagai pengguna baru, saya ingin melihat checklist syarat kata sandi dan meter kekuatan saat mengetik, supaya saya tahu kata sandi saya sudah memenuhi syarat.
9. Sebagai pengguna baru, saya ingin pesan yang lembut saat konfirmasi kata sandi tidak cocok ("Kata sandi belum cocok. Coba periksa lagi."), supaya saya tidak merasa disalahkan.
10. Sebagai pengguna baru, saya ingin bisa menampilkan/menyembunyikan kata sandi, supaya saya bisa memeriksa ketikan.
11. Sebagai pengguna baru, saya harus mencentang persetujuan Ketentuan Layanan dan Kebijakan Privasi sebelum membuat akun.
12. Sebagai pengguna baru, saya ingin diberi tahu dengan jelas kalau email verifikasi sudah dikirim, supaya saya tahu langkah berikutnya.
13. Sebagai pengguna, saya ingin link "Masuk" di halaman daftar dan "Buat akun" di halaman masuk, supaya mudah berpindah.

### Masuk dan tamu

14. Sebagai pengguna terdaftar, saya ingin masuk dengan email dan kata sandi, supaya data saya muncul.
15. Sebagai pengguna di perangkat bersama, saya ingin mematikan "Ingat saya" agar sesi saya hilang saat tab ditutup, supaya akun saya aman.
16. Sebagai pengguna, saya ingin pesan kesalahan yang menenangkan saat email/kata sandi salah ("Email atau kata sandi tidak cocok. Tarik napas dan coba lagi.").
17. Sebagai pengunjung yang ragu, saya ingin link "Coba dulu tanpa akun", supaya saya bisa mencoba tanpa mendaftar.
18. Sebagai tamu, saya ingin tetap bisa meng-upgrade ke akun tetap tanpa kehilangan data, supaya percobaan saya tidak sia-sia.

### Lupa dan atur kata sandi

19. Sebagai pengguna yang lupa kata sandi, saya ingin memasukkan email dan menerima tautan pemulihan, supaya saya bisa masuk lagi.
20. Sebagai pengguna, saya ingin konfirmasi bahwa tautan sudah dikirim, dengan pesan yang sama apakah email terdaftar atau tidak, supaya saya tahu harus cek email dan keberadaan akun tidak bocor.
21. Sebagai pengguna yang membuka tautan pemulihan, saya ingin membuat kata sandi baru dengan checklist syarat dan konfirmasi, supaya akun saya aman lagi.
22. Sebagai pengguna, saya ingin langsung masuk ke dasbor setelah kata sandi baru tersimpan.
23. Sebagai pengguna yang membuka tautan kedaluwarsa, saya ingin pesan yang jelas dan jalan untuk meminta tautan baru.

### Dasbor

24. Sebagai pengguna, saya ingin header dengan logo, tanggal hari ini, navigasi Dasbor/Progres, pill energi, dan avatar, supaya orientasi saya jelas di setiap halaman.
25. Sebagai pengguna, saya ingin mengklik pill "Energi Mental" untuk mengubah energi hari ini kapan saja.
26. Sebagai pengguna, saya ingin menu di avatar berisi Profil dan Keluar.
27. Sebagai pengguna mobile, saya ingin link navigasi pindah ke menu avatar, supaya header tidak sesak.
28. Sebagai pengguna, saya ingin melihat tugas aktif saya sebagai kartu: judul, badge status, catatan, progres keseluruhan, dan daftar langkah kecil dengan menit masing-masing.
29. Sebagai pengguna, saya ingin mencentang langkah kecil dan melihat progres tugas langsung berubah.
30. Sebagai pengguna, saya ingin langkah di atas batas energi hari ini ditandai "Bisa ditunda" tanpa diblokir, supaya saya tidak kewalahan.
31. Sebagai pengguna, saya ingin memilih satu langkah sebagai "Dipilih untuk sesi fokusmu berikutnya" (default: langkah pertama yang belum selesai).
32. Sebagai pengguna, saya ingin ringkasan "N tugas mikro · perkiraan X mnt" per tugas.
33. Sebagai pengguna, saya ingin mengetik judul di input cepat "Apa yang ingin kamu kerjakan?" lalu dialog Tambah Tugas terbuka dengan judul itu terisi.
34. Sebagai pengguna, saya ingin kartu timer di dasbor menampilkan durasi sesuai energi dan langkah yang dipilih, dengan tombol Mulai Fokus dan Atur Ulang.
35. Sebagai pengguna, saya ingin kartu "Jeda Sadar Berikutnya" menampilkan saran jeda, supaya saya ingat beristirahat.
36. Sebagai pengguna baru tanpa tugas, saya ingin tampilan kosong yang ramah dan mengajak menambah tugas pertama.
37. Sebagai pengguna, saya ingin menghapus tugas dan langkah kecil.

### Cek energi (onboarding)

38. Sebagai pengguna yang belum check-in hari ini, saya ingin kartu "Bagaimana energimu saat ini?" muncul saat membuka dasbor, supaya durasi fokus menyesuaikan kondisi saya.
39. Sebagai pengguna, saya ingin pilihan Rendah/Sedang/Tinggi dengan penjelasan durasi yang sesuai aturan aplikasi.
40. Sebagai pengguna, saya ingin bisa melewati kartu ini; durasi default lalu memakai energi Sedang.

### Tambah tugas

41. Sebagai pengguna, saya ingin menulis judul tugas (wajib, maksimal 60 karakter dengan penghitung).
42. Sebagai pengguna, saya ingin memilih kategori: Belajar, Skripsi, Pekerjaan, Kreatif, Pribadi, Lainnya.
43. Sebagai pengguna, saya ingin mengisi tenggat (opsional), prioritas (Santai/Penting/Mendesak), dan catatan (opsional).
44. Sebagai pengguna, saya ingin menambah langkah kecil dengan judul dan pilihan menit, mengubah, menghapus, dan mengurutkannya.
45. Sebagai pengguna keyboard atau layar sentuh, saya ingin mengurutkan langkah dengan tombol naik/turun, tidak hanya dengan drag.
46. Sebagai pengguna yang bingung mulai dari mana, saya ingin tombol "Sarankan langkah untukku" mengisi 3–4 langkah sesuai kategori.
47. Sebagai pengguna, saya ingin melihat total "N tugas mikro · estimasi X menit" saat menyusun langkah.
48. Sebagai pengguna, saya ingin menyimpan sebagai draf (tidak muncul di fokus hari ini) atau menyimpan sebagai tugas aktif.
49. Sebagai pengguna, saya ingin langkah yang saya buat otomatis dijadwalkan untuk hari ini.

### Sesi fokus

50. Sebagai pengguna, saya ingin layar fokus penuh dengan cincin waktu tersisa dan nama langkah yang sedang dikerjakan.
51. Sebagai pengguna, saya ingin menjeda dan melanjutkan sesi tanpa kehilangan sisa waktu, termasuk setelah pindah halaman atau me-refresh.
52. Sebagai pengguna, saya ingin "Atur Ulang" mengulang sesi dari durasi penuh.
53. Sebagai pengguna, saya ingin "Akhiri sesi" menghentikan sesi lebih awal dan menit yang sudah berjalan tetap tercatat.
54. Sebagai pengguna, saya ingin dialog jeda, suara, dan notifikasi tetap muncul saat sesi selesai, walaupun saya sedang di halaman lain.
55. Sebagai pengguna, saya ingin tombol tutup (X) membawa saya kembali ke dasbor tanpa menghentikan timer.
56. Sebagai pengguna dengan dua tab, saya ingin selesai sesi hanya berbunyi dan tercatat sekali.

### Progres

57. Sebagai pengguna, saya ingin melihat total waktu fokus minggu ini.
58. Sebagai pengguna, saya ingin melihat jumlah langkah kecil yang sudah saya selesaikan.
59. Sebagai pengguna, saya ingin melihat streak hari aktif beruntun, supaya saya termotivasi tanpa tekanan.
60. Sebagai pengguna, saya ingin grafik batang menit fokus 7 hari terakhir dengan hari ini disorot dan rata-rata per hari.
61. Sebagai pengguna, saya ingin grafik tren energi 7 hari dari check-in saya.
62. Sebagai pengguna, saya ingin satu kalimat "Wawasan Pola" tentang kapan saya paling fokus, setelah datanya cukup.
63. Sebagai pengguna, saya ingin daftar tugas dengan persentase, jumlah langkah selesai, dan menit fokus per tugas.
64. Sebagai pengguna baru tanpa data, saya ingin tampilan progres yang tetap ramah (angka nol dan ajakan memulai), bukan grafik rusak.
65. Sebagai pembaca layar, saya ingin grafik punya teks alternatif atau ringkasan yang bisa dibaca.

### Profil

66. Sebagai pengguna, saya ingin mengubah nama lengkap dan pekerjaan/bidang saya.
67. Sebagai pengguna, saya ingin mengunggah foto profil (JPG/GIF/PNG, maksimal 1MB), dengan inisial sebagai cadangan.
68. Sebagai pengguna, saya ingin mengubah email dan diberi tahu bahwa perubahan perlu dikonfirmasi lewat email.
69. Sebagai pengguna, saya ingin tab Keamanan untuk mengganti kata sandi dengan syarat yang sama seperti saat mendaftar.
70. Sebagai tamu, saya ingin halaman profil mengajak saya meng-upgrade akun.

### Lintas fitur

71. Sebagai pengguna mobile, saya ingin semua layar nyaman dipakai di lebar ponsel tanpa scroll horizontal.
72. Sebagai pengguna dengan gangguan penglihatan, saya ingin teks hijau dan tombol memenuhi kontras AA.
73. Sebagai pengguna keyboard, saya ingin semua kontrol bisa dicapai dan punya fokus yang terlihat.
74. Sebagai pengguna, saya ingin pesan error yang lembut lewat toast saat koneksi atau server gagal.

## Implementation Decisions

### Proses pengerjaan

- **Urutan grup, dengan berhenti untuk review di browser setelah tiap grup:**
  1. Auth: Landing, Register, Login, lupa dan atur kata sandi, migrasi `0002`.
  2. Dasbor, Onboarding energi, Tambah tugas.
  3. Sesi fokus.
  4. Progres.
  5. Profil.
- **Tenggat:** 22 November 2026. Kalau waktu habis, urutan yang dipotong:
  1. Wawasan Pola
  2. drag untuk mengurutkan (tombol naik/turun tetap ada)
  3. upload foto (inisial tetap ada)
  4. tab Keamanan
- **Fidelitas:** layout, spacing, dan visual mengikuti Figma. Teks yang memakai `emerald` (`#059669`) atau warna lain yang gagal AA diganti token terdekat yang lolos AA (biasanya `emerald-deep`). Target sentuh minimal 44px. Setiap penggantian dicatat di laporan grup.
- **Panduan UI/UX** (`ui-ux-pro-max`) hanya dipakai untuk memeriksa state, fokus, target sentuh, dan aksesibilitas. Desain tidak diubah.
- **Aset:** logo dan ilustrasi diekspor dari Figma. Ikon memakai `lucide-react` yang sudah terpasang. Hanya ikon kustom tanpa padanan yang diekspor. Kotak ilustrasi kuning kosong di kartu jeda tetap kotak dekoratif.
- **Komponen:** pakai token `@theme` dan komponen `ui/` yang ada. Komponen shadcn baru ditambah lewat CLI shadcn: kemungkinan textarea, accordion, dropdown-menu, tabs, dan radio/toggle group, sesuai kebutuhan.
- **Tidak ada dependency baru.** Grafik dibuat dengan CSS/SVG. Pengurutan memakai HTML5 drag plus tombol naik/turun.

### Rute dan shell

- **Rute publik:** `/`, `/register`, `/login`, `/forgot-password`, `/reset-password`.
- **Rute terproteksi** (di bawah `RequireAuth`, jadi `FocusSessionProvider` tetap melingkupi semuanya): `/app`, `/focus`, `/progress`, `/profile`.
- **Header aplikasi** (dipakai Dasbor, Progres, Profil): logo, tanggal hari ini (`dayLabel`/`todayLocal`), link Dasbor dan Progres dengan penanda aktif, pill energi, avatar.
  - Pill energi membuka pilihan energi dan memakai `useCheckin().setLevel`.
  - Avatar membuka menu Profil dan Keluar.
  - Di bawah `md`, link navigasi masuk ke menu avatar.
  - "Pustaka Jeda" disembunyikan.
- **Focus Session** memakai header minimal: logo, dan tombol X ke `/app`.

### Auth

- **Register:** `signUp` dengan `options.data.full_name`. Kalau tidak ada session karena email harus dikonfirmasi, tampilkan pesan "cek emailmu" lalu arahkan ke Login.
- **Login:** `signInWithPassword`. Link tamu "Coba dulu tanpa akun" memakai `signInAnonymously`. `UpgradeAccountDialog` dan flag `lumen.passwordPending` dipertahankan.
- **Tombol Google disembunyikan** di Register dan Login.
- **Ingat saya:**
  - Klien Supabase memakai storage adapter kecil yang memilih `localStorage` atau `sessionStorage` berdasarkan flag preferensi di `localStorage`.
  - Flag ditulis sebelum `signInWithPassword` dan defaultnya ingat.
  - Semua akses storage dibungkus try/catch dan tetap jalan kalau storage diblokir.
- **Lupa kata sandi:** `resetPasswordForEmail(email, { redirectTo: <origin>/reset-password })`. Setelah dikirim, tampilkan state sukses dengan pesan yang sama apa pun hasilnya.
- **Atur kata sandi baru:**
  - Halaman `/reset-password` menunggu session pemulihan dari tautan (event `PASSWORD_RECOVERY`, atau session yang sudah ada), lalu memanggil `updateUser({ password })`, lalu ke `/app`.
  - Tanpa session pemulihan, tampilkan pesan tautan kedaluwarsa dan link ke `/forgot-password`.
- **Aturan kata sandi** (satu sumber, dipakai Register, Atur kata sandi baru, dan tab Keamanan):
  - minimal 8 karakter
  - minimal satu angka
  - Meter kekuatan 4 segmen diturunkan dari aturan ini (panjang, angka, huruf besar/kecil, simbol sebagai bonus). Syarat simbol dari frame reset tidak dipakai.
- **Ketentuan Layanan dan Kebijakan Privasi** jadi teks biasa tanpa link. Checkbox persetujuan tetap wajib.

### Profil (tanpa tabel baru)

- **Data profil di `user_metadata`:** `full_name`, `occupation`, `avatar_url`. Inisial dihitung dari `full_name`, dengan fallback ke email, lalu "T" untuk tamu.
- **Foto di Storage bucket `avatars`:**
  - Bucket publik untuk baca.
  - Tulis/ubah/hapus hanya di folder `<user_id>/` milik sendiri (RLS di `storage.objects`).
  - Validasi tipe (JPG/GIF/PNG) dan ukuran (≤1MB) di klien, plus `file_size_limit` dan `allowed_mime_types` di bucket.
- **Ganti email** lewat `updateUser({ email })`, dengan pesan bahwa konfirmasi dikirim ke email baru.
- **Tab yang tampil:** Profil dan Keamanan (ganti kata sandi). Preferensi Fokus dan Notifikasi disembunyikan.

### Skema: migrasi `0002` (additive, data lama tetap valid)

- **`tasks`**, kolom baru:
  - `category`: text, not null, default `'lainnya'`, check ∈ {`belajar`, `skripsi`, `pekerjaan`, `kreatif`, `pribadi`, `lainnya`}
  - `priority`: text, not null, default `'santai'`, check ∈ {`santai`, `penting`, `mendesak`}
  - `notes`: text, nullable
  - `status`: text, not null, default `'active'`, check ∈ {`draft`, `active`}
  - check `char_length(title) <= 60` dengan `NOT VALID`, supaya baris lama tidak gagal
- **`micro_tasks`**, kolom baru:
  - `minutes`: int, not null, default 15, check 1–180
  - `done_at`: timestamptz, nullable. Klien mengisinya saat `is_done` jadi true dan mengosongkannya saat false. Baris lama yang sudah selesai dibiarkan null; hitungan selesai memakai `is_done`, tanggal selesai memakai `done_at`.
- **Tabel baru `focus_sessions`:**
  - `id` uuid PK
  - `user_id` default `auth.uid()`, FK ke `auth.users` on delete cascade
  - `micro_task_id`: FK ke `micro_tasks` on delete set null
  - `started_at` timestamptz not null
  - `ended_at` timestamptz not null
  - `minutes` int not null, check > 0
  - index `(user_id, started_at)`
  - RLS dengan policy "own rows" seperti tabel lain
- **Bucket `avatars`** dan policy-nya dibuat di migrasi yang sama.
- **Rollback:** drop tabel `focus_sessions`, drop kolom-kolom baru, hapus policy dan bucket `avatars`. Tidak ada data lama yang diubah.
- **`database.types.ts`** diperbarui manual mengikuti skema ini.
- **Status:** migrasi dijalankan pemilik repo lewat SQL Editor.

### Data hooks

- **`useTasks`** diperluas:
  - `addTask` menerima category, priority, notes, status, dan daftar langkah (judul, menit, urutan) dalam satu aksi.
  - Ada aksi baru untuk mengubah status/field tugas dan mengurutkan ulang langkah (update `position`).
  - `updateMicroTask` mengisi `done_at`.
  - Langkah baru mendapat `planned_date` hari ini.
- **"Fokus hari ini"** tetap memakai `splitToday` dan batas lunak dari `ENERGY_RULES`. Tugas `draft` dikecualikan.
- **Langkah terpilih** untuk sesi berikutnya adalah state klien di `FocusSessionProvider`, tidak disimpan di database. Defaultnya langkah pertama yang belum selesai.
- **Hook data progres baru:** mengambil `focus_sessions` 7 hari terakhir plus rentang yang dibutuhkan streak, `micro_tasks`, dan `energy_checkins` 7 hari, lalu menyerahkannya ke modul statistik progres. Error ditampilkan dengan `toast.error`.

### Energi

- **`ENERGY_RULES` tetap satu-satunya sumber angka:** high 50/10, medium 25/5, low 15/5 (menit fokus/jeda), batas 6/4/2.
- **Copy di landing dan onboarding** dibaca dari aturan ini, sehingga tertulis 15/25/50 mnt. Angka di Figma (5/15/25) tidak dipakai.
- **Onboarding** hanya terdiri dari langkah energi.
  - Indikator "Langkah 1 dari 3" dan titik progres dihilangkan.
  - Kartu ini menggantikan tampilan `CheckinDialog` untuk check-in pertama hari itu.
  - "Disarankan untuk hari ini" statis di Sedang.
  - "Kembali" menjadi "Nanti saja", yang menutup kartu dan memakai default.

### Timer

- **State timer di `lumen.timer`** diperluas dengan status jeda. Saat dijeda, yang disimpan adalah sisa waktu (`remainingMs`), bukan `endAt`. Saat dilanjutkan, `endAt` dihitung ulang dari sekarang.
  - State lama tanpa field jeda tetap terbaca.
  - `tickDecision` tidak memicu selesai saat dijeda.
  - Aturan dua tab tetap berlaku.
- **Pencatatan:** sesi fokus yang selesai normal atau lewat "Akhiri sesi" menyisipkan satu baris `focus_sessions` dengan menit yang benar-benar berjalan. Waktu yang dijeda tidak dihitung, dan sesi di bawah 1 menit tidak dicatat.
  - Untuk itu state menyimpan `startedAt`, akumulasi menit, dan `micro_task_id`.
  - Hanya tab yang menjalankan aksi selesai yang mencatat.
- **"Atur Ulang"** memulai ulang fase dengan durasi penuh tanpa mencatat.
- **"+5m"** tidak dibuat.
- **Dialog jeda, suara, notifikasi, `unlockChime`, dan izin notifikasi** tetap seperti sekarang.

### Saran langkah

- Template statis per kategori, 3–4 langkah dengan menit 10–25, berbahasa Indonesia dengan nada lembut. Langkah yang ada tidak ditimpa diam-diam: saran ditambahkan kalau daftar kosong, atau meminta konfirmasi kalau sudah ada isinya.

### Statistik progres (satu modul murni)

**Input:** sesi fokus, micro-task (beserta tugasnya), check-in energi, dan tanggal "hari ini" lokal.

**Output:**

- **Menit fokus minggu ini:** 7 hari terakhir termasuk hari ini, ditampilkan "Xj Ym".
- **Menit per hari selama 7 hari:** label hari Min–Sab, hari ini ditandai, plus rata-rata per hari.
- **Jumlah langkah selesai:** semua waktu, `is_done`.
- **Streak hari aktif:** hari berturut-turut sampai hari ini, atau sampai kemarin kalau hari ini belum ada aktivitas. Hari aktif = ada sesi fokus atau langkah selesai (`done_at`) pada tanggal lokal itu.
- **Tren energi 7 hari:** hari tanpa check-in kosong, tidak diisi default.
- **Per tugas:** persen selesai, jumlah selesai/total langkah, menit fokus (jumlah sesi lewat `micro_task_id`), dan tanggal selesai kalau 100%.
- **Jumlah tugas aktif.**
- **Wawasan Pola:**
  - Satu kalimat berbasis aturan: rentang waktu (pagi/siang/sore/malam) dengan menit fokus terbanyak, plus energi yang paling sering.
  - `null` kalau sesi kurang dari 3, dan kartunya disembunyikan.
- **Caption "Ritme stabil dan nyaman"** statis.
- **Semua pengelompokan tanggal memakai tanggal lokal**, bukan `toISOString()`.

## Testing Decisions

- **Pola yang dipertahankan:** tes otomatis hanya untuk logika murni di `lib/` (Vitest, `TZ=Asia/Jakarta`). UI, RLS, Storage, dan migrasi dicek manual di browser desktop dan mobile.
- **Tes yang baik** menguji perilaku yang terlihat dari luar fungsi (input data biasa → output), bukan detail implementasi. Tidak ada mock Supabase atau React.
- **Seam yang diuji:**
  1. **Timer** (diperluas):
     - sisa waktu benar setelah jeda dan lanjut
     - state jeda tahan refresh (parse dari storage)
     - state lama tetap terbaca
     - `tickDecision` mengabaikan state jeda
     - menit tercatat benar saat diakhiri lebih awal, tanpa waktu jeda
  2. **Energi** (yang ada): tes `splitToday` yang sudah ada menjadi pengaman regresi, ditambah kasus tugas draft dikecualikan kalau logikanya masuk ke sini.
  3. **Statistik progres** (baru, paling penting):
     - batas hari tengah malam di Asia/Jakarta
     - streak putus vs. lanjut, termasuk hari ini belum aktif
     - 7 hari dengan hari kosong
     - rata-rata
     - per tugas dengan sesi tanpa `micro_task_id`
     - Wawasan Pola `null` di bawah 3 sesi
     - data kosong
  4. **Aturan kata sandi** (baru): checklist dan level meter untuk kata sandi kosong, pendek, tanpa angka, valid, dan kuat.
  5. **Saran langkah** (baru): setiap kategori menghasilkan 3–4 langkah dengan judul tidak kosong dan menit dalam rentang.
- **Prior art:** `src/lib/timer.test.ts`, `energy.test.ts`, `date.test.ts`, `format.test.ts`.
- **Cek manual per grup:**
  - alur end-to-end di browser: daftar → verifikasi → masuk → tambah tugas → fokus → jeda → akhiri → progres terisi → ubah profil/foto → lupa kata sandi → atur ulang
  - di lebar 390px dan 1280px
  - dengan keyboard saja untuk form dan dialog
- **Gerbang sebelum selesai:** `npm run build`, `npm run lint`, dan `npm test` lulus.

## Out of Scope

- Google OAuth. Tombol disembunyikan, kode tidak dibuat.
- CAPTCHA, i18n, Service Worker, kolaborasi real-time, dan integrasi kalender, sesuai PRD dan spec stack.
- Pustaka Jeda, karena tidak ada frame 1280.
- Tab Preferensi Fokus dan Notifikasi di Profil.
- Onboarding langkah 2–3.
- Tombol "+5m" di timer.
- Halaman Ketentuan Layanan dan Kebijakan Privasi.
- Saran langkah berbasis AI.
- Link khusus desainer "Lihat status kosong" dan "Simulasikan status selesai". State kosong muncul dari data asli, dan state selesai memakai dialog jeda yang ada.
- Tabel `profiles` terpisah.
- Pengurutan dengan library drag-and-drop.
- Frame 1440 lama dan frame `189:2`.

## Further Notes

- **Langkah manual untuk pemilik repo:**
  1. Jalankan migrasi `0002` di SQL Editor Supabase.
  2. Set panjang minimal kata sandi 8 di Authentication > Providers > Email.
  3. Tambahkan `<origin>/reset-password` (lokal dan Vercel) ke Redirect URLs.
  4. Pastikan login anonim tetap aktif.
- **Spec stack** (`docs/superpowers/specs/2026-11-13-lumen-tech-stack-design.md`) perlu satu catatan bahwa "Statistik/riwayat sesi fokus" tidak lagi ditunda, dan bahwa profil, reset kata sandi, dan aturan kata sandi baru masuk scope. Perbarui juga bagian skema di `CLAUDE.md`.
- **Asumsi** yang belum ada di Figma dan diputuskan di spec ini:
  - input cepat di dasbor membuka dialog Tambah Tugas dengan judul terisi
  - default kategori `lainnya` dan prioritas `santai`
  - definisi minggu = 7 hari terakhir
  - definisi hari aktif sesuai bagian statistik
- **Konflik antar frame** diselesaikan begini: durasi energi mengikuti `ENERGY_RULES`, dan syarat kata sandi = 8 karakter + angka.
- **Risiko:** foto profil di bucket publik bisa diakses siapa pun yang tahu URL-nya. Path memakai `user_id`, jadi tidak mudah ditebak. Ini diterima untuk MVP.
- **Aturan kerja:** tidak ada `git commit` atau `git push`. Pemilik repo yang meng-commit.
