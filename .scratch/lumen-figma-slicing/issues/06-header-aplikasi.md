# 06: Header aplikasi

**What to build:** Di semua halaman aplikasi, pengguna melihat header sesuai Figma: logo, tanggal hari ini, nav Dasbor/Progres dengan penanda aktif, pill "Energi Mental" untuk mengubah energi hari ini, dan avatar dengan menu Profil/Keluar.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Tanggal diambil dari helper tanggal lokal (bukan UTC)
- [ ] Pill energi menampilkan level hari ini (default Sedang) dan membuka pilihan Rendah/Sedang/Tinggi yang menyimpan check-in lewat hook yang ada
- [ ] Avatar menampilkan inisial dari `full_name`, dengan fallback ke email, lalu "T" untuk tamu. Menu berisi Profil dan Keluar
- [ ] Rute `/progress` dan `/profile` dibuat di dalam layout terproteksi dengan isi sementara; "Pustaka Jeda" tidak ditampilkan
- [ ] Di bawah `md`, link nav pindah ke menu avatar
- [ ] Menu bisa dioperasikan dengan keyboard; target sentuh ≥44px
- [ ] Build, lint, dan tes lulus
