# 02: Landing page

**What to build:** Pengunjung melihat landing page sesuai frame Figma `166:449`: nav dengan anchor, hero dengan mock kartu sesi, fitur, cara kerja, mode energi, FAQ accordion, CTA, dan footer. Semua tombol ajakan mengarah ke pendaftaran; pengguna yang sudah login diarahkan ke dasbor.

**Blocked by:** None (can start immediately)

**Status:** ready-for-agent

- [ ] Tampilan desktop 1280 sesuai Figma; teks yang gagal AA diganti token yang lolos AA, dan tiap penggantian dicatat
- [ ] Link Fitur/Cara Kerja/Energi Mental/Tanya Jawab menggulir ke bagian yang sesuai
- [ ] "Mulai Sekarang", "Mulai Gratis", dan CTA bawah ke `/register`; "Masuk" ke `/login`; "Buka Aplikasi" ke `/app`
- [ ] Durasi tiap mode energi dibaca dari `ENERGY_RULES` (15/25/50 mnt), bukan angka Figma
- [ ] FAQ: accordion yang bisa dioperasikan dengan keyboard; jawaban ditulis dengan nada lembut
- [ ] Logo LUMEN diekspor dari Figma dan juga dipakai sebagai favicon; ikon dari lucide
- [ ] Responsif di 390px tanpa scroll horizontal; nav ringkas di mobile
- [ ] Build, lint, dan tes lulus
