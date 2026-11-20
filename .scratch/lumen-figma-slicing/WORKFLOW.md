# Workflow implementasi per tiket

Alur `ask-matt`: to-spec ✅ → to-tickets ✅ → **`/implement` per tiket, dengan `/clear` di antara tiket**. `/implement` menjalankan `/tdd` di seam yang sudah disepakati, lalu `/code-review` (Standards + Spec). Langkah commit di `/implement` **dilewati**, karena aturan repo melarang agent meng-commit.

## Siklus per tiket

1. Pastikan semua blocker tiket sudah selesai dan sudah Anda commit. Dengan begitu `code-review` hanya melihat diff tiket ini.
2. Pastikan tidak ada sesi lain yang sedang mengerjakan tiket yang sama. Lihat baris `Status:`.
3. Ketik `/clear`.
4. Tempel prompt di bawah, ganti `<NN-slug>`.
5. Review hasilnya di browser: desktop 1280 dan mobile 390.
6. Commit sendiri, lalu ubah `Status:` tiket menjadi `resolved`.
7. Di akhir grup (①: 01–05, ②: 06–10, ③: 11, ④: 12–13, ⑤: 14–16), lakukan cek end-to-end singkat di browser.

## Prompt (salin, ganti `<NN-slug>`)

```
/mattpocock-skills:implement @.scratch/lumen-figma-slicing/issues/<NN-slug>.md

Sebelum mulai:
- Baca blok "Konteks" di tiket: spec.md, bagian frame terkait di figma-frames.md, dan CLAUDE.md.
- Kalau tiket punya node Figma: muat skill figma:figma-design-to-code, create_session dengan file key cEhdAQvduiD4OwOHK5UQdh, lalu get_screenshot + get_design_context per node. Terjemahkan ke token @theme dan komponen ui/ yang ada. Ikuti bagian "Menyimpang dari Figma".
- Terapkan andrej-karpathy-skills:karpathy-guidelines dan antislop. Gunakan ui-ux-pro-max hanya untuk mengecek state, fokus, target sentuh, dan aksesibilitas, tanpa mengubah desain.

Saat mengerjakan:
- Gunakan /mattpocock-skills:tdd untuk logika murni di src/lib (seam di spec "Testing Decisions"). UI tidak perlu tes otomatis.
- Jalankan npm run build secara berkala. Di akhir, jalankan npm run lint dan npm test.

Setelah selesai:
- Jalankan /mattpocock-skills:code-review terhadap perubahan sejak HEAD, lalu perbaiki temuan yang valid.
- JANGAN git commit / git push.
- Di file tiket: centang kriteria yang terpenuhi, set "Status: ready-for-human", dan tambahkan "## Comments" berisi: file yang diubah, penggantian warna untuk AA, langkah manual (SQL/dashboard Supabase) kalau ada, dan apa yang harus saya cek di browser.
```

## Urutan tiket

| Grup | Tiket | Blocker | Catatan |
|---|---|---|---|
| ① | 01-migrasi-0002-dan-tipe | - | Tanpa tdd. Setelah selesai, jalankan SQL 0002 di Supabase |
| ① | 02-landing-page | - | |
| ① | 03-register-dan-aturan-kata-sandi | - | tdd: aturan kata sandi |
| ① | 04-login-ingat-saya-tamu | 03 | |
| ① | 05-lupa-dan-atur-kata-sandi | 03 | Tambahkan Redirect URL `/reset-password` |
| ② | 06-header-aplikasi | - | |
| ② | 07-onboarding-energi | - | |
| ② | 08-dasbor-kartu-tugas-dan-timer | 01, 06 | Butuh SQL 0002 sudah jalan |
| ② | 09-dialog-tambah-tugas | 01, 08 | tdd: saran langkah |
| ② | 10-drag-urutkan-langkah ✂️ | 09 | |
| ③ | 11-sesi-fokus | 01, 08 | tdd: timer |
| ④ | 12-halaman-progres | 06, 11 | tdd: statistik progres |
| ④ | 13-wawasan-pola ✂️ | 12 | tdd |
| ⑤ | 14-profil-nama-bidang-email | 06 | |
| ⑤ | 15-upload-foto-profil ✂️ | 01, 14 | |
| ⑤ | 16-tab-keamanan ✂️ | 03, 14 | |

Kalau waktu mepet, lewati tiket ✂️.

## Kapan keluar dari alur ini

- **Ada bug yang sulit setelah sebuah tiket selesai:** pakai `/mattpocock-skills:diagnosing-bugs` di sesi baru.
- **Ingin review satu grup sekaligus:** pakai `/mattpocock-skills:code-review` dengan titik tetap berupa commit sebelum grup itu.
- **Semua tiket selesai:** jalankan `/retro` (opsional).
