# 13: Wawasan Pola (✂️ bisa dipotong)

**Konteks (baca dulu):**
- Spec: `.scratch/lumen-figma-slicing/spec.md`
- Peta frame dan penyimpangan dari Figma: `.scratch/lumen-figma-slicing/figma-frames.md` (bagian frame terkait)
- Figma (file key `cEhdAQvduiD4OwOHK5UQdh`):
  - `166:1329`: https://www.figma.com/design/cEhdAQvduiD4OwOHK5UQdh/LUMEN-GCJ-2026--Copy-?node-id=166-1329
- Aturan repo: `CLAUDE.md` (tanpa `git commit`/`git push`, token design system, aksesibilitas)

**What to build:** Di halaman Progres, pengguna membaca satu kalimat tentang kapan biasanya ia paling fokus, setelah datanya cukup.

**Blocked by:** 12

**Status:** ready-for-agent

- [ ] Fungsi di modul statistik memilih rentang waktu (pagi/siang/sore/malam) dengan menit fokus terbanyak, plus energi yang paling sering, lalu menyusun kalimat bernada lembut
- [ ] Mengembalikan null kalau sesi kurang dari 3; kartunya lalu disembunyikan
- [ ] Ada tes
- [ ] Build, lint, dan tes lulus
