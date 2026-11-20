# 11: Sesi fokus: jeda, atur ulang, akhiri, dan pencatatan

**What to build:** Di `/focus` (frame `166:1173`), pengguna fokus pada langkah terpilih dengan cincin waktu tersisa. Sesi bisa dijeda, dilanjutkan, diulang, atau diakhiri lebih awal. Setiap sesi tercatat agar halaman Progres terisi.

**Blocked by:** 01, 08

**Status:** ready-for-agent

- [ ] State timer di storage mendukung jeda: yang disimpan sisa waktu, dan saat dilanjutkan `endAt` dihitung ulang. State lama tetap terbaca. `tickDecision` tidak memicu selesai saat dijeda. Aturan dua tab tetap berlaku
- [ ] Tes timer: jeda/lanjut, tahan refresh, state lama, abaikan saat dijeda, dan menit benar saat diakhiri lebih awal
- [ ] "Atur Ulang" memulai ulang dengan durasi penuh tanpa mencatat
- [ ] "Akhiri sesi" dan selesai normal menyisipkan satu baris `focus_sessions` (menit berjalan tanpa waktu jeda, dibulatkan ke bawah; di bawah 1 menit tidak dicatat), dari satu tab saja
- [ ] Dialog jeda, suara, dan notifikasi tetap seperti sekarang; tombol X kembali ke `/app` tanpa menghentikan timer
- [ ] Cincin progres punya teks waktu yang dibaca pembaca layar
- [ ] Build, lint, dan tes lulus
