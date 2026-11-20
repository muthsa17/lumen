# Peta frame Figma: slicing LUMEN

Konteks untuk setiap `/implement`. Baca bersama `spec.md`. Kalau spec bertentangan dengan Figma, **spec yang menang** (lihat kolom "Menyimpang dari Figma").

- **File key:** `cEhdAQvduiD4OwOHK5UQdh`, halaman "UIUX (High Fidelity)" (`2:4`)
- **URL dasar:** `https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=<node dengan tanda ->`
- **Design system di Figma:** node `100:95` (Foundations) dan `100:237` (Component Library). Di kode sudah ada sebagai token `@theme` dan komponen `ui/`.

## Cara memakai Figma MCP saat implementasi

1. Muat skill `figma:figma-design-to-code` **sebelum** memanggil `get_design_context`.
2. Panggil `create_session` dengan file key di atas, lalu pakai `sessionId` itu untuk semua panggilan berikutnya.
3. Per node yang relevan:
   - `get_screenshot` untuk acuan visual
   - `get_design_context` untuk struktur, ukuran, dan aset

   Hasil `get_design_context` adalah **referensi**. Terjemahkan ke token dan komponen yang sudah ada di repo; jangan pakai hex mentah atau komponen duplikat.
4. Aset raster (logo, ilustrasi) diunduh lewat URL aset dari `get_design_context`, lalu disimpan di `src/assets/`. Ikon memakai `lucide-react`.

## Daftar frame

| Frame | Node | URL | Ukuran | Rute | Tiket |
|---|---|---|---|---|---|
| Landing page | `166:449` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-449) | 1280×4696 | `/` | 02 |
| Register | `166:789` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-789) | 1280×1098 | `/register` | 03 |
| Login | `166:937` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-937) | 1280×1024 | `/login` | 04 |
| Email atur kata sandi | `166:906` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-906) | 1280×1024 | `/forgot-password` | 05 |
| Atur kata sandi baru | `166:1031` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1031) | 1280×1024 | `/reset-password` | 05 |
| Dashboard | `166:274` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-274) | 1280×1065 | `/app` | 06, 08 |
| Onboarding (cek energi) | `166:1094` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1094) | 680×691 | overlay `/app` | 07 |
| Add tugas | `167:1622` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=167-1622) | 640×1126 | dialog `/app` | 09, 10 |
| Focus Session | `166:1173` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1173) | 1280×1024 | `/focus` | 11 |
| Progress-Mu | `166:1329` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1329) | 1280×1411 | `/progress` | 12, 13 |
| Profil | `166:1229` | [link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1229) | 1280×1024 | `/profile` | 14, 15, 16 |

**Acuan mobile (satu-satunya):** `93:276` "Student Dashboard · Mobile Hi-Fi 390" ([link](https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=93-276)). Ini iterasi lama, jadi hanya dipakai untuk pola susunan mobile, bukan visual.

**Aset lepas:** `195:102` "LOGO LUMEN" dan `177:10` "Group 2".

**Bukan acuan:** frame 1440 (`67:99`, `67:188`, `82:326`, `93:95`, `96:169`) dan `189:2` (duplikat Dashboard).

## Shell bersama

- **Header app**, dipakai Dasbor, Progres, dan Profil (layer "Verbatim shell parity from Dashboard"):
  - tinggi 96px, latar putih
  - urutan kiri→kanan: logo (`LOGO LUMEN`), tanggal "Sabtu, 14 November 2026", nav **Dasbor / Progres / Pustaka Jeda** (aktif = bergaris bawah), pill "Energi Mental: Sedang" dengan chevron, avatar inisial "MC"
- **Header Focus Session:** logo di kiri, tombol tutup (X) di kanan.

## Ringkasan per frame

Copy Figma ditulis apa adanya dalam tanda kutip.

### Landing `166:449`

Urutan bagian:

1. **Nav:** Fitur, Cara Kerja, Energi Mental, Tanya Jawab (anchor), "Masuk", tombol "Mulai Sekarang".
2. **Hero:**
   - badge "Alat Fokus Ramah ADHD"
   - H1 "A little focus. A little progress"
   - subteks "Pecah tujuan besar menjadi langkah kecil, dan kerjakan dengan ritmemu sendiri. Tanpa alarm mengejutkan, tanpa beban target, dan tanpa kewalahan pikiran."
   - tombol "Mulai Gratis →" dan "Lihat cara kerja" (ikon play)
   - catatan "Gratis selamanya untuk fokus pribadi • Nyaman dan ramah perhatian"
   - di kanan, mock kartu statis: "Sesi Fokus LUMEN", "Fokus Tinggi", "Tujuan: Publikasi Buletin", "2 dari 3 langkah", langkah "Tulis 3 poin utama / Draf awal, tanpa revisi / 12 mnt", ring 25:00, tombol "Jeda" dan "+5m" (mock saja)
3. **Fitur:** "Arsitektur Lembut", "Dirancang sesuai cara kerja otak neurodivergen". Tiga kartu:
   - "Langkah Kecil" ("Bagian kecil 5 hingga 15 mnt")
   - "Pengatur Waktu Fokus Adaptif" ("Menyesuaikan kapasitas harianmu")
   - "Jeda" ("Istirahat tanpa rasa bersalah")
4. **Cara kerja:** "Alur 3 Langkah Sederhana", "Cara kerja LUMEN". Langkah: 1 "Tambah tugas besar", 2 "Pecah jadi langkah kecil", 3 "Mulai sesi fokus".
5. **Energi:** "Cek Energi Harian", "Bekerja bersama energimu, bukan melawannya". Kartu Rendah (Mode Tenang), Sedang (Seimbang), Tinggi (Hiperfokus).
6. **FAQ** "Pertanyaan yang Sering Diajukan", 4 item tertutup (jawaban tidak ada di Figma, ditulis sendiri):
   - "Apa perbedaan LUMEN dengan aplikasi Pomodoro biasa?"
   - "Bagaimana jika saya macet atau belum menyelesaikan langkah saya?"
   - "Apakah saya harus memiliki diagnosis ADHD untuk memakai LUMEN?"
   - "Apakah LUMEN bisa dipakai di ponsel dan tablet?"
7. **CTA:** "Siap dengan cara yang lebih tenang untuk menyelesaikan hal-hal penting?", tombol "Mulai sesi fokus pertamamu →".
8. **Footer:** logo, deskripsi, link (Fitur / Cara Kerja / Energi Mental / Tanya Jawab / "Buka Aplikasi"), "© 2026 LUMEN. Sedikit fokus. Sedikit kemajuan."

**Menyimpang dari Figma:** durasi energi Figma (5/15/25 mnt) diganti angka dari `ENERGY_RULES` (15/25/50).

### Register `166:789`

**Kiri (form):**
- "← Kembali ke beranda"
- H "Buat akunmu", subteks "Mulai bekerja dengan ritmemu sendiri."
- Field:
  - **Nama lengkap**
  - **Alamat email**
  - **Kata sandi**: tombol mata, meter 4 segmen berlabel misalnya "Kekuatan cukup", hint
  - **Konfirmasi kata sandi**: tombol mata
- Checkbox "Saya menyetujui Ketentuan Layanan dan Kebijakan Privasi"
- Tombol "Buat Akun" dan "Lanjutkan dengan Google"
- "Sudah punya akun? Masuk"
- State error konfirmasi (border kuning): "Kata sandi belum cocok. Coba periksa lagi."

**Kanan (panel mint):**
- badge "Ruang Kerja Tanpa Tekanan"
- ilustrasi raster "Person working calmly at desk" (ekspor)
- kutipan "Sedikit fokus. Sedikit kemajuan."
- chip "Langkah 5–15 mnt", "Jeda tenang", "Bebas alarm keras"

**Menyimpang dari Figma:**
- Google disembunyikan.
- Hint diganti checklist aturan "min 8 karakter + angka".
- Ketentuan dan Privasi jadi teks biasa tanpa link.

### Login `166:937`

- Layout split yang sama dengan Register.
- H "Selamat datang kembali", subteks "Siap untuk sedikit fokus hari ini?"
- Field email, kata sandi (mata), checkbox "Ingat saya", link "Lupa kata sandi?"
- Tombol "Masuk" dan "Lanjutkan dengan Google"
- "Belum punya akun? Buat akun"
- State error: "Email atau kata sandi tidak cocok. Tarik napas dan coba lagi."
- Panel kanan: "Selamat datang kembali. Tanpa rasa bersalah karena sempat beristirahat…"

**Menyimpang dari Figma:** Google disembunyikan; ditambah link teks "Coba dulu tanpa akun".

### Email atur kata sandi `166:906`

- Kartu tengah dengan ikon panah melingkar dan gembok.
- H "Atur ulang kata sandi", subteks "Masukkan emailmu dan kami akan mengirimkan tautan pemulihan. Tanpa terburu-buru."
- Field email, tombol "Kirim Tautan Atur Ulang" (ikon kirim), link "← Kembali ke halaman masuk".

**Menyimpang dari Figma:** state sukses tidak ada di Figma, jadi dirancang sendiri dengan gaya kartu yang sama.

### Atur kata sandi baru `166:1031`

- Kartu tengah dengan ikon kunci.
- H "Buat kata sandi baru", subteks "Pilih kata sandi baru untuk menjaga ruang fokusmu tetap aman."
- Field kata sandi baru (mata)
- Kotak "Syarat kata sandi:" berisi checklist hijau
- Konfirmasi kata sandi baru (mata)
- Tombol "Simpan Kata Sandi Baru" (ikon gembok)
- Link "← Batal dan kembali ke halaman masuk"

**Menyimpang dari Figma:** checklist "Minimal 8 karakter" dan "Minimal satu angka" saja; syarat simbol tidak dipakai.

### Dashboard `166:274`

- **Header app**, lalu hero "A little focus. A little progress" dengan subteks.
- **Kiri, "Tugas Fokus Hari Ini":**
  - badge "1 tugas aktif"
  - input cepat "Apa yang ingin kamu kerjakan?" dengan ikon +
  - tombol "+ Tambah Tugas Besar"
  - Kartu tugas:
    - judul dan badge "Aktif", deskripsi
    - "Progres keseluruhan" dengan "40% selesai" dan bar
    - "LANGKAH KECIL": langkah dengan check bulat, judul, chip menit
    - langkah terpilih disorot dengan sub-label "Dipilih untuk sesi fokusmu berikutnya"
    - footer "4 tugas mikro · perkiraan 50 mnt" dan "Siap kapan pun kamu nyaman"
- **Kanan:**
  - Kartu timer "Pengatur Waktu Fokus Adaptif":
    - "SESI FOKUS", ring "25:00 TERSISA" dengan titik oranye
    - "Fokus pada: …"
    - tombol "Mulai Fokus" dan "Atur Ulang"
    - "Sesi 25 menit · Disesuaikan dengan energimu"
  - Kartu jeda: badge "Jeda Sadar Berikutnya", "Peregangan meja 5 menit", "Lepaskan ketegangan. Segarkan kembali fokusmu.", dan kotak kuning dekoratif kosong.

**Menyimpang dari Figma:**
- Link desainer "Lihat status kosong" tidak dibuat; state kosong muncul dari data asli.
- "Pustaka Jeda" disembunyikan.

### Onboarding `166:1094`

- Logo, 3 titik progres, badge "Langkah 1 dari 3".
- H "Bagaimana energimu saat ini?", subteks "Ini membantu kami menyesuaikan durasi sesi fokusmu. Tidak ada jawaban yang salah."
- Tiga kartu pilihan (Sedang terpilih, "Disarankan untuk hari ini"):
  - Rendah "Beban pikiran ringan"
  - Sedang
  - Tinggi "Sesi fokus mendalam"
- Info "Kamu dapat mengubah ini kapan saja dengan sekali klik di bilah navigasi atas."
- Tombol "← Kembali" dan "Simpan →".

**Menyimpang dari Figma:**
- Titik progres dan "Langkah 1 dari 3" dihapus.
- Durasi dibaca dari `ENERGY_RULES`.
- "Kembali" jadi "Nanti saja".

### Add tugas `167:1622`

- **Header:** ikon +, "Tambah Tugas Besar", "Tulis tujuan besarmu, lalu pecah jadi langkah kecil.", tombol X.
- **Field:**
  - Judul tugas* (penghitung "19/60", tanda valid)
  - Kategori, chip tunggal: Belajar / Skripsi / Pekerjaan / Kreatif / Pribadi / Lainnya
  - Tenggat waktu (opsional, date)
  - Prioritas, segmented: Santai / Penting / Mendesak
  - Catatan (opsional, textarea)
- **"Pecah jadi langkah kecil":**
  - "Langkah kecil bikin mulai terasa lebih ringan. Idealnya 10-25 menit per langkah."
  - tombol "Sarankan langkah untukku" (ikon sparkle)
  - langkah bernomor: handle drag, judul, dropdown menit, ikon hapus
  - tombol putus-putus "+ Tambah langkah"
  - footer "4 tugas mikro · estimasi 50 menit" dan "Seret untuk mengubah urutan"
- **Aksi:** "Batal", "Simpan sebagai Draf", "Simpan Tugas".

**Menyimpang dari Figma:** ditambah tombol naik/turun per langkah (aksesibilitas dan layar sentuh).

### Focus Session `166:1173`

- Header minimal.
- "SESI FOKUS", ring "18:42 TERSISA" terisi sebagian.
- "Fokus pada: Rancang poin-poin kerangka".
- Tombol "Jeda" dan "Atur Ulang", link teks "Akhiri sesi".
- Footer "Kamu luar biasa. Jalani satu langkah setiap saat."

**Menyimpang dari Figma:**
- Link desainer "Simulasikan status selesai" tidak dibuat; selesai memakai dialog jeda yang ada.
- Saat dijeda, tombol jadi "Lanjutkan".

### Progress-Mu `166:1329`

- Header app (Progres aktif).
- Badge "Momentum Tenang", H "Progresmu", subteks "Langkah kecil saling bertumpuk. Setiap upaya yang tenang membangun momentum berkelanjutan."
- **3 kartu statistik:**
  - "Waktu fokus minggu ini" (4j 20m, "✓ Ritme stabil dan nyaman")
  - "Langkah yang diselesaikan" (18)
  - "Hari aktif beruntun" (5 hari, "Aktivitas harian tanpa tekanan")
- **"Menit Fokus Harian"**, grafik batang:
  - "7 hari terakhir · Grafik hari ini disorot"
  - label Min–Sab, hari ini "Hari Ini" dengan nilai di atas batang
  - badge "Rata-rata 37 mnt/hari"
- **"Tren Energi Mental"**, grafik garis:
  - sumbu Y Rendah / Sedang / Tinggi, 7 hari
  - legend "Tingkat energi"
- **Kartu "WAWASAN POLA":** "Ritme fokus pagi hari: …"
- **"Tugas yang Selesai"** ("Proyek dan kemajuan target", badge "3 proyek aktif"):
  - item: judul, %, bar, dan "2 dari 5 langkah mikro selesai" atau "Selesai pada hari Jumat · 45 mnt fokus"
- Kutipan penutup "Kemajuan adalah memiliki kebaikan hati untuk menerima keadaanmu hari ini, dan tetap melangkah satu demi satu."

**Menyimpang dari Figma:**
- Angka dari data asli.
- "15 mnt jeda tenang" tidak dibuat (menit jeda tidak dicatat).
- Wawasan Pola disembunyikan kalau sesi kurang dari 3.

### Profil `166:1229`

- Header app.
- H "Akun & Preferensi", subteks "Sesuaikan pengalaman sensorik, ritme kerja harian, dan profil pribadimu."
- Tab vertikal: **Profil** / Preferensi Fokus / Notifikasi / Keamanan.
- Panel "Profil Pribadi" ("Kelola identitas dan bagaimana LUMEN menyapamu."):
  - avatar inisial, tombol "Ubah foto", "JPG, GIF, atau PNG. Maks 1MB."
  - field Nama lengkap, Pekerjaan / Bidang, Alamat email
  - tombol "✓ Simpan Perubahan"

**Menyimpang dari Figma:**
- Preferensi Fokus dan Notifikasi disembunyikan.
- Keamanan berisi form ganti kata sandi yang mengikuti gaya frame `166:1031`.
