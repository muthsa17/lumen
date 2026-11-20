# 07: Kartu onboarding energi

**What to build:** Saat membuka dasbor dan belum check-in hari ini, pengguna melihat kartu "Bagaimana energimu saat ini?" (frame `166:1094`). Kartu ini menggantikan dialog check-in yang lama.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Tiga pilihan Rendah/Sedang/Tinggi dengan penjelasan durasi dari `ENERGY_RULES`; "Disarankan untuk hari ini" statis di Sedang
- [ ] Indikator "Langkah 1 dari 3" dan titik progres dihilangkan
- [ ] "Simpan" menyimpan check-in; "Nanti saja" menutup kartu dan default Sedang berlaku
- [ ] Kartu tidak muncul lagi di hari yang sama setelah disimpan atau ditutup
- [ ] Pilihan berupa radio group yang bisa dipakai dengan keyboard; fokus terkunci di dalam overlay
- [ ] Build, lint, dan tes lulus
